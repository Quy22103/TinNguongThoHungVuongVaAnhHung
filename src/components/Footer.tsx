import React from 'react';
import { Landmark, Shield, ExternalLink, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1C1613] text-[#E0D8D0] border-t-4 border-[#8B1E19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Core Identification & Mandated Text */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#8B1E19] flex items-center justify-center text-amber-300">
                <Landmark className="w-5 h-5" />
              </div>
              <h3 className="font-serif-culture font-bold text-lg text-white">
                Tín ngưỡng thờ Hùng Vương & Anh hùng dân tộc
              </h3>
            </div>
            
            <div className="bg-[#2A221D] p-3.5 rounded-lg border border-amber-900/40 text-xs text-amber-100/90 leading-relaxed">
              <p className="font-medium text-amber-300 mb-1 flex items-center space-x-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>Thông tin thực hiện đề tài:</span>
              </p>
              <p className="italic">
                “Sản phẩm thực tập của Trương Văn Quý, mã sinh viên PH68121, Nhóm 2, Chương trình Thực tập sinh Đợt 15 FPT Polytechnic và IMTA TECH, dự án xã hội phi lợi nhuận.”
              </p>
            </div>
          </div>

          {/* Column 2: Verification Principles */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-300 font-royal flex items-center space-x-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Nguyên tắc kiểm chứng khoa học</span>
            </h4>
            <ul className="text-xs space-y-2 text-stone-300">
              <li className="flex items-start space-x-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Chỉ tiếp nhận dữ liệu từ UNESCO, Cục Di sản văn hóa, Cổng TTĐT Chính phủ và BQL Di tích.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Phân định rành mạch giữa sự kiện lịch sử, truyền thuyết dân gian và thực hành tín ngưỡng.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Gemini chỉ trả lời trên ngữ cảnh đã xác minh, tuyệt đối không bịa đặt nguồn tư liệu.</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Authority Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-300 font-royal">
              Cổng tra cứu chính thống
            </h4>
            <div className="flex flex-col space-y-2 text-xs">
              <a
                href="https://ich.unesco.org/en/RL/worship-of-hung-kings-in-phu-tho-00735"
                target="_blank"
                rel="noreferrer"
                className="text-stone-300 hover:text-amber-300 flex items-center space-x-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                <span>UNESCO: Tín ngưỡng thờ cúng Hùng Vương (2012)</span>
              </a>
              <a
                href="http://disanvanhoa.gov.vn"
                target="_blank"
                rel="noreferrer"
                className="text-stone-300 hover:text-amber-300 flex items-center space-x-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                <span>Cục Di sản văn hóa - Bộ Văn hóa, Thể thao và Du lịch</span>
              </a>
              <a
                href="https://chinhphu.vn"
                target="_blank"
                rel="noreferrer"
                className="text-stone-300 hover:text-amber-300 flex items-center space-x-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                <span>Cổng thông tin điện tử Chính phủ nước CHXHCN Việt Nam</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-stone-800 text-center text-xs text-stone-400">
          Dự án phục vụ mục đích nghiên cứu học tập, nâng cao nhận thức di sản văn hóa truyền thống Việt Nam.
        </div>
      </div>
    </footer>
  );
};
