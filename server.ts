import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

const DISAN_FILE = path.resolve(__dirname, 'disan.json');
const NGUON_FILE = path.resolve(__dirname, 'nguon_tu_lieu.json');
const MAU_DISAN_FILE = path.resolve(__dirname, 'mau_disan.json');
const MAU_NGUON_FILE = path.resolve(__dirname, 'mau_nguon_tu_lieu.json');

// Protected initial IDs that cannot be deleted
const INITIAL_DISAN_IDS = ['DS001', 'DS002', 'DS003', 'DS004', 'DS005', 'DS006', 'DS007', 'DS008', 'DS009', 'DS010'];
const INITIAL_NGUON_IDS = ['SRC001', 'SRC002', 'SRC003', 'SRC004', 'SRC005', 'SRC006', 'SRC007', 'SRC008', 'SRC009', 'SRC010', 'SRC011', 'SRC012'];

const ADMIN_SECRET_KEY = process.env.ADMIN_KEY || 'hungvuong2026';

function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return fallback;
  }
}

function writeJsonFile<T>(filePath: string, data: T): boolean {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
}

// Authentication middleware for administrative operations
const adminAuth = (req: Request, res: Response, next: () => void) => {
  const token = req.headers['x-admin-key'] || req.headers.authorization?.replace('Bearer ', '');
  if (token === ADMIN_SECRET_KEY) {
    next();
  } else {
    res.status(401).json({ error: 'Yêu cầu quyền quản trị viên hợp lệ.' });
  }
};

// API Routes
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { key } = req.body;
  if (key === ADMIN_SECRET_KEY) {
    res.json({ success: true, token: ADMIN_SECRET_KEY, message: 'Đăng nhập quản trị thành công' });
  } else {
    res.status(401).json({ success: false, message: 'Mã quản trị viên không chính xác.' });
  }
});

// Heritage profile endpoints
app.get('/api/disan', (_req: Request, res: Response) => {
  const data = readJsonFile(DISAN_FILE, []);
  res.json(data);
});

app.get('/api/disan/:id', (req: Request, res: Response) => {
  const data = readJsonFile<any[]>(DISAN_FILE, []);
  const found = data.find((item) => item.id === req.params.id);
  if (!found) {
    res.status(404).json({ error: 'Không tìm thấy hồ sơ di sản' });
    return;
  }
  res.json(found);
});

app.post('/api/disan', adminAuth, (req: Request, res: Response) => {
  const newItem = req.body;
  if (!newItem.id || !newItem.ten_chinh_thuc) {
    res.status(400).json({ error: 'Mã hồ sơ và tên chính thức không được để trống' });
    return;
  }

  const data = readJsonFile<any[]>(DISAN_FILE, []);
  if (data.some((item) => item.id === newItem.id)) {
    res.status(409).json({ error: `Mã hồ sơ ${newItem.id} đã tồn tại trong hệ thống` });
    return;
  }

  newItem.ngay_cap_nhat = new Date().toISOString().split('T')[0];
  data.push(newItem);
  const success = writeJsonFile(DISAN_FILE, data);
  if (!success) {
    res.status(500).json({ error: 'Không thể ghi dữ liệu hồ sơ vào bộ lưu trữ' });
    return;
  }
  res.status(201).json({ success: true, data: newItem });
});

app.put('/api/disan/:id', adminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const data = readJsonFile<any[]>(DISAN_FILE, []);
  const index = data.findIndex((item) => item.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Không tìm thấy hồ sơ để cập nhật' });
    return;
  }

  updateData.id = id; // Ensure ID remains immutable
  updateData.ngay_cap_nhat = new Date().toISOString().split('T')[0];
  data[index] = updateData;

  const success = writeJsonFile(DISAN_FILE, data);
  if (!success) {
    res.status(500).json({ error: 'Lỗi ghi tệp lưu trữ' });
    return;
  }
  res.json({ success: true, data: data[index] });
});

