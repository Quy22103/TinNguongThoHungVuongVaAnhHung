import React, { useState, useMemo } from 'react';
import { HoSoDiSan } from '../types';
import { HeritageCard } from './HeritageCard';
import {
  Search,
  Filter,
  Landmark,
  ShieldCheck,
  Sparkles,
  BookOpen,
  MapPin,
  RefreshCw
} from 'lucide-react';

interface HomeScreenProps {
  heritageList: HoSoDiSan[];
  loading: boolean;
  error: string | null;
  onSelectHeritage: (item: HoSoDiSan) => void;
  onNavigateToQA: () => void;
  onRefresh: () => void;
}

const THEME_TABS = [
  { id: 'all', label: 'Tất cả chủ đề' },
  { id: 'Hùng Vương và thời đại Hùng Vương', label: 'Hùng Vương & Thời đại Hùng Vương' },
  { id: 'Tín ngưỡng thờ cúng Hùng Vương', label: 'Tín ngưỡng thờ cúng Hùng Vương' },
  { id: 'Anh hùng dân tộc', label: 'Anh hùng dân tộc' },
  { id: 'Di tích và địa điểm thờ tự', label: 'Di tích & Địa điểm thờ tự' },
  { id: 'Nghi lễ và lễ hội', label: 'Nghi lễ & Lễ hội' },
  { id: 'Truyền thuyết dân gian', label: 'Truyền thuyết dân gian' }
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  heritageList,
  loading,
  error,
  onSelectHeritage,
  onNavigateToQA,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [selectedProvince, setSelectedProvince] = useState('all');

  // Unique provinces list
  const provinces = useMemo(() => {
    const set = new Set<string>();
    heritageList.forEach((h) => {
      if (h.dia_phuong?.tinh_thanh) set.add(h.dia_phuong.tinh_thanh);
    });
    return Array.from(set).sort();
  }, [heritageList]);

  // Filtering
  const filteredList = useMemo(() => {
    return heritageList.filter((item) => {
      // 1. Search filter across official name, other names, figures, location, rituals, classification
      const term = searchTerm.trim().toLowerCase();
      const matchSearch =
        !term ||
        item.id.toLowerCase().includes(term) ||
        item.ten_chinh_thuc.toLowerCase().includes(term) ||
        (item.ten_goi_khac || []).some((n) => n.toLowerCase().includes(term)) ||
        (item.nhan_vat_tho_phung || []).some((v) => v.toLowerCase().includes(term)) ||
        (item.dia_phuong?.tinh_thanh || '').toLowerCase().includes(term) ||
        (item.dia_phuong?.quan_huyen || '').toLowerCase().includes(term) ||
        (item.dia_phuong?.xa_phuong || '').toLowerCase().includes(term) ||
        (item.dia_phuong?.dia_chi || '').toLowerCase().includes(term) ||
        item.loai_hinh.toLowerCase().includes(term) ||
        (item.le_thuc || []).some(
          (l) => l.tieu_de.toLowerCase().includes(term) || l.noi_dung.toLowerCase().includes(term)
        );

      // 2. Theme filter
      const matchTheme =
        selectedTheme === 'all' ||
        item.nhom_chu_de === selectedTheme ||
        (selectedTheme === 'Nghi lễ và lễ hội' && item.le_thuc && item.le_thuc.length > 0) ||
        (selectedTheme === 'Truyền thuyết dân gian' && item.truyen_thuyet && item.truyen_thuyet.length > 0);

      // 3. Province filter
      const matchProvince =
        selectedProvince === 'all' || item.dia_phuong?.tinh_thanh === selectedProvince;

      return matchSearch && matchTheme && matchProvince;
    });
  }, [heritageList, searchTerm, selectedTheme, selectedProvince]);

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Cultural Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#8B1E19] to-[#60130F] text-[#FAF7F2] py-12 sm:py-16 px-4 border-b-4 border-[#D4AF37]">
        {/* Subtle Decorative Pattern Background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-5xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-black/25 text-amber-300 text-xs font-semibold tracking-wider uppercase border border-amber-400/30">
            <Landmark className="w-3.5 h-3.5" />
            <span>Cơ sở Dữ liệu Kiểm chứng Di sản Văn hóa Việt Nam</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif-culture tracking-tight text-white leading-tight">
            Tín ngưỡng thờ Hùng Vương <br className="hidden sm:inline" />
            & Anh hùng dân tộc Việt Nam
          </h1>

          <p className="text-xs sm:text-base text-amber-100/90 max-w-3xl mx-auto leading-relaxed">
            Nền tảng tra cứu, tìm hiểu khoa học và toàn diện về không gian tín ngưỡng Quốc Tổ Hùng Vương, các di tích lịch sử quốc gia đặc biệt và truyền thống tri ân các anh hùng dân tộc trong dòng chảy nghìn năm dựng nước.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onNavigateToQA}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-md transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#8B1E19]" />
              <span>Hỏi đáp thông minh với Gemini</span>
            </button>
            <div className="px-3.5 py-2 rounded-xl bg-black/20 text-amber-200 border border-amber-300/30 text-xs font-medium flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Dữ liệu kiểm chứng UNESCO & Bộ VHTTDL</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Search & Theme Filters Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Search Bar & Province Dropdown */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-stone-200/90 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative md:col-span-3">
              <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tên di tích, nhân vật thờ phụng, địa phương, nghi lễ..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#8B1E19] placeholder:text-stone-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-3.5 text-xs text-stone-400 hover:text-stone-600 bg-stone-100 px-2 py-0.5 rounded cursor-pointer"
                >
                  Xóa
                </button>
              )}
            </div>

            <div className="relative">
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full py-3 px-3.5 rounded-xl border border-stone-300 text-sm text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1E19] cursor-pointer"
              >
                <option value="all">Tất cả địa phương</option>
                {provinces.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 6 Mandatory Theme Tabs */}
          <div className="pt-2 border-t border-stone-100 flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
            <span className="font-semibold text-stone-500 shrink-0 flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Chủ đề:</span>
            </span>
            <div className="flex flex-nowrap space-x-1.5">
              {THEME_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTheme(tab.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                    selectedTheme === tab.id
                      ? 'bg-[#8B1E19] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* State Indicators */}
        {loading && (
          <div className="text-center py-12 space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin text-[#8B1E19] mx-auto" />
            <p className="text-xs text-stone-500 font-medium">Đang tải dữ liệu hồ sơ di sản...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={onRefresh}
              className="text-xs font-bold text-red-800 hover:underline cursor-pointer"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Heritage Grid List */}
        {!loading && !error && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-500 px-1">
              <span>
                Hiển thị <strong>{filteredList.length}</strong> / {heritageList.length} hồ sơ di sản thực tế
              </span>
              {selectedTheme !== 'all' && (
                <button
                  onClick={() => setSelectedTheme('all')}
                  className="text-[#8B1E19] font-medium hover:underline cursor-pointer"
                >
                  Bỏ lọc chủ đề
                </button>
              )}
            </div>

            {filteredList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredList.map((item) => (
                  <HeritageCard key={item.id} item={item} onSelect={onSelectHeritage} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
                <Landmark className="w-10 h-10 text-stone-300 mx-auto" />
                <h3 className="text-base font-bold text-stone-700">Không tìm thấy hồ sơ phù hợp</h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  Hệ thống không tạo dữ liệu giả để lấp đầy giao diện. Vui lòng thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc chủ đề.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTheme('all');
                    setSelectedProvince('all');
                  }}
                  className="px-4 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-800 transition-colors cursor-pointer"
                >
                  Đặt lại toàn bộ bộ lọc
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
