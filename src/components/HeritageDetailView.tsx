import React from 'react';
import { HoSoDiSan, NguonTuLieu } from '../types';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  Users,
  Compass,
  FileText,
  ExternalLink,
  ShieldCheck,
  Scroll,
  History,
  Image as ImageIcon
} from 'lucide-react';

interface HeritageDetailViewProps {
  item: HoSoDiSan;
  allSources: NguonTuLieu[];
  onBack: () => void;
  onSelectSource: (sourceId: string) => void;
}

export const HeritageDetailView: React.FC<HeritageDetailViewProps> = ({
  item,
  allSources,
  onBack,
  onSelectSource
}) => {
  const sourceMap = new Map(allSources.map((s) => [s.id, s]));

  const renderFallback = () => (
    <span className="text-stone-400 italic text-sm">
      Chưa có tư liệu xác minh cho nội dung này
    </span>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Back Button & Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-sm font-medium text-[#8B1E19] hover:text-[#6B1410] bg-white px-3.5 py-1.5 rounded-lg border border-stone-200 shadow-xs cursor-pointer hover:bg-stone-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách hồ sơ</span>
        </button>

        <div className="flex items-center space-x-2 text-xs">
          <span className="bg-[#8B1E19] text-white px-2.5 py-1 rounded font-bold font-mono">
            Mã hồ sơ: {item.id}
          </span>
          {item.trang_thai_xac_minh === 'da_xac_minh' ? (
            <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded font-medium flex items-center space-x-1 border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dữ liệu đã xác minh</span>
            </span>
          ) : (
            <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded font-medium border border-amber-300">
              Chưa xác minh
            </span>
          )}
        </div>
      </div>

      {/* Hero Banner Title Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-4">
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-semibold uppercase tracking-wider font-royal">
            {item.nhom_chu_de || renderFallback()}
          </span>
          <span className="px-3 py-1 bg-stone-100 text-stone-800 rounded-full text-xs font-medium">
            {item.loai_hinh || renderFallback()}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif-culture text-[#2C241E] leading-tight">
          {item.ten_chinh_thuc || renderFallback()}
        </h1>

        {item.ten_goi_khac && item.ten_goi_khac.length > 0 ? (
          <p className="text-sm text-stone-600">
            <strong className="font-semibold text-stone-800">Tên gọi khác: </strong>
            <span className="italic">{item.ten_goi_khac.join(', ')}</span>
          </p>
        ) : null}

        {/* Worshiped Figures */}
        <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-2 text-sm">
          <span className="font-semibold text-stone-800 flex items-center space-x-1.5 text-[#8B1E19]">
            <Users className="w-4 h-4" />
            <span>Đối tượng / Nhân vật thờ phụng:</span>
          </span>
          {item.nhan_vat_tho_phung && item.nhan_vat_tho_phung.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {item.nhan_vat_tho_phung.map((nv, idx) => (
                <span
                  key={idx}
                  className="bg-[#FAF7F2] text-stone-800 border border-stone-300/80 px-2.5 py-0.5 rounded text-xs font-medium"
                >
                  {nv}
                </span>
              ))}
            </div>
          ) : (
            renderFallback()
          )}
        </div>

        {/* Location & GPS Coordinates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-stone-100 text-xs sm:text-sm">
          <div className="flex items-start space-x-2 text-stone-700">
            <MapPin className="w-4 h-4 mt-0.5 text-[#8B1E19] shrink-0" />
            <div>
              <span className="font-semibold text-stone-900">Địa chỉ & Địa phương: </span>
              {item.dia_phuong?.dia_chi ||
                `${item.dia_phuong?.xa_phuong || ''}, ${item.dia_phuong?.quan_huyen || ''}, ${item.dia_phuong?.tinh_thanh || ''}` ||
                renderFallback()}
            </div>
          </div>

          <div className="flex items-start space-x-2 text-stone-700">
            <Compass className="w-4 h-4 mt-0.5 text-[#8B1E19] shrink-0" />
            <div>
              <span className="font-semibold text-stone-900">Tọa độ địa lý: </span>
              {item.toa_do?.vi_do !== null && item.toa_do?.kinh_do !== null ? (
                <span>
                  {item.toa_do.vi_do}°B, {item.toa_do.kinh_do}°Đ
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${item.toa_do.vi_do},${item.toa_do.kinh_do}`}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-2 text-[#8B1E19] hover:underline inline-flex items-center space-x-1"
                  >
                    <span>Xem bản đồ</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </span>
              ) : (
                renderFallback()
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery / Documentary Photos with explicit caption and sources */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-4">
        <h2 className="text-lg font-bold font-serif-culture text-[#2C241E] flex items-center space-x-2 border-b border-stone-100 pb-3">
          <ImageIcon className="w-5 h-5 text-[#8B1E19]" />
          <span>Hình ảnh tư liệu lịch sử & Di tích</span>
        </h2>

        {item.hinh_anh_tu_lieu && item.hinh_anh_tu_lieu.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {item.hinh_anh_tu_lieu.map((img, idx) => (
              <figure key={idx} className="rounded-xl overflow-hidden border border-stone-200 bg-stone-50">
                <div className="aspect-video w-full overflow-hidden bg-stone-200">
                  <img
                    src={img.url}
                    alt={img.chu_thich || item.ten_chinh_thuc}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <figcaption className="p-3.5 space-y-1.5 text-xs">
                  <p className="font-medium text-stone-800">{img.chu_thich}</p>
                  <p className="text-stone-500">
                    <strong className="text-stone-700">Nguồn ảnh:</strong> {img.nguon_anh}
                  </p>
                  {img.ban_quyen && (
                    <p className="text-stone-400 text-[11px]">
                      <strong>Bản quyền:</strong> {img.ban_quyen}
                    </p>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center bg-stone-50 rounded-xl border border-dashed border-stone-300">
            {renderFallback()}
          </div>
        )}
      </div>

      {/* Detailed Characteristic Description */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-4">
        <h2 className="text-lg font-bold font-serif-culture text-[#2C241E] flex items-center space-x-2 border-b border-stone-100 pb-3">
          <FileText className="w-5 h-5 text-[#8B1E19]" />
          <span>Mô tả đặc trưng & Giá trị văn hóa</span>
        </h2>
        <div className="text-sm leading-relaxed text-stone-700 whitespace-pre-line">
          {item.mo_ta_dac_trung ? item.mo_ta_dac_trung : renderFallback()}
        </div>
      </div>

      {/* Rituals & Practices (Nghi lễ và lễ hội) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-4">
        <h2 className="text-lg font-bold font-serif-culture text-[#2C241E] flex items-center space-x-2 border-b border-stone-100 pb-3">
          <Calendar className="w-5 h-5 text-[#8B1E19]" />
          <span>Nghi lễ, Lễ thức & Tập tục truyền thống</span>
        </h2>

        {item.le_thuc && item.le_thuc.length > 0 ? (
          <div className="space-y-4">
            {item.le_thuc.map((le, idx) => {
              const src = le.ma_nguon ? sourceMap.get(le.ma_nguon) : null;
              return (
                <div key={idx} className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/70 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-bold text-sm text-[#8B1E19]">{le.tieu_de}</h3>
                    {le.thoi_gian && (
                      <span className="text-xs px-2.5 py-0.5 rounded bg-white text-stone-700 border border-stone-200">
                        {le.thoi_gian}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">{le.noi_dung}</p>
                  {src && (
                    <div className="pt-2 text-xs text-stone-500 border-t border-amber-200/50 flex items-center justify-between">
                      <span>Căn cứ nguồn: <strong className="text-stone-700">[{src.id}]</strong> {src.ten_tai_lieu}</span>
                      <button
                        onClick={() => onSelectSource(src.id)}
                        className="text-[#8B1E19] hover:underline cursor-pointer font-medium ml-2 shrink-0"
                      >
                        Xem nguồn
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          renderFallback()
        )}
      </div>

      {/* Legends (Truyền thuyết dân gian) - Distinct from historical facts */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h2 className="text-lg font-bold font-serif-culture text-[#2C241E] flex items-center space-x-2">
            <Scroll className="w-5 h-5 text-[#8B1E19]" />
            <span>Truyền thuyết & Huyền tích dân gian</span>
          </h2>
          <span className="text-[11px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-medium">
            Phân định: Truyền thuyết dân gian
          </span>
        </div>

        <div className="p-3 bg-amber-50/80 rounded-lg text-xs text-amber-900 border border-amber-200 italic">
          * Lưu ý phương pháp luận: Truyền thuyết dân gian phản ánh tâm thức và niềm tin văn hóa của nhân dân, không đồng nhất với sự kiện lịch sử đã được chứng minh qua tư liệu khảo cổ và chính sử.
        </div>

        {item.truyen_thuyet && item.truyen_thuyet.length > 0 ? (
          <div className="space-y-4">
            {item.truyen_thuyet.map((tt, idx) => {
              const src = tt.ma_nguon ? sourceMap.get(tt.ma_nguon) : null;
              return (
                <div key={idx} className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                  <h3 className="font-bold text-sm text-stone-900">{tt.tieu_de}</h3>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">{tt.noi_dung}</p>
                  {src && (
                    <div className="pt-2 text-xs text-stone-500 border-t border-stone-200 flex items-center justify-between">
                      <span>Căn cứ nguồn: <strong className="text-stone-700">[{src.id}]</strong> {src.ten_tai_lieu}</span>
                      <button
                        onClick={() => onSelectSource(src.id)}
                        className="text-[#8B1E19] hover:underline cursor-pointer font-medium ml-2 shrink-0"
                      >
                        Xem nguồn
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          renderFallback()
        )}
      </div>

      {/* Formation History & Milestones */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-4">
        <h2 className="text-lg font-bold font-serif-culture text-[#2C241E] flex items-center space-x-2 border-b border-stone-100 pb-3">
          <History className="w-5 h-5 text-[#8B1E19]" />
          <span>Lịch sử hình thành & Các mốc thời gian</span>
        </h2>

        {item.lich_su_hinh_thanh && item.lich_su_hinh_thanh.length > 0 ? (
          <div className="relative pl-6 border-l-2 border-[#8B1E19]/40 space-y-6 my-2">
            {item.lich_su_hinh_thanh.map((ls, idx) => {
              const src = ls.ma_nguon ? sourceMap.get(ls.ma_nguon) : null;
              return (
                <div key={idx} className="relative space-y-1.5">
                  <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-[#8B1E19] border-2 border-white"></span>
                  <div className="text-xs font-bold text-[#8B1E19] uppercase tracking-wide">
                    {ls.giai_doan}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">{ls.noi_dung}</p>
                  {src && (
                    <div className="text-xs text-stone-500 flex items-center space-x-2 pt-1">
                      <span>Nguồn: [{src.id}] {src.ten_tai_lieu}</span>
                      <button
                        onClick={() => onSelectSource(src.id)}
                        className="text-[#8B1E19] hover:underline cursor-pointer font-medium"
                      >
                        [Chi tiết]
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          renderFallback()
        )}
      </div>

      {/* Inscription & Ranking Status */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-4">
        <h2 className="text-lg font-bold font-serif-culture text-[#2C241E] flex items-center space-x-2 border-b border-stone-100 pb-3">
          <Award className="w-5 h-5 text-[#8B1E19]" />
          <span>Thông tin ghi danh & Xếp hạng di sản</span>
        </h2>

        {item.thong_tin_ghi_danh && item.thong_tin_ghi_danh.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {item.thong_tin_ghi_danh.map((gd, idx) => {
              const src = gd.ma_nguon ? sourceMap.get(gd.ma_nguon) : null;
              return (
                <div key={idx} className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
                  <div className="flex items-center space-x-2 text-[#8B1E19] font-bold text-sm">
                    <Award className="w-4 h-4 shrink-0" />
                    <span>{gd.danh_hieu}</span>
                  </div>
                  <div className="text-xs text-stone-600 space-y-1">
                    <p><strong>Cơ quan công nhận / ghi danh:</strong> {gd.co_quan}</p>
                    {gd.nam && <p><strong>Năm ghi danh:</strong> {gd.nam}</p>}
                    {gd.van_ban && <p><strong>Văn bản căn cứ:</strong> {gd.van_ban}</p>}
                  </div>
                  {src && (
                    <div className="pt-2 border-t border-stone-200 text-xs flex items-center justify-between text-stone-500">
                      <span className="truncate">Nguồn: [{src.id}]</span>
                      <button
                        onClick={() => onSelectSource(src.id)}
                        className="text-[#8B1E19] hover:underline font-medium cursor-pointer"
                      >
                        Xem nguồn tư liệu
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          renderFallback()
        )}
      </div>

      {/* Corresponding Sources List */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-4">
        <h2 className="text-lg font-bold font-serif-culture text-[#2C241E] flex items-center space-x-2 border-b border-stone-100 pb-3">
          <BookOpen className="w-5 h-5 text-[#8B1E19]" />
          <span>Danh mục Nguồn tư liệu kiểm chứng của hồ sơ này</span>
        </h2>

        {item.nguon_tu_lieu && item.nguon_tu_lieu.length > 0 ? (
          <div className="divide-y divide-stone-100">
            {item.nguon_tu_lieu.map((sourceId) => {
              const src = sourceMap.get(sourceId);
              if (!src) {
                return (
                  <div key={sourceId} className="py-2.5 text-xs text-stone-400">
                    Mã nguồn: {sourceId} (Đang cập nhật chi tiết)
                  </div>
                );
              }
              return (
                <div key={src.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold font-mono px-2 py-0.5 bg-amber-100 text-amber-900 rounded">
                        {src.id}
                      </span>
                      <h4 className="text-xs sm:text-sm font-semibold text-stone-800">
                        {src.ten_tai_lieu}
                      </h4>
                    </div>
                    <p className="text-xs text-stone-500">
                      {src.tac_gia_hoac_co_quan} {src.nam_xuat_ban ? `(${src.nam_xuat_ban})` : ''} • {src.loai_nguon}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onSelectSource(src.id)}
                      className="text-xs px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded transition-colors cursor-pointer"
                    >
                      Chi tiết nguồn
                    </button>
                    {src.url && (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs px-2.5 py-1 bg-[#8B1E19] hover:bg-[#6B1410] text-white rounded inline-flex items-center space-x-1 transition-colors"
                      >
                        <span>Mở liên kết</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          renderFallback()
        )}
      </div>
    </div>
  );
};