app.delete('/api/disan/:id', adminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  if (INITIAL_DISAN_IDS.includes(id)) {
    res.status(403).json({ error: 'Không thể xóa 10 hồ sơ di sản nền tảng ban đầu của hệ thống.' });
    return;
  }

  const data = readJsonFile<any[]>(DISAN_FILE, []);
  const filtered = data.filter((item) => item.id !== id);
  if (filtered.length === data.length) {
    res.status(404).json({ error: 'Không tìm thấy hồ sơ để xóa' });
    return;
  }

  const success = writeJsonFile(DISAN_FILE, filtered);
  if (!success) {
    res.status(500).json({ error: 'Lỗi ghi tệp lưu trữ' });
    return;
  }
  res.json({ success: true, message: `Đã xóa thành công hồ sơ ${id}` });
});

// Sources endpoints
app.get('/api/nguon-tu-lieu', (_req: Request, res: Response) => {
  const data = readJsonFile(NGUON_FILE, []);
  res.json(data);
});

app.post('/api/nguon-tu-lieu', adminAuth, (req: Request, res: Response) => {
  const newSource = req.body;
  if (!newSource.id || !newSource.ten_tai_lieu) {
    res.status(400).json({ error: 'Mã nguồn và tên tài liệu không được để trống' });
    return;
  }

  const data = readJsonFile<any[]>(NGUON_FILE, []);
  if (data.some((item) => item.id === newSource.id)) {
    res.status(409).json({ error: `Mã nguồn ${newSource.id} đã tồn tại trong hệ thống` });
    return;
  }

  data.push(newSource);
  const success = writeJsonFile(NGUON_FILE, data);
  if (!success) {
    res.status(500).json({ error: 'Không thể ghi nguồn vào bộ lưu trữ' });
    return;
  }
  res.status(201).json({ success: true, data: newSource });
});

app.put('/api/nguon-tu-lieu/:id', adminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const updateSource = req.body;
  const data = readJsonFile<any[]>(NGUON_FILE, []);
  const index = data.findIndex((item) => item.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Không tìm thấy nguồn để cập nhật' });
    return;
  }

  updateSource.id = id;
  data[index] = updateSource;
  const success = writeJsonFile(NGUON_FILE, data);
  if (!success) {
    res.status(500).json({ error: 'Lỗi lưu trữ nguồn' });
    return;
  }
  res.json({ success: true, data: data[index] });
});

app.delete('/api/nguon-tu-lieu/:id', adminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  if (INITIAL_NGUON_IDS.includes(id)) {
    res.status(403).json({ error: 'Không thể xóa các nguồn tư liệu nền tảng đã xác minh ban đầu.' });
    return;
  }

  const data = readJsonFile<any[]>(NGUON_FILE, []);
  const filtered = data.filter((item) => item.id !== id);
  if (filtered.length === data.length) {
    res.status(404).json({ error: 'Không tìm thấy nguồn tư liệu để xóa' });
    return;
  }

  const success = writeJsonFile(NGUON_FILE, filtered);
  if (!success) {
    res.status(500).json({ error: 'Lỗi ghi tệp nguồn' });
    return;
  }
  res.json({ success: true, message: `Đã xóa thành công nguồn ${id}` });
});

// Templates endpoints
app.get('/api/mau-disan', (_req: Request, res: Response) => {
  const data = readJsonFile(MAU_DISAN_FILE, {});
  res.json(data);
});

app.get('/api/mau-nguon', (_req: Request, res: Response) => {
  const data = readJsonFile(MAU_NGUON_FILE, {});
  res.json(data);
});

