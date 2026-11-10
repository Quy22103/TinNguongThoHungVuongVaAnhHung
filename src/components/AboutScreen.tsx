import React from 'react';
import { Award, ShieldCheck, Scale, Compass, CheckCircle2, BookOpen, HeartHandshake } from 'lucide-react';

export const AboutScreen: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider font-royal">
          <Award className="w-3.5 h-3.5 text-[#8B1E19]" />
          <span>Hồ sơ Dự án Xã hội & Nghiên cứu Văn hóa</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif-culture text-[#2C241E]">
          Giới thiệu Dự án
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto">
          Tra cứu, bảo tồn và lan tỏa giá trị Tín ngưỡng thờ cúng Hùng Vương cùng việc phụng thờ các Anh hùng dân tộc Việt Nam.
        </p>
      </div>

      {/* Mandatory Official Intern Statement Card */}
      <div className="bg-gradient-to-br from-[#8B1E19] to-[#6B1410] text-white rounded-2xl p-6 sm:p-8 shadow-md border-2 border-amber-400 space-y-4">
        <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider font-royal">
          <Award className="w-4 h-4 text-amber-300" />
          <span>Công bố thông tin tác giả & Khóa thực tập</span>
        </div>

        <blockquote className="text-base sm:text-lg lg:text-xl font-serif-culture font-bold text-amber-100 leading-relaxed bg-black/20 p-4 sm:p-6 rounded-xl border border-amber-300/40">
          “Sản phẩm thực tập của Trương Văn Quý, mã sinh viên PH68121, Nhóm 2, Chương trình Thực tập sinh Đợt 15 FPT Polytechnic và IMTA TECH, dự án xã hội phi lợi nhuận.”
        </blockquote>

        <p className="text-xs text-amber-200/90 leading-relaxed">
          Đề tài được xây dựng nhằm phục vụ cộng đồng, học sinh, sinh viên và nhân dân tìm hiểu các giá trị tín ngưỡng thờ cúng Hùng Vương, các khu di tích lịch sử quốc gia đặc biệt và công đức của các bậc tiền nhân anh hùng dân tộc trong lịch sử dựng nước và giữ nước.
        </p>
      </div>

      {/* 4 Pillars of Information Verification */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-6">
        <h2 className="text-lg font-bold font-serif-culture text-[#2C241E] flex items-center space-x-2 border-b border-stone-100 pb-3">
          <Scale className="w-5 h-5 text-[#8B1E19]" />
          <span>Nguyên tắc kiểm chứng khoa học & Chống bịa đặt dữ liệu</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center space-x-2 text-stone-900 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>1. Sự kiện lịch sử có căn cứ</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Các mốc thời gian, niên đại, trận đánh, triều đại và văn bản pháp luật được đối chiếu theo chính sử (Đại Việt Sử Ký Toàn Thư, Khâm Định Việt Sử Thông Giám Cương Mục) và các Quyết định xếp hạng Di tích quốc gia đặc biệt của Thủ tướng Chính phủ.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center space-x-2 text-stone-900 font-bold text-sm">
              <Compass className="w-4 h-4 text-amber-600 shrink-0" />
              <span>2. Truyền thuyết dân gian</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Không trình bày truyền thuyết như sự kiện lịch sử đã được chứng minh. Các huyền tích (như Bọc trăm trứng, Rồng vàng che chở, Hóa tiên) được phân định rõ ràng là truyền thuyết dân gian phản ánh tâm thức văn hóa cộng đồng.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center space-x-2 text-stone-900 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>3. Tín ngưỡng và thực hành thờ cúng</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Tập trung vào các nghi lễ, tế tự, rước kiệu, dâng hương, hội quân đã được UNESCO ghi danh vào Danh sách Di sản văn hóa phi vật thể đại diện của nhân loại và Bộ VHTTDL công nhận Di sản phi vật thể quốc gia.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center space-x-2 text-stone-900 font-bold text-sm">
              <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
              <span>4. Kiểm chứng kép với Gemini</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Gemini hoạt động qua kiểm tra logic ở backend trước và sau khi gọi mô hình. Tuyệt đối không sinh nguồn giả, không suy đoán. Nếu không có tư liệu, hệ thống xuất hiện thông báo từ chối chính xác theo nguyên tắc quy định.
            </p>
          </div>
        </div>
      </div>

      {/* Social and Non-profit Mission */}
      <div className="bg-[#FAF7F2] rounded-2xl p-6 sm:p-8 border border-amber-200/80 space-y-3">
        <h3 className="font-serif-culture font-bold text-base text-[#2C241E] flex items-center space-x-2">
          <HeartHandshake className="w-5 h-5 text-[#8B1E19]" />
          <span>Cam kết phi lợi nhuận & Mã nguồn mở rộng</span>
        </h3>
        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
          Hệ thống được thiết kế với kiến trúc mở, cho phép Ban quản trị trong tương lai tiếp tục bổ sung các hồ sơ di sản thờ Hùng Vương tại các tỉnh thành phía Nam, miền Trung, cũng như mở rộng hồ sơ các vị anh hùng dân tộc tiêu biểu khác qua giao diện Quản trị viên và các tệp dữ liệu chuẩn hóa JSON.
        </p>
      </div>
    </div>
  );
};
