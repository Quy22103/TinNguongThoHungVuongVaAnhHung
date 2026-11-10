import React, { useState } from 'react';
import { Lock, X, KeyRound, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Mã quản trị viên không chính xác');
      }

      onLoginSuccess(data.token);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Đăng nhập không thành công');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-stone-200">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2 text-stone-900 font-bold font-serif-culture">
            <Lock className="w-4 h-4 text-[#8B1E19]" />
            <span>Xác thực Quản trị viên</span>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          Khu vực quản trị chỉ dành cho người quản lý hệ thống để bổ sung, điều chỉnh hồ sơ di sản và nguồn tư liệu.
        </p>

        {error && (
          <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center space-x-1.5">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Mã bảo mật quản trị (Admin Key)
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Nhập mã quản trị viên..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1E19]"
                autoFocus
              />
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              Gợi ý mã mặc định hệ thống: <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-600">hungvuong2026</code>
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-stone-300 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-50 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading || !key.trim()}
              className="px-4 py-1.5 bg-[#8B1E19] hover:bg-[#6B1410] disabled:bg-stone-300 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-xs"
            >
              {loading ? 'Đang xác thực...' : 'Đăng nhập'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
