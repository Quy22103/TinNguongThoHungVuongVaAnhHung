import React from 'react';
import { HoSoDiSan } from '../types';
import { MapPin, Users, Award, ShieldCheck, ArrowRight, ImageOff } from 'lucide-react';

interface HeritageCardProps {
  item: HoSoDiSan;
  onSelect: (item: HoSoDiSan) => void;
}

export const HeritageCard: React.FC<HeritageCardProps> = ({ item, onSelect }) => {
  const primaryImage = item.hinh_anh_tu_lieu && item.hinh_anh_tu_lieu.length > 0 ? item.hinh_anh_tu_lieu[0] : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200/80 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col group">
      {/* Image Thumbnail with caption and source */}
      <div className="relative aspect-video w-full bg-stone-100 overflow-hidden border-b border-stone-100">
        {primaryImage ? (
          <>
            <img
              src={primaryImage.url}
              alt={item.ten_chinh_thuc}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                // Graceful fallback to placeholder if external image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-2.5">
              <p className="text-[11px] text-stone-200 line-clamp-1">
                <span className="font-semibold text-amber-200">Nguồn ảnh:</span> {primaryImage.nguon_anh}
              </p>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-stone-50 p-4">
            <ImageOff className="w-8 h-8 mb-1.5 text-stone-300" />
            <span className="text-xs font-medium">Chưa có ảnh tư liệu</span>
          </div>
        )}

        {/* Verification & ID Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
          <span className="bg-[#8B1E19] text-white text-[11px] font-bold px-2 py-0.5 rounded shadow">
            {item.id}
          </span>
          {item.trang_thai_xac_minh === 'da_xac_minh' && (
            <span className="bg-emerald-600/95 text-white text-[10px] font-medium px-1.5 py-0.5 rounded flex items-center space-x-1 shadow">
              <ShieldCheck className="w-3 h-3" />
              <span>Đã xác minh</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Theme & Classification Badges */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              {item.nhom_chu_de}
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-stone-100 text-stone-700">
              {item.loai_hinh}
            </span>
          </div>

          {/* Official Name */}
          <h3 className="text-base sm:text-lg font-bold font-serif-culture text-[#2C241E] group-hover:text-[#8B1E19] transition-colors leading-snug mb-1">
            {item.ten_chinh_thuc}
          </h3>

          {/* Alternative Names */}
          {item.ten_goi_khac && item.ten_goi_khac.length > 0 && (
            <p className="text-xs text-stone-500 italic mb-2 line-clamp-1">
              Tên gọi khác: {item.ten_goi_khac.join(', ')}
            </p>
          )}

          {/* Worshiped Figures */}
          {item.nhan_vat_tho_phung && item.nhan_vat_tho_phung.length > 0 && (
            <div className="flex items-start space-x-1.5 text-xs text-stone-600 mb-2">
              <Users className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#8B1E19]" />
              <span className="line-clamp-1">
                <strong className="font-semibold text-stone-700">Thờ phụng:</strong>{' '}
                {item.nhan_vat_tho_phung.join(', ')}
              </span>
            </div>
          )}

          {/* Location */}
          <div className="flex items-start space-x-1.5 text-xs text-stone-600 mb-2">
            <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#8B1E19]" />
            <span className="line-clamp-1">
              {item.dia_phuong.xa_phuong ? `${item.dia_phuong.xa_phuong}, ` : ''}
              {item.dia_phuong.quan_huyen ? `${item.dia_phuong.quan_huyen}, ` : ''}
              {item.dia_phuong.tinh_thanh}
            </span>
          </div>

          {/* Description snippet */}
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mt-1">
            {item.mo_ta_dac_trung || 'Chưa có tư liệu xác minh cho nội dung này'}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <span className="text-[11px] text-stone-400">
            {item.nguon_tu_lieu?.length || 0} nguồn tư liệu
          </span>
          <button
            onClick={() => onSelect(item)}
            className="text-xs font-semibold text-[#8B1E19] group-hover:text-[#6B1410] flex items-center space-x-1 hover:underline cursor-pointer"
          >
            <span>Xem chi tiết hồ sơ</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
