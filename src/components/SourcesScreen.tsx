import React, { useState } from 'react';
import { NguonTuLieu, HoSoDiSan } from '../types';
import {
  BookOpen,
  Search,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Building,
  FileCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface SourcesScreenProps {
  sources: NguonTuLieu[];
  heritageList: HoSoDiSan[];
  selectedSourceId: string | null;
  onSelectHeritage: (item: HoSoDiSan) => void;
}

export const SourcesScreen: React.FC<SourcesScreenProps> = ({
  sources,
  heritageList,
  selectedSourceId,
  onSelectHeritage
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'da_xac_minh' | 'chua_xac_minh'>('all');

  const verifiedCount = sources.filter((s) => s.trang_thai_xac_minh === 'da_xac_minh').length;
  const unverifiedCount = sources.filter((s) => s.trang_thai_xac_minh === 'chua_xac_minh').length;

  const filteredSources = sources.filter((src) => {
    const matchesSearch =
      src.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      src.ten_tai_lieu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      src.tac_gia_hoac_co_quan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      src.noi_dung_ho_tro.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || src.trang_thai_xac_minh === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Helper to find related heritage records for a source
  const getRelatedHeritage = (sourceId: string) => {
    return heritageList.filter((item) => {
      const inMain = item.nguon_tu_lieu?.includes(sourceId);
      const inLe = item.le_thuc?.some((l) => l.ma_nguon === sourceId);
      const inTruyen = item.truyen_thuyet?.some((t) => t.ma_nguon === sourceId);
      const inLichSu = item.lich_su_hinh_thanh?.some((h) => h.ma_nguon === sourceId);
      const inGhiDanh = item.thong_tin_ghi_danh?.some((g) => g.ma_nguon === sourceId);
      return inMain || inLe || inTruyen || inLichSu || inGhiDanh;
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Title & Stats Overview */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider font-royal">
          <BookOpen className="w-3.5 h-3.5 text-[#8B1E19]" />
          <span>Hệ thống Tư liệu & Thư mục Tham chiếu Khoa học</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif-culture text-[#2C241E]">
          Danh mục Nguồn tư liệu đã kiểm chứng
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
          Toàn bộ thông tin được đối chiếu từ hồ sơ quốc tế UNESCO, cơ sở dữ liệu của Cục Di sản văn hóa (Bộ VHTTDL), văn bản quy phạm pháp luật của Thủ tướng Chính phủ và Ban quản lý di tích.
        </p>
      </div>

      {/* Verification Counter Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 flex items-center space-x-3 shadow-xs">
          <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 font-bold">
            {sources.length}
          </div>
          <div>
            <div className="text-xs text-stone-500 font-medium">Tổng nguồn tư liệu</div>
            <div className="text-base font-bold text-stone-900">
              {sources.length} tài liệu lưu trữ
            </div>
          </div>
        </div>

        <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 flex items-center space-x-3 shadow-xs">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-emerald-800 font-medium">Nguồn đã xác minh</div>
            <div className="text-base font-bold text-emerald-950">
              {verifiedCount} nguồn hợp lệ {verifiedCount >= 10 ? '(Đạt chuẩn >= 10)' : ''}
            </div>
          </div>
        </div>

        <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 flex items-center space-x-3 shadow-xs">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-amber-800 font-medium">Nguồn chưa xác minh</div>
            <div className="text-base font-bold text-amber-950">
              {unverifiedCount} nguồn (Chờ thẩm định)
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã, tên tài liệu, cơ quan phát hành..."
            className="w-full pl-9 pr-4 py-2 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#8B1E19]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <span className="text-xs text-stone-500 font-medium whitespace-nowrap">Lọc trạng thái:</span>
          <div className="flex rounded-lg border border-stone-200 p-0.5 bg-stone-50 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white font-bold text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Tất cả ({sources.length})
            </button>
            <button
              onClick={() => setStatusFilter('da_xac_minh')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                statusFilter === 'da_xac_minh'
                  ? 'bg-emerald-600 font-bold text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Đã xác minh ({verifiedCount})
            </button>
            <button
              onClick={() => setStatusFilter('chua_xac_minh')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                statusFilter === 'chua_xac_minh'
                  ? 'bg-amber-600 font-bold text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Chưa xác minh ({unverifiedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Sources List Grid */}
      <div className="space-y-4">
        {filteredSources.length > 0 ? (
          filteredSources.map((src) => {
            const related = getRelatedHeritage(src.id);
            const isHighlight = selectedSourceId === src.id;

            return (
              <div
                key={src.id}
                id={`source-${src.id}`}
                className={`bg-white rounded-xl p-5 border transition-all space-y-3 ${
                  isHighlight
                    ? 'ring-2 ring-[#8B1E19] border-[#8B1E19] bg-amber-50/20 shadow-md'
                    : 'border-stone-200 hover:border-stone-300 shadow-xs'
                }`}
              >
                {/* Header: ID, Title, Status */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-[#8B1E19] text-white">
                        {src.id}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                        {src.loai_nguon}
                      </span>
                      {src.trang_thai_xac_minh === 'da_xac_minh' ? (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Đã xác minh chính thống</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                          Chưa xác minh
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold font-serif-culture text-[#2C241E] leading-snug">
                      {src.ten_tai_lieu}
                    </h3>
                  </div>

                  {src.url && (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FAF7F2] hover:bg-[#8B1E19] text-[#8B1E19] hover:text-white border border-[#8B1E19]/30 transition-colors shrink-0"
                    >
                      <span>Truy cập nguồn</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* Author, Publication Year, Position */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-stone-600 pt-2 border-t border-stone-100">
                  <div className="flex items-center space-x-1.5">
                    <Building className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">
                      <strong>Cơ quan/Tác giả:</strong> {src.tac_gia_hoac_co_quan}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>
                      <strong>Năm công bố:</strong> {src.nam_xuat_ban || 'Chưa xác định'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">
                      <strong>Vị trí/Văn bản:</strong> {src.trang_hoac_vi_tri || 'Toàn văn'}
                    </span>
                  </div>
                </div>

                {/* Supported Content */}
                <div className="p-3 bg-stone-50 rounded-lg text-xs text-stone-700 leading-relaxed">
                  <strong className="text-stone-900">Nội dung được hỗ trợ chứng thực: </strong>
                  {src.noi_dung_ho_tro}
                </div>

                {/* URL Verification Date & Related Heritage */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-500 gap-2 pt-1">
                  <span>Ngày kiểm tra URL: <strong>{src.ngay_kiem_tra_url || '2026-10-29'}</strong></span>

                  {related.length > 0 ? (
                    <div className="flex items-center space-x-1.5 flex-wrap">
                      <span className="font-medium text-stone-700">Hồ sơ liên quan:</span>
                      {related.map((h) => (
                        <button
                          key={h.id}
                          onClick={() => onSelectHeritage(h)}
                          className="px-2 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-[#8B1E19] font-medium border border-amber-200 transition-colors cursor-pointer"
                        >
                          {h.id} - {h.ten_chinh_thuc}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span className="italic text-stone-400">Chưa gắn với hồ sơ cụ thể</span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-stone-200 text-stone-500 text-sm">
            Không tìm thấy nguồn tư liệu phù hợp với điều kiện tìm kiếm.
          </div>
        )}
      </div>
    </div>
  );
};
