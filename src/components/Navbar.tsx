import React from 'react';
import { BookOpen, Search, Sparkles, ShieldCheck, Info, UserCheck, Landmark } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isAdmin: boolean;
  onOpenAdminLogin: () => void;
  onLogoutAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  isAdmin,
  onOpenAdminLogin,
  onLogoutAdmin
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#8B1E19] text-[#FAF7F2] shadow-md border-b-2 border-[#D4AF37]">
      {/* Top Banner with Vietnamese Heritage Motto */}
      <div className="bg-[#6B1410] px-4 py-1.5 text-xs text-amber-200 text-center font-medium tracking-wide flex items-center justify-center space-x-2 border-b border-[#8B1E19]/40">
        <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
        <span>Dự án Xã hội Phi lợi nhuận • Tôn vinh cội nguồn dân tộc • Dữ liệu kiểm chứng khoa học</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Title */}
          <button
            onClick={() => setCurrentTab('home')}
            className="flex items-center space-x-3 text-left focus:outline-none group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] p-1 shadow-inner border border-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Landmark className="w-7 h-7 text-[#8B1E19]" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-amber-300 font-semibold font-royal">
                Di sản Văn hóa Việt Nam
              </div>
              <h1 className="text-base sm:text-lg font-bold font-serif-culture text-white leading-tight">
                Tín ngưỡng thờ Hùng Vương & Anh hùng dân tộc
              </h1>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
                currentTab === 'home'
                  ? 'bg-[#A82520] text-amber-200 shadow-sm border border-amber-300/30'
                  : 'text-amber-100/90 hover:bg-[#9B201A] hover:text-white'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Trang chủ & Tra cứu</span>
            </button>

            <button
              onClick={() => setCurrentTab('qa')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
                currentTab === 'qa'
                  ? 'bg-[#A82520] text-amber-200 shadow-sm border border-amber-300/30'
                  : 'text-amber-100/90 hover:bg-[#9B201A] hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Hỏi đáp Gemini</span>
            </button>

            <button
              onClick={() => setCurrentTab('sources')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
                currentTab === 'sources'
                  ? 'bg-[#A82520] text-amber-200 shadow-sm border border-amber-300/30'
                  : 'text-amber-100/90 hover:bg-[#9B201A] hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Nguồn tư liệu</span>
            </button>

            <button
              onClick={() => setCurrentTab('about')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
                currentTab === 'about'
                  ? 'bg-[#A82520] text-amber-200 shadow-sm border border-amber-300/30'
                  : 'text-amber-100/90 hover:bg-[#9B201A] hover:text-white'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>Giới thiệu</span>
            </button>

            {/* Admin Management */}
            {isAdmin ? (
              <div className="flex items-center pl-2 space-x-1">
                <button
                  onClick={() => setCurrentTab('admin')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 cursor-pointer ${
                    currentTab === 'admin'
                      ? 'bg-amber-400 text-stone-900 font-bold shadow'
                      : 'bg-amber-500/20 text-amber-200 hover:bg-amber-500/30'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Khu Quản trị</span>
                </button>
                <button
                  onClick={onLogoutAdmin}
                  className="px-2.5 py-1.5 text-xs text-amber-200/80 hover:text-white hover:underline cursor-pointer"
                  title="Thoát quyền quản trị"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="ml-2 px-3 py-1.5 rounded text-xs font-medium border border-amber-300/40 text-amber-200 hover:bg-amber-900/40 transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Quản trị viên</span>
              </button>
            )}
          </nav>

          {/* Mobile menu buttons */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setCurrentTab('qa')}
              className="p-2 rounded-md bg-[#A82520] text-amber-200 text-xs flex items-center space-x-1"
            >
              <Sparkles className="w-4 h-4" />
              <span>Hỏi đáp</span>
            </button>
            {isAdmin ? (
              <button
                onClick={() => setCurrentTab('admin')}
                className="px-2 py-1 bg-amber-400 text-stone-900 rounded text-xs font-bold"
              >
                Quản trị
              </button>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="px-2 py-1 border border-amber-300/50 rounded text-xs text-amber-200"
              >
                Admin
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-[#8B1E19]/60 text-xs">
          <button
            onClick={() => setCurrentTab('home')}
            className={`px-2 py-1 rounded ${currentTab === 'home' ? 'text-amber-200 font-bold' : 'text-amber-100/80'}`}
          >
            Trang chủ
          </button>
          <button
            onClick={() => setCurrentTab('sources')}
            className={`px-2 py-1 rounded ${currentTab === 'sources' ? 'text-amber-200 font-bold' : 'text-amber-100/80'}`}
          >
            Nguồn tư liệu
          </button>
          <button
            onClick={() => setCurrentTab('about')}
            className={`px-2 py-1 rounded ${currentTab === 'about' ? 'text-amber-200 font-bold' : 'text-amber-100/80'}`}
          >
            Giới thiệu
          </button>
        </div>
      </div>
    </header>
  );
};