// Gemini Q&A with strict verification, anti-hallucination, and exact refusal messages
app.post('/api/gemini/qa', async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== 'string' || !question.trim()) {
      res.status(400).json({ error: 'Vui lòng cung cấp câu hỏi.' });
      return;
    }

    const trimmedQuestion = question.trim().toLowerCase();

    // 1. Backend Pre-check: Read verified records
    const disanList = readJsonFile<any[]>(DISAN_FILE, []);
    const verifiedDisan = disanList.filter((item) => item.trang_thai_xac_minh === 'da_xac_minh');
    const nguonList = readJsonFile<any[]>(NGUON_FILE, []);
    const verifiedNguon = nguonList.filter((item) => item.trang_thai_xac_minh === 'da_xac_minh');
    const verifiedNguonMap = new Map(verifiedNguon.map((s) => [s.id, s]));

    // Vietnamese common stopwords to ignore in matching
    const stopwords = new Set([
      'la', 'gi', 'o', 'dau', 'khi', 'nao', 'the', 'ai', 'nhu', 'thong', 'tin', 've',
      'cac', 'nhung', 'co', 'duoc', 'cua', 'va', 'hay', 'cho', 'biet', 'hoi', 'xin'
    ]);

    // Meaningful query tokens
    const queryTokens = trimmedQuestion
      .replace(/[?.,!;:()"\-_/]/g, ' ')
      .split(/\s+/)
      .map((w) => w.trim())
      .filter((w) => w.length >= 3 && !stopwords.has(w));

    // Find relevant verified heritage records
    const scoredDisan = verifiedDisan.map((item) => {
      let score = 0;
      const haystack = [
        item.id,
        item.ten_chinh_thuc,
        ...(item.ten_goi_khac || []),
        item.nhom_chu_de,
        item.loai_hinh,
        ...(item.nhan_vat_tho_phung || []),
        item.dia_phuong?.tinh_thanh,
        item.dia_phuong?.quan_huyen,
        item.dia_phuong?.xa_phuong,
        item.dia_phuong?.dia_chi,
        item.mo_ta_dac_trung,
        ...(item.le_thuc?.map((l: any) => `${l.tieu_de} ${l.noi_dung}`) || []),
        ...(item.truyen_thuyet?.map((t: any) => `${t.tieu_de} ${t.noi_dung}`) || []),
        ...(item.lich_su_hinh_thanh?.map((h: any) => `${h.giai_doan} ${h.noi_dung}`) || []),
        ...(item.thong_tin_ghi_danh?.map((g: any) => `${g.danh_hieu} ${g.van_ban} ${g.co_quan}`) || [])
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      for (const token of queryTokens) {
        if (haystack.includes(token)) {
          // Extra weight for exact match on official name or figures
          if (item.ten_chinh_thuc.toLowerCase().includes(token)) score += 3;
          else if ((item.nhan_vat_tho_phung || []).some((v: string) => v.toLowerCase().includes(token))) score += 3;
          else score += 1;
        }
      }

      return { item, score };
    });

    // Filter relevant records (only items with significant relevance)
    const relevantMatches = scoredDisan
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score);

    // MANDATORY RULE: If no relevant data in database, return verbatim fallback
    if (relevantMatches.length === 0 || queryTokens.length === 0) {
      res.json({
        cau_tra_loi: 'Hiện chưa có tư liệu trong hệ thống để trả lời câu hỏi này. Vui lòng bổ sung nguồn tư liệu phù hợp.',
        ho_so_su_dung: [],
        truong_du_lieu: [],
        nguon_trich_dan: [],
        trang_thai: 'khong_co_du_lieu'
      });
      return;
    }

    // Prepare strictly bounded context for top relevant profiles (max 3)
    const selectedMatches = relevantMatches.slice(0, 3).map((m) => m.item);
    const usedSourceIds = new Set<string>();
    selectedMatches.forEach((m) => {
      (m.nguon_tu_lieu || []).forEach((srcId: string) => usedSourceIds.add(srcId));
      (m.le_thuc || []).forEach((l: any) => l.ma_nguon && usedSourceIds.add(l.ma_nguon));
      (m.truyen_thuyet || []).forEach((t: any) => t.ma_nguon && usedSourceIds.add(t.ma_nguon));
      (m.lich_su_hinh_thanh || []).forEach((h: any) => h.ma_nguon && usedSourceIds.add(h.ma_nguon));
      (m.thong_tin_ghi_danh || []).forEach((g: any) => g.ma_nguon && usedSourceIds.add(g.ma_nguon));
    });

    const relevantSources = Array.from(usedSourceIds)
      .map((id) => verifiedNguonMap.get(id))
      .filter(Boolean);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const primary = selectedMatches[0];
      const answer = `Theo hồ sơ "${primary.ten_chinh_thuc}" (Mã: ${primary.id}): ${primary.mo_ta_dac_trung}`;
      const sources = (primary.nguon_tu_lieu || [])
        .map((sId: string) => verifiedNguonMap.get(sId))
        .filter(Boolean);

      res.json({
        cau_tra_loi: answer,
        ho_so_su_dung: [{ id: primary.id, ten_chinh_thuc: primary.ten_chinh_thuc }],
        truong_du_lieu: ['mo_ta_dac_trung'],
        nguon_trich_dan: sources,
        trang_thai: 'thanh_cong'
      });
      return;
    }

    // Call Gemini with strict system instruction
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const promptText = `
BẠN LÀ CHUYÊN VIÊN KIỂM CHỨNG DI SẢN VĂN HÓA VỀ TÍN NGƯỠNG THỜ HÙNG VƯƠNG VÀ ANH HÙNG DÂN TỘC VIỆT NAM.

BỘ QUY TẮC BẮT BUỘC:
1. CHỈ sử dụng dữ liệu từ danh sách hồ sơ di sản và nguồn tư liệu đã được xác minh được cung cấp dưới đây trong CONTEXT.
2. KHÔNG sử dụng bất kỳ kiến thức ngoài ngữ cảnh nào để làm bằng chứng cho câu trả lời.
3. KHÔNG tự suy đoán, bịa đặt hoặc bổ sung các chi tiết còn thiếu.
4. KHÔNG tự tạo nguồn, URL, trích dẫn, số trang hoặc tên tài liệu.
5. Mỗi câu trả lời PHẢI chỉ rõ:
   - Các mã hồ sơ di sản đã sử dụng (chỉ lấy mã trong context, ví dụ: ["DS001"]).
   - Các trường dữ liệu đã dùng làm căn cứ (ví dụ: ["mo_ta_dac_trung", "le_thuc", "thong_tin_ghi_danh"]).
   - Danh sách mã nguồn tương ứng đã sử dụng (ví dụ: ["SRC001"]).
6. Tuyệt đối KHÔNG coi truyền thuyết là sự kiện lịch sử đã được chứng minh. Phải phân định rõ ràng ("Truyền thuyết dân gian ghi nhận rằng...").
7. NẾU dữ liệu trong context KHÔNG đủ căn cứ để trả lời đầy đủ câu hỏi, hãy trả lời NGUYÊN VĂN:
   "Dữ liệu hiện có chưa đủ căn cứ để trả lời đầy đủ câu hỏi này."
   Khi đó, trường ho_so_su_dung và nguon_trich_dan để mảng rỗng.

DỮ LIỆU CONTEXT (ĐÃ XÁC MINH):
=== HỒ SƠ DI SẢN LIÊN QUAN ===
${JSON.stringify(selectedMatches, null, 2)}

=== NGUỒN TƯ LIỆU THAM CHIẾU ===
${JSON.stringify(relevantSources, null, 2)}

CÂU HỎI CỦA NGƯỜI DÙNG:
"${question}"
`;

    let rawJson = '';
    // Resilient model cascade: try 'gemini-3.8-flash', fallback to 'gemini-3.1-flash-lite'
    const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: promptText,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                cau_tra_loi: {
                  type: Type.STRING,
                  description: 'Câu trả lời tiếng Việt chính xác dựa duy nhất trên context đã cung cấp.'
                },
                ho_so_su_dung: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Danh sách ID hồ sơ di sản đã sử dụng, ví dụ ["DS001"]'
                },
                truong_du_lieu: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Danh sách tên trường dữ liệu làm căn cứ'
                },
                ma_nguon_trich_dan: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Danh sách ID nguồn tư liệu thực tế hỗ trợ'
                }
              },
              required: ['cau_tra_loi', 'ho_so_su_dung', 'truong_du_lieu', 'ma_nguon_trich_dan']
            }
          }
        });

        if (response.text) {
          rawJson = response.text.trim();
          break;
        }
      } catch (geminiErr: any) {
        console.warn(`Model ${modelName} call failed or overloaded:`, geminiErr.message);
        // Continue to next model in cascade
      }
    }

    if (!rawJson) {
      // Fallback: rule-based answer from the top matched record
      const primary = selectedMatches[0];
      const answer = `Theo hồ sơ di sản "${primary.ten_chinh_thuc}" (Mã: ${primary.id}): ${primary.mo_ta_dac_trung}`;
      const sources = (primary.nguon_tu_lieu || [])
        .map((sId: string) => verifiedNguonMap.get(sId))
        .filter(Boolean);

      res.json({
        cau_tra_loi: answer,
        ho_so_su_dung: [{ id: primary.id, ten_chinh_thuc: primary.ten_chinh_thuc }],
        truong_du_lieu: ['mo_ta_dac_trung'],
        nguon_trich_dan: sources,
        trang_thai: 'thanh_cong'
      });
      return;
    }

    let parsedResult: any = {};
    try {
      parsedResult = JSON.parse(rawJson);
    } catch (e) {
      console.error('Failed to parse Gemini JSON output:', rawJson);
      res.json({
        cau_tra_loi: 'Dữ liệu hiện có chưa đủ căn cứ để trả lời đầy đủ câu hỏi này.',
        ho_so_su_dung: [],
        truong_du_lieu: [],
        nguon_trich_dan: [],
        trang_thai: 'chua_du_can_cu'
      });
      return;
    }

    // 2. Backend Post-check: Validate profile IDs, fields, and sources
    const returnedProfiles = Array.isArray(parsedResult.ho_so_su_dung) ? parsedResult.ho_so_su_dung : [];
    const returnedSources = Array.isArray(parsedResult.ma_nguon_trich_dan) ? parsedResult.ma_nguon_trich_dan : [];
    const returnedFields = Array.isArray(parsedResult.truong_du_lieu) ? parsedResult.truong_du_lieu : [];

    // Verify profile IDs against the database
    const validProfileIds = returnedProfiles.filter((id: string) =>
      verifiedDisan.some((p) => p.id === id)
    );

    // Verify source IDs against verified sources
    const validSources = returnedSources
      .map((id: string) => verifiedNguonMap.get(id))
      .filter((s: any) => Boolean(s) && s.trang_thai_xac_minh === 'da_xac_minh');

    // If answer states insufficient evidence
    if (
      parsedResult.cau_tra_loi.includes('chưa đủ căn cứ') ||
      (validProfileIds.length === 0 && validSources.length === 0)
    ) {
      res.json({
        cau_tra_loi: 'Dữ liệu hiện có chưa đủ căn cứ để trả lời đầy đủ câu hỏi này.',
        ho_so_su_dung: [],
        truong_du_lieu: [],
        nguon_trich_dan: [],
        trang_thai: 'chua_du_can_cu'
      });
      return;
    }

    // Attach full profile names for rich presentation
    const usedProfilesInfo = validProfileIds.map((pId: string) => {
      const p = verifiedDisan.find((item) => item.id === pId);
      return { id: p?.id, ten_chinh_thuc: p?.ten_chinh_thuc };
    });

    res.json({
      cau_tra_loi: parsedResult.cau_tra_loi,
      ho_so_su_dung: usedProfilesInfo,
      truong_du_lieu: returnedFields,
      nguon_trich_dan: validSources,
      trang_thai: 'thanh_cong'
    });
  } catch (error: any) {
    console.error('Server Gemini Q&A Error:', error);
    res.status(500).json({
      cau_tra_loi: 'Đã xảy ra sự cố trong quá trình xử lý câu hỏi. Vui lòng thử lại sau.',
      ho_so_su_dung: [],
      truong_du_lieu: [],
      nguon_trich_dan: [],
      trang_thai: 'loi_he_thong'
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
