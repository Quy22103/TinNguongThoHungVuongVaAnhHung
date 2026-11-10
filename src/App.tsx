import React, { useState, useEffect, useCallback } from 'react';
import { HoSoDiSan, NguonTuLieu } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeScreen } from './components/HomeScreen';
import { HeritageDetailView } from './components/HeritageDetailView';
import { QAScreen } from './components/QAScreen';
import { SourcesScreen } from './components/SourcesScreen';
import { AboutScreen } from './components/AboutScreen';
import { AdminScreen } from './components/AdminScreen';
import { AdminLoginModal } from './components/AdminLoginModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'detail' | 'qa' | 'sources' | 'about' | 'admin'>('home');
  const [heritageList, setHeritageList] = useState<HoSoDiSan[]>([]);
  const [sourcesList, setSourcesList] = useState<NguonTuLieu[]>([]);
  const [selectedHeritage, setSelectedHeritage] = useState<HoSoDiSan | null>(null);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Admin authentication state
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);

  // Initialize Admin status from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('di_san_admin_token');
    if (savedToken) {
      setAdminToken(savedToken);
      setIsAdmin(true);
    }
  }, []);

  // Fetch initial verified data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [disanRes, nguonRes] = await Promise.all([
        fetch('/api/disan'),
        fetch('/api/nguon-tu-lieu')
      ]);

      if (!disanRes.ok || !nguonRes.ok) {
        throw new Error('Lỗi khi tải dữ liệu từ máy chủ.');
      }

      const disanData = await disanRes.json();
      const nguonData = await nguonRes.json();

      setHeritageList(disanData);
      setSourcesList(nguonData);

      // If a heritage was being viewed, refresh its instance
      if (selectedHeritage) {
        const updated = disanData.find((h: HoSoDiSan) => h.id === selectedHeritage.id);
        if (updated) setSelectedHeritage(updated);
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError('Không thể kết nối đến máy chủ lưu trữ dữ liệu di sản. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, [selectedHeritage]);

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers for switching views
  const handleSelectHeritage = (item: HoSoDiSan) => {
    setSelectedHeritage(item);
    setCurrentTab('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectHeritageById = (id: string) => {
    const found = heritageList.find((h) => h.id === id);
    if (found) {
      handleSelectHeritage(found);
    }
  };

  const handleSelectSource = (sourceId: string) => {
    setSelectedSourceId(sourceId);
    setCurrentTab('sources');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Scroll to specific source card after render
    setTimeout(() => {
      const el = document.getElementById(`source-${sourceId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 200);
  };

  const handleAdminLoginSuccess = (token: string) => {
    localStorage.setItem('di_san_admin_token', token);
    setAdminToken(token);
    setIsAdmin(true);
    setCurrentTab('admin');
  };

  const handleLogoutAdmin = () => {
    localStorage.removeItem('di_san_admin_token');
    setAdminToken(null);
    setIsAdmin(false);
    if (currentTab === 'admin') {
      setCurrentTab('home');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2C241E]">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab as any);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => setShowAdminLoginModal(true)}
        onLogoutAdmin={handleLogoutAdmin}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeScreen
            heritageList={heritageList}
            loading={loading}
            error={error}
            onSelectHeritage={handleSelectHeritage}
            onNavigateToQA={() => setCurrentTab('qa')}
            onRefresh={fetchData}
          />
        )}

        {currentTab === 'detail' && selectedHeritage && (
          <HeritageDetailView
            item={selectedHeritage}
            allSources={sourcesList}
            onBack={() => setCurrentTab('home')}
            onSelectSource={handleSelectSource}
          />
        )}

        {currentTab === 'qa' && (
          <QAScreen
            onSelectHeritageById={handleSelectHeritageById}
            onSelectSourceById={handleSelectSource}
          />
        )}

        {currentTab === 'sources' && (
          <SourcesScreen
            sources={sourcesList}
            heritageList={heritageList}
            selectedSourceId={selectedSourceId}
            onSelectHeritage={handleSelectHeritage}
          />
        )}

        {currentTab === 'about' && <AboutScreen />}

        {currentTab === 'admin' && (
          <AdminScreen
            heritageList={heritageList}
            sourcesList={sourcesList}
            adminToken={adminToken}
            onRefreshData={fetchData}
            onLogout={handleLogoutAdmin}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Admin Login Dialog */}
      <AdminLoginModal
        isOpen={showAdminLoginModal}
        onClose={() => setShowAdminLoginModal(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
}
