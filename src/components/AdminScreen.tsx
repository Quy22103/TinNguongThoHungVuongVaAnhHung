import React, { useState } from 'react';
import { HoSoDiSan, NguonTuLieu } from '../types';
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Search,
  AlertCircle,
  CheckCircle2,
  Lock,
  Download,
  X,
  Save,
  FileText,
  BookOpen
} from 'lucide-react';

interface AdminScreenProps {
  heritageList: HoSoDiSan[];
  sourcesList: NguonTuLieu[];
  adminToken: string | null;
  onRefreshData: () => void;
  onLogout: () => void;
}

const PROTECTED_DISAN_IDS = ['DS001', 'DS002', 'DS003', 'DS004', 'DS005', 'DS006', 'DS007', 'DS008', 'DS009', 'DS010'];
const PROTECTED_SOURCE_IDS = ['SRC001', 'SRC002', 'SRC003', 'SRC004', 'SRC005', 'SRC006', 'SRC007', 'SRC008', 'SRC009', 'SRC010', 'SRC011', 'SRC012'];

export const AdminScreen: React.FC<AdminScreenProps> = ({
  heritageList,
  sourcesList,
  adminToken,
  onRefreshData,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'disan' | 'nguon'>('disan');
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modals
  const [editingHeritage, setEditingHeritage] = useState<HoSoDiSan | null>(null);
  const [isNewHeritage, setIsNewHeritage] = useState(false);
  const [editingSource, setEditingSource] = useState<NguonTuLieu | null>(null);
  const [isNewSource, setIsNewSource] = useState(false);

  // Validation Warnings
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

  // Deletion confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'disan' | 'nguon'; id: string; name: string } | null>(null);

  // 1. Heritage Form Handlers
  const handleOpenAddHeritage = () => {
    setIsNewHeritage(true);
    setValidationWarnings([]);
    // Follow mau_disan.json schema
    setEditingHeritage({
      id: `DS${String(heritageList.length + 1).padStart(3, '0')}`,
      ten_chinh_thuc: '',
      ten_goi_khac: [],
      nhom_chu_de: 'Anh hùng dân tộc',
      loai_hinh: 'Di tích lịch sử văn hóa',
      nhan_vat_tho_phung: [],
      dia_phuong: {
        tinh_thanh: '',
        quan_huyen: '',
        xa_phuong: '',
        dia_chi: ''
      },
      toa_do: {
        vi_do: null,
        kinh_do: null
      },
      mo_ta_dac_trung: '',
      le_thuc: [],
      truyen_thuyet: [],
      lich_su_hinh_thanh: [],
      thong_tin_ghi_danh: [],
      hinh_anh_tu_lieu: [],
      nguon_tu_lieu: [],
      trang_thai_xac_minh: 'chua_xac_minh',
      ngay_cap_nhat: new Date().toISOString().split('T')[0]
    });
  };

  const handleValidateHeritage = (item: HoSoDiSan): string[] => {
    const warnings: string[] = [];
    if (!item.id?.trim()) warnings.push('Mã hồ sơ (ID) không được để trống.');
    if (!item.ten_chinh_thuc?.trim()) warnings.push('Tên chính thức của di tích không được để trống.');
    if (!item.dia_phuong?.tinh_thanh?.trim()) warnings.push('Tỉnh / Thành phố chưa được điền.');
    if (!item.mo_ta_dac_trung?.trim()) warnings.push('Mô tả đặc trưng chưa có nội dung (sẽ hiển thị thông báo chưa xác minh).');

    // Check duplicate ID when adding new
    if (isNewHeritage && heritageList.some((h) => h.id === item.id)) {
      warnings.push(`Cảnh báo: Mã hồ sơ "${item.id}" đã tồn tại! Vui lòng chọn mã khác.`);
    }

    // Check sources
    if (item.nguon_tu_lieu && item.nguon_tu_lieu.length === 0) {
      warnings.push('Chưa liên kết nguồn tư liệu hỗ trợ cho hồ sơ này.');
    }

    return warnings;
  };

  const handleSaveHeritage = async () => {
    if (!editingHeritage) return;
    const warnings = handleValidateHeritage(editingHeritage);
    setValidationWarnings(warnings);

    // If there is fatal error like duplicate ID or missing ID/Name, block
    if (warnings.some((w) => w.includes('không được để trống') || w.includes('đã tồn tại'))) {
      return;
    }

    try {
      const url = isNewHeritage ? '/api/disan' : `/api/disan/${editingHeritage.id}`;
      const method = isNewHeritage ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken || ''
        },
        body: JSON.stringify(editingHeritage)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Lỗi khi lưu hồ sơ');
      }

      setMessage({ text: `Đã lưu thành công hồ sơ ${editingHeritage.id}!`, type: 'success' });
      setEditingHeritage(null);
      onRefreshData();
    } catch (err: any) {
      setMessage({ text: err.message || 'Lỗi khi lưu hồ sơ', type: 'error' });
    }
  };

  // 2. Source Form Handlers
  const handleOpenAddSource = () => {
    setIsNewSource(true);
    setValidationWarnings([]);
    // Follow mau_nguon_tu_lieu.json schema
    setEditingSource({
      id: `SRC${String(sourcesList.length + 1).padStart(3, '0')}`,
      ten_tai_lieu: '',
      tac_gia_hoac_co_quan: '',
      nam_xuat_ban: null,
      loai_nguon: 'Hồ sơ di tích',
      url: '',
      ngay_kiem_tra_url: new Date().toISOString().split('T')[0],
      noi_dung_ho_tro: '',
      trang_hoac_vi_tri: '',
      trang_thai_xac_minh: 'chua_xac_minh'
    });
  };

  const handleValidateSource = (src: NguonTuLieu): string[] => {
    const warnings: string[] = [];
    if (!src.id?.trim()) warnings.push('Mã nguồn không được để trống.');
    if (!src.ten_tai_lieu?.trim()) warnings.push('Tên tài liệu không được để trống.');
    if (src.url && !src.url.startsWith('http')) {
      warnings.push('URL không đúng định dạng web (cần bắt đầu bằng http:// hoặc https://).');
    }
    if (isNewSource && sourcesList.some((s) => s.id === src.id)) {
      warnings.push(`Mã nguồn "${src.id}" đã tồn tại!`);
    }
    if (src.trang_thai_xac_minh === 'chua_xac_minh') {
      warnings.push('Lưu ý: Nguồn này đang ở trạng thái "Chưa xác minh" và sẽ không được Gemini sử dụng làm bằng chứng.');
    }
    return warnings;
  };

  const handleSaveSource = async () => {
    if (!editingSource) return;
    const warnings = handleValidateSource(editingSource);
    setValidationWarnings(warnings);

    if (warnings.some((w) => w.includes('không được để trống') || w.includes('đã tồn tại'))) {
      return;
    }

    try {
      const url = isNewSource ? '/api/nguon-tu-lieu' : `/api/nguon-tu-lieu/${editingSource.id}`;
      const method = isNewSource ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken || ''
        },
        body: JSON.stringify(editingSource)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Lỗi khi lưu nguồn tư liệu');
      }

      setMessage({ text: `Đã lưu nguồn tư liệu ${editingSource.id}!`, type: 'success' });
      setEditingSource(null);
      onRefreshData();
    } catch (err: any) {
      setMessage({ text: err.message || 'Lỗi lưu nguồn', type: 'error' });
    }
  };

  // 3. Delete Handlers
  const handleExecuteDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const url =
        deleteConfirm.type === 'disan'
          ? `/api/disan/${deleteConfirm.id}`
          : `/api/nguon-tu-lieu/${deleteConfirm.id}`;

      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          'x-admin-key': adminToken || ''
        }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Lỗi khi xóa');
      }

      setMessage({ text: `Đã xóa thành công ${deleteConfirm.id}!`, type: 'success' });
      setDeleteConfirm(null);
      onRefreshData();
    } catch (err: any) {
      setMessage({ text: err.message || 'Lỗi khi xóa', type: 'error' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header with Admin status & Logout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-serif-culture text-[#2C241E]">
              Khu vực Quản trị & Bổ sung Dữ liệu
            </h1>
            <p className="text-xs text-stone-500">
              Quyền quản trị viên đã kích hoạt • Dữ liệu lưu trữ bền vững trên máy chủ
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onLogout}
            className="px-3.5 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors"
          >
            Đăng xuất quản trị
          </button>
        </div>
      </div>

      {/* Global Notifications */}
      {message && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-stone-400 hover:text-stone-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Section Tabs & New Item Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setActiveTab('disan');
              setSearchTerm('');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-2 ${
              activeTab === 'disan'
                ? 'bg-[#8B1E19] text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Hồ sơ di sản ({heritageList.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('nguon');
              setSearchTerm('');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-2 ${
              activeTab === 'nguon'
                ? 'bg-[#8B1E19] text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Nguồn tư liệu ({sourcesList.length})</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {activeTab === 'disan' ? (
            <button
              onClick={handleOpenAddHeritage}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm hồ sơ di sản mới</span>
            </button>
          ) : (
            <button
              onClick={handleOpenAddSource}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm nguồn tư liệu mới</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Input for Admin Table */}
      <div className="relative w-full max-w-md">
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={
            activeTab === 'disan'
              ? 'Tìm kiếm hồ sơ theo ID, tên, địa phương...'
              : 'Tìm kiếm nguồn theo mã, tên tài liệu, cơ quan...'
          }
          className="w-full pl-9 pr-4 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#8B1E19]"
        />
      </div>

      {/* Admin Table: Heritage Profiles */}
      {activeTab === 'disan' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-[#FAF7F2] border-b border-stone-200 text-stone-800 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Mã</th>
                  <th className="py-3 px-4">Tên chính thức</th>
                  <th className="py-3 px-4">Chủ đề & Loại hình</th>
                  <th className="py-3 px-4">Địa phương</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {heritageList
                  .filter(
                    (h) =>
                      h.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      h.ten_chinh_thuc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      h.dia_phuong?.tinh_thanh?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((item) => {
                    const isProtected = PROTECTED_DISAN_IDS.includes(item.id);
                    return (
                      <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#8B1E19]">{item.id}</td>
                        <td className="py-3 px-4 font-medium text-stone-900">{item.ten_chinh_thuc}</td>
                        <td className="py-3 px-4">
                          <span className="text-stone-600">{item.nhom_chu_de}</span>
                          <span className="block text-[11px] text-stone-400">{item.loai_hinh}</span>
                        </td>
                        <td className="py-3 px-4">{item.dia_phuong?.tinh_thanh || '—'}</td>
                        <td className="py-3 px-4">
                          {item.trang_thai_xac_minh === 'da_xac_minh' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                              Đã xác minh
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                              Chưa xác minh
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setIsNewHeritage(false);
                              setValidationWarnings([]);
                              setEditingHeritage(JSON.parse(JSON.stringify(item)));
                            }}
                            className="p-1.5 text-stone-600 hover:text-amber-800 hover:bg-stone-100 rounded cursor-pointer"
                            title="Sửa hồ sơ"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {isProtected ? (
                            <span
                              className="inline-block p-1.5 text-stone-300"
                              title="10 hồ sơ di sản nền tảng ban đầu được bảo vệ không thể xóa"
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </span>
                          ) : (
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  type: 'disan',
                                  id: item.id,
                                  name: item.ten_chinh_thuc
                                })
                              }
                              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded cursor-pointer"
                              title="Xóa hồ sơ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin Table: Bibliographic Sources */}
      {activeTab === 'nguon' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-[#FAF7F2] border-b border-stone-200 text-stone-800 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Mã</th>
                  <th className="py-3 px-4">Tên tài liệu</th>
                  <th className="py-3 px-4">Cơ quan / Tác giả</th>
                  <th className="py-3 px-4">Năm</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {sourcesList
                  .filter(
                    (s) =>
                      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      s.ten_tai_lieu.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      s.tac_gia_hoac_co_quan.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((src) => {
                    const isProtected = PROTECTED_SOURCE_IDS.includes(src.id);
                    return (
                      <tr key={src.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#8B1E19]">{src.id}</td>
                        <td className="py-3 px-4 font-medium text-stone-900">{src.ten_tai_lieu}</td>
                        <td className="py-3 px-4 text-stone-600">{src.tac_gia_hoac_co_quan}</td>
                        <td className="py-3 px-4">{src.nam_xuat_ban || '—'}</td>
                        <td className="py-3 px-4">
                          {src.trang_thai_xac_minh === 'da_xac_minh' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                              Đã xác minh
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                              Chưa xác minh
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setIsNewSource(false);
                              setValidationWarnings([]);
                              setEditingSource(JSON.parse(JSON.stringify(src)));
                            }}
                            className="p-1.5 text-stone-600 hover:text-amber-800 hover:bg-stone-100 rounded cursor-pointer"
                            title="Sửa nguồn"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {isProtected ? (
                            <span
                              className="inline-block p-1.5 text-stone-300"
                              title="Nguồn tư liệu ban đầu được bảo vệ không thể xóa"
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </span>
                          ) : (
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  type: 'nguon',
                                  id: src.id,
                                  name: src.ten_tai_lieu
                                })
                              }
                              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded cursor-pointer"
                              title="Xóa nguồn"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT/ADD HERITAGE MODAL */}
      {editingHeritage && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h2 className="text-lg font-bold font-serif-culture text-stone-900">
                {isNewHeritage ? 'Thêm hồ sơ di sản mới (Khuôn mẫu mau_disan.json)' : `Chỉnh sửa hồ sơ: ${editingHeritage.id}`}
              </h2>
              <button onClick={() => setEditingHeritage(null)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Validation Warnings Box */}
            {validationWarnings.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <div className="text-xs font-bold text-amber-800 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Cảnh báo kiểm tra dữ liệu trước khi lưu:</span>
                </div>
                <ul className="text-xs text-amber-700 list-disc list-inside">
                  {validationWarnings.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-4 text-xs">
              {/* ID & Official Name */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-stone-700">Mã hồ sơ (ID)*</label>
                  <input
                    type="text"
                    value={editingHeritage.id}
                    disabled={!isNewHeritage}
                    onChange={(e) => setEditingHeritage({ ...editingHeritage, id: e.target.value })}
                    className="w-full mt-1 p-2 border border-stone-300 rounded font-mono disabled:bg-stone-100"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-semibold text-stone-700">Tên chính thức*</label>
                  <input
                    type="text"
                    value={editingHeritage.ten_chinh_thuc}
                    onChange={(e) => setEditingHeritage({ ...editingHeritage, ten_chinh_thuc: e.target.value })}
                    className="w-full mt-1 p-2 border border-stone-300 rounded"
                    placeholder="Ví dụ: Đền thờ..."
                  />
                </div>
              </div>

              {/* Theme & Classification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700">Nhóm chủ đề</label>
                  <select
                    value={editingHeritage.nhom_chu_de}
                    onChange={(e) => setEditingHeritage({ ...editingHeritage, nhom_chu_de: e.target.value })}
                    className="w-full mt-1 p-2 border border-stone-300 rounded bg-white"
                  >
                    <option value="Hùng Vương và thời đại Hùng Vương">Hùng Vương và thời đại Hùng Vương</option>
                    <option value="Tín ngưỡng thờ cúng Hùng Vương">Tín ngưỡng thờ cúng Hùng Vương</option>
                    <option value="Anh hùng dân tộc">Anh hùng dân tộc</option>
                    <option value="Di tích và địa điểm thờ tự">Di tích và địa điểm thờ tự</option>
                    <option value="Nghi lễ và lễ hội">Nghi lễ và lễ hội</option>
                    <option value="Truyền thuyết dân gian">Truyền thuyết dân gian</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-stone-700">Loại hình</label>
                  <input
                    type="text"
                    value={editingHeritage.loai_hinh}
                    onChange={(e) => setEditingHeritage({ ...editingHeritage, loai_hinh: e.target.value })}
                    className="w-full mt-1 p-2 border border-stone-300 rounded"
                    placeholder="Ví dụ: Di tích quốc gia đặc biệt / Di sản phi vật thể"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-stone-700">Tỉnh / Thành phố</label>
                  <input
                    type="text"
                    value={editingHeritage.dia_phuong.tinh_thanh}
                    onChange={(e) =>
                      setEditingHeritage({
                        ...editingHeritage,
                        dia_phuong: { ...editingHeritage.dia_phuong, tinh_thanh: e.target.value }
                      })
                    }
                    className="w-full mt-1 p-2 border border-stone-300 rounded"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700">Quận / Huyện</label>
                  <input
                    type="text"
                    value={editingHeritage.dia_phuong.quan_huyen}
                    onChange={(e) =>
                      setEditingHeritage({
                        ...editingHeritage,
                        dia_phuong: { ...editingHeritage.dia_phuong, quan_huyen: e.target.value }
                      })
                    }
                    className="w-full mt-1 p-2 border border-stone-300 rounded"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700">Xã / Phường</label>
                  <input
                    type="text"
                    value={editingHeritage.dia_phuong.xa_phuong}
                    onChange={(e) =>
                      setEditingHeritage({
                        ...editingHeritage,
                        dia_phuong: { ...editingHeritage.dia_phuong, xa_phuong: e.target.value }
                      })
                    }
                    className="w-full mt-1 p-2 border border-stone-300 rounded"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-semibold text-stone-700">Mô tả đặc trưng</label>
                <textarea
                  rows={3}
                  value={editingHeritage.mo_ta_dac_trung}
                  onChange={(e) => setEditingHeritage({ ...editingHeritage, mo_ta_dac_trung: e.target.value })}
                  className="w-full mt-1 p-2 border border-stone-300 rounded leading-relaxed"
                />
              </div>

              {/* Linked Sources */}
              <div>
                <label className="font-semibold text-stone-700">Mã nguồn tư liệu liên kết (phân cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  value={editingHeritage.nguon_tu_lieu?.join(', ') || ''}
                  onChange={(e) =>
                    setEditingHeritage({
                      ...editingHeritage,
                      nguon_tu_lieu: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean)
                    })
                  }
                  className="w-full mt-1 p-2 border border-stone-300 rounded font-mono"
                  placeholder="Ví dụ: SRC001, SRC002"
                />
              </div>

              {/* Verification Status */}
              <div>
                <label className="font-semibold text-stone-700">Trạng thái xác minh</label>
                <select
                  value={editingHeritage.trang_thai_xac_minh}
                  onChange={(e) =>
                    setEditingHeritage({
                      ...editingHeritage,
                      trang_thai_xac_minh: e.target.value as any
                    })
                  }
                  className="w-full mt-1 p-2 border border-stone-300 rounded bg-white"
                >
                  <option value="chua_xac_minh">Chưa xác minh</option>
                  <option value="da_xac_minh">Đã xác minh</option>
                </select>
                <p className="text-[11px] text-stone-400 mt-1">
                  * Theo quy tắc hệ thống: Chỉ chuyển sang 'Đã xác minh' khi đã kiểm chứng đầy đủ nguồn tài liệu chính thống.
                </p>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t border-stone-200">
              <button
                onClick={() => setEditingHeritage(null)}
                className="px-4 py-2 border border-stone-300 rounded text-xs font-medium text-stone-700 hover:bg-stone-50 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSaveHeritage}
                className="px-5 py-2 bg-[#8B1E19] hover:bg-[#6B1410] text-white rounded text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu hồ sơ vào máy chủ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT/ADD SOURCE MODAL */}
      {editingSource && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h2 className="text-lg font-bold font-serif-culture text-stone-900">
                {isNewSource ? 'Thêm nguồn tư liệu mới (Khuôn mẫu mau_nguon_tu_lieu.json)' : `Chỉnh sửa nguồn: ${editingSource.id}`}
              </h2>
              <button onClick={() => setEditingSource(null)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {validationWarnings.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <div className="text-xs font-bold text-amber-800 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Cảnh báo dữ liệu:</span>
                </div>
                <ul className="text-xs text-amber-700 list-disc list-inside">
                  {validationWarnings.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-stone-700">Mã nguồn (ID)*</label>
                  <input
                    type="text"
                    value={editingSource.id}
                    disabled={!isNewSource}
                    onChange={(e) => setEditingSource({ ...editingSource, id: e.target.value })}
                    className="w-full mt-1 p-2 border border-stone-300 rounded font-mono disabled:bg-stone-100"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-semibold text-stone-700">Tên tài liệu / Văn bản*</label>
                  <input
                    type="text"
                    value={editingSource.ten_tai_lieu}
                    onChange={(e) => setEditingSource({ ...editingSource, ten_tai_lieu: e.target.value })}
                    className="w-full mt-1 p-2 border border-stone-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700">Cơ quan / Tác giả</label>
                  <input
                    type="text"
                    value={editingSource.tac_gia_hoac_co_quan}
                    onChange={(e) => setEditingSource({ ...editingSource, tac_gia_hoac_co_quan: e.target.value })}
                    className="w-full mt-1 p-2 border border-stone-300 rounded"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700">Năm xuất bản / công bố</label>
                  <input
                    type="number"
                    value={editingSource.nam_xuat_ban || ''}
                    onChange={(e) =>
                      setEditingSource({
                        ...editingSource,
                        nam_xuat_ban: e.target.value ? parseInt(e.target.value, 10) : null
                      })
                    }
                    className="w-full mt-1 p-2 border border-stone-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700">URL chính thức</label>
                <input
                  type="url"
                  value={editingSource.url}
                  onChange={(e) => setEditingSource({ ...editingSource, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full mt-1 p-2 border border-stone-300 rounded"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700">Nội dung hỗ trợ chứng thực</label>
                <textarea
                  rows={2}
                  value={editingSource.noi_dung_ho_tro}
                  onChange={(e) => setEditingSource({ ...editingSource, noi_dung_ho_tro: e.target.value })}
                  className="w-full mt-1 p-2 border border-stone-300 rounded"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700">Trạng thái xác minh</label>
                <select
                  value={editingSource.trang_thai_xac_minh}
                  onChange={(e) =>
                    setEditingSource({
                      ...editingSource,
                      trang_thai_xac_minh: e.target.value as any
                    })
                  }
                  className="w-full mt-1 p-2 border border-stone-300 rounded bg-white"
                >
                  <option value="chua_xac_minh">Chưa xác minh</option>
                  <option value="da_xac_minh">Đã xác minh</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-stone-200">
              <button
                onClick={() => setEditingSource(null)}
                className="px-4 py-2 border border-stone-300 rounded text-xs font-medium text-stone-700 hover:bg-stone-50 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSaveSource}
                className="px-5 py-2 bg-[#8B1E19] hover:bg-[#6B1410] text-white rounded text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu nguồn tư liệu</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-base font-bold text-stone-900">Xác nhận xóa dữ liệu</h3>
              <p className="text-xs text-stone-600">
                Bạn có chắc chắn muốn xóa vĩnh viễn mục <strong>{deleteConfirm.id}</strong> (
                {deleteConfirm.name}) khỏi hệ thống? Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="flex justify-center space-x-2 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-50 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleExecuteDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
