import React, { useState, useEffect, useRef } from 'react';
import { GeminiQAResponse, HoSoDiSan, NguonTuLieu } from '../types';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  BookOpen,
  Layers,
  FileCheck2,
  AlertCircle,
  ExternalLink,
  HelpCircle,
  Loader2
} from 'lucide-react';

interface QAScreenProps {
  onSelectHeritageById: (id: string) => void;
  onSelectSourceById: (id: string) => void;
}

export const QAScreen: React.FC<QAScreenProps> = ({
  onSelectHeritageById,
  onSelectSourceById
}) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<GeminiQAResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Speech Recognition (Voice Input)
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check SpeechRecognition browser support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'vi-VN';

        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setQuestion(transcript);
          }
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            setError('Trình duyệt chưa được cấp quyền micro. Bạn vẫn có thể nhập câu hỏi bằng văn bản.');
          } else {
            setError('Không thể nhận dạng giọng nói. Vui lòng nhập bằng văn bản.');
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (e) {
        setSpeechSupported(false);
      }
    } else {
      setSpeechSupported(false);
    }
  }, []);

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) {
      setError('Trình duyệt của bạn không hỗ trợ tính năng nhận dạng giọng nói tiếng Việt. Hãy nhập văn bản bên dưới.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setError(null);
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Failed to start recognition:', err);
        setIsListening(false);
      }
    }
  };

  const handleSubmit = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const queryToSend = customQuery || question;
    if (!queryToSend.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/gemini/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: queryToSend.trim() })
      });

      if (!res.ok) {
        throw new Error(`Máy chủ phản hồi mã lỗi: ${res.status}`);
      }

      const data: GeminiQAResponse = await res.json();
      setResponse(data);
    } catch (err: any) {
      console.error('Gemini QA error:', err);
      setError('Đã xảy ra lỗi khi kết nối tới máy chủ hỏi đáp. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    'Tín ngưỡng thờ cúng Hùng Vương được UNESCO ghi danh vào năm nào?',
    'Khu di tích lịch sử Đền Hùng gồm những ngôi đền nào và tọa lạc ở đâu?',
    'Đền Mẫu Âu Cơ ở Phú Thọ thờ ai và lễ hội diễn ra vào thời gian nào?',
    'Đền Hai Bà Trưng tại Mê Linh được xếp hạng Di tích quốc gia đặc biệt khi nào?',
    'Hưng Đạo Đại Vương Trần Quốc Tuấn được thờ phụng tại di tích Kiếp Bạc như thế nào?',
    'Lam Kinh gắn liền với anh hùng dân tộc nào và cuộc khởi nghĩa nào?'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Title & Guidelines Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider font-royal">
          <Sparkles className="w-3.5 h-3.5 text-[#8B1E19]" />
          <span>Hệ thống Hỏi đáp Tri thức Di sản được kiểm chứng</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif-culture text-[#2C241E]">
          Hỏi đáp bằng Văn bản & Giọng nói
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
          Gemini chỉ trả lời dựa trên các hồ sơ và nguồn tư liệu chính thức đã được xác minh. Mọi câu trả lời đều ghi rõ căn cứ hồ sơ, trường dữ liệu và nguồn trích dẫn tương ứng.
        </p>
      </div>

      {/* Input Box with Voice & Send Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-4 sm:p-6 space-y-4">
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-3">
          <div className="relative">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Nhập câu hỏi của bạn về Tín ngưỡng thờ Hùng Vương hoặc các Anh hùng dân tộc..."
              rows={3}
              className="w-full rounded-xl border border-stone-300 p-3.5 pr-12 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#8B1E19] focus:border-transparent transition-all placeholder:text-stone-400"
              disabled={loading}
            />

            {/* Microphone Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`absolute right-3 top-3 p-2 rounded-full transition-colors cursor-pointer ${
                isListening
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
              }`}
              title={
                !speechSupported
                  ? 'Trình duyệt không hỗ trợ micro'
                  : isListening
                  ? 'Đang lắng nghe... bấm để dừng'
                  : 'Bấm để đọc câu hỏi bằng giọng nói'
              }
            >
              {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs text-stone-500 flex items-center space-x-1.5">
              {isListening ? (
                <span className="text-red-600 font-medium flex items-center space-x-1 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  <span>Đang nghe... hãy đọc câu hỏi của bạn bằng tiếng Việt</span>
                </span>
              ) : (
                <span>Hỗ trợ nhập liệu văn bản và micro tiếng Việt</span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="px-5 py-2 rounded-xl bg-[#8B1E19] hover:bg-[#6B1410] disabled:bg-stone-300 text-white text-sm font-semibold flex items-center space-x-2 transition-colors cursor-pointer shadow-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang đối chiếu dữ liệu...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Gửi câu hỏi</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error Notification */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Sample Questions */}
        <div className="pt-3 border-t border-stone-100 space-y-2">
          <div className="text-xs font-semibold text-stone-600 flex items-center space-x-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Câu hỏi gợi ý có sẵn trong cơ sở dữ liệu:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuestion(q);
                  handleSubmit(undefined, q);
                }}
                className="text-xs text-stone-700 bg-stone-100 hover:bg-amber-50 hover:text-[#8B1E19] hover:border-amber-300 border border-stone-200/80 px-2.5 py-1 rounded-lg text-left transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Answer & Verification Results */}
      {response && (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sm:p-8 space-y-6 animate-fade-in">
          {/* Answer Text */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-800 font-royal">
              <Sparkles className="w-4 h-4 text-[#8B1E19]" />
              <span>Câu trả lời từ hệ thống:</span>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-amber-200/60 text-sm leading-relaxed text-[#2C241E] whitespace-pre-line font-medium">
              {response.cau_tra_loi}
            </div>
          </div>

          {/* Verification Audit Trail: Profiles, Fields, and Sources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
            {/* Heritage Profiles Used */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-stone-800 uppercase tracking-wide">
                <FileCheck2 className="w-4 h-4 text-[#8B1E19]" />
                <span>Hồ sơ di sản làm căn cứ:</span>
              </div>
              {response.ho_so_su_dung && response.ho_so_su_dung.length > 0 ? (
                <div className="space-y-1.5">
                  {response.ho_so_su_dung.map((p, idx) => (
                    <div
                      key={idx}
                      className="text-xs flex items-center justify-between text-stone-700 bg-white p-2 rounded border border-stone-200"
                    >
                      <span className="font-semibold text-[#8B1E19]">{p.id}</span>
                      <span className="truncate mx-2">{p.ten_chinh_thuc || 'Hồ sơ di sản'}</span>
                      <button
                        onClick={() => onSelectHeritageById(p.id)}
                        className="text-[11px] text-[#8B1E19] font-medium hover:underline shrink-0 cursor-pointer"
                      >
                        Mở hồ sơ
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-400 italic">Không có hồ sơ liên kết</p>
              )}
            </div>

            {/* Data Fields Used */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-stone-800 uppercase tracking-wide">
                <Layers className="w-4 h-4 text-[#8B1E19]" />
                <span>Trường dữ liệu được đối chiếu:</span>
              </div>
              {response.truong_du_lieu && response.truong_du_lieu.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {response.truong_du_lieu.map((field, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono bg-white text-stone-700 px-2 py-0.5 rounded border border-stone-200"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-400 italic">Không có trường dữ liệu cụ thể</p>
              )}
            </div>
          </div>

          {/* Citations & Verified Sources */}
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-900 uppercase tracking-wide">
              <BookOpen className="w-4 h-4 text-[#8B1E19]" />
              <span>Nguồn tư liệu trích dẫn & Xác thực:</span>
            </div>

            {response.nguon_trich_dan && response.nguon_trich_dan.length > 0 ? (
              <div className="space-y-2">
                {response.nguon_trich_dan.map((src, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-lg border border-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-[#8B1E19] font-mono">[{src.id}]</span>
                        <strong className="text-stone-900">{src.ten_tai_lieu}</strong>
                      </div>
                      <p className="text-stone-500 mt-0.5">
                        {src.tac_gia_hoac_co_quan} {src.nam_xuat_ban ? `(${src.nam_xuat_ban})` : ''} • {src.loai_nguon}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => onSelectSourceById(src.id)}
                        className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded transition-colors cursor-pointer"
                      >
                        Hồ sơ nguồn
                      </button>
                      {src.url && (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-1 bg-[#8B1E19] hover:bg-[#6B1410] text-white rounded inline-flex items-center space-x-1 transition-colors"
                        >
                          <span>Mở link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 italic">Không có nguồn tư liệu trích dẫn bổ sung</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
