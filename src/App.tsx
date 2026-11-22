import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { ToastContainer } from './components/common/ToastContainer';
import { Phase2Modal } from './components/roadmap/Phase2Modal';
import { OnboardingModal } from './pages/auth/OnboardingModal';
import { LoginPage } from './pages/auth/LoginPage';
import { PublicLandingDashboard } from './pages/dashboard/PublicLandingDashboard';
import { AgriChatbotModal } from './components/ai/AgriChatbotModal';
import { FloatingAiLauncher } from './components/ai/FloatingAiLauncher';

// Pages
import { HomeDashboard } from './pages/dashboard/HomeDashboard';
import { AgricultureHub } from './pages/agriculture/AgricultureHub';
import { LivestockHub } from './pages/livestock/LivestockHub';
import { FisheriesHub } from './pages/fisheries/FisheriesHub';
import { MarketplaceHub } from './pages/marketplace/MarketplaceHub';
import { MarketPricesPage } from './pages/prices/MarketPricesPage';
import { ExpertsHub } from './pages/experts/ExpertsHub';
import { ExpertDashboard } from './pages/experts/ExpertDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ProfilePage } from './pages/profile/ProfilePage';

export const App: React.FC = () => {
  const { isOffline, language, isAuthenticated } = useApp();

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [currentSubTab, setCurrentSubTab] = useState<string>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [showChatbot, setShowChatbot] = useState<boolean>(false);
  const [chatbotQuery, setChatbotQuery] = useState<string>('');

  const handleNavigate = (tab: string, subtab?: string) => {
    if (tab === 'chatbot' || tab === 'ai') {
      setShowChatbot(true);
      return;
    }
    if (tab === 'login') {
      setShowLoginModal(true);
      return;
    }
    setCurrentTab(tab);
    if (subtab) {
      setCurrentSubTab(subtab);
    } else {
      setCurrentSubTab('overview');
    }
    setMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If unauthenticated: visitor sees clean, minimal public landing dashboard with Login as primary gateway
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-rice flex flex-col font-sans selection:bg-forest/20 selection:text-forest-dark antialiased">
        <PublicLandingDashboard
          onOpenLogin={() => setShowLoginModal(true)}
          onOpenRegister={() => setShowOnboarding(true)}
        />
        <LoginPage
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => {
            setShowLoginModal(false);
            setCurrentTab('dashboard');
          }}
          onOpenRegister={() => {
            setShowLoginModal(false);
            setShowOnboarding(true);
          }}
          onExploreAsGuest={() => {
            setShowLoginModal(false);
            setCurrentTab('dashboard');
          }}
        />
        <OnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rice flex flex-col font-sans selection:bg-forest/20 selection:text-forest-dark antialiased">
      {/* Offline Status Bar Banner (if toggled) */}
      {isOffline && (
        <div className="bg-amber-600 text-white text-xs font-semibold py-1.5 px-4 text-center">
          {language === 'bn' 
            ? '⚠️ সিমুলেটেড অফলাইন মোড: সংরক্ষিত ডেটা লোকাল স্টোরেজে সক্রিয় রয়েছে। রিমোট অ্যাকশনের জন্য অনলাইন সংযোগ প্রয়োজন।' 
            : '⚠️ Simulated Offline Mode: Saved records accessible locally. Remote actions require connectivity.'}
        </div>
      )}

      {/* Top Navbar */}
      <Navbar 
        onOpenMobileMenu={() => setMobileDrawerOpen(true)} 
        onSelectTab={(tab) => handleNavigate(tab)}
      />

      {/* Main Body with Sidebar + Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => handleNavigate(tab)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24 sm:pb-20 md:pb-8 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <HomeDashboard 
              onNavigate={handleNavigate} 
              onOpenChatbot={(query) => {
                setChatbotQuery(query || '');
                setShowChatbot(true);
              }}
            />
          )}
          {currentTab === 'agriculture' && <AgricultureHub key={`agriculture_${currentSubTab}`} initialSubTab={currentSubTab} />}
          {currentTab === 'livestock' && <LivestockHub key={`livestock_${currentSubTab}`} initialSubTab={currentSubTab} />}
          {currentTab === 'fisheries' && <FisheriesHub key={`fisheries_${currentSubTab}`} initialSubTab={currentSubTab} />}
          {currentTab === 'marketplace' && <MarketplaceHub key={`marketplace_${currentSubTab}`} initialSubTab={currentSubTab} />}
          {currentTab === 'prices' && <MarketPricesPage />}
          {currentTab === 'experts' && <ExpertsHub />}
          {currentTab === 'expert_dashboard' && <ExpertDashboard />}
          {currentTab === 'admin' && <AdminDashboard />}
          {currentTab === 'profile' && <ProfilePage onNavigate={handleNavigate} />}
        </main>
      </div>

      {/* Mobile Sticky Navigation & Drawer */}
      <MobileNav
        currentTab={currentTab}
        onSelectTab={(tab) => handleNavigate(tab)}
        isDrawerOpen={mobileDrawerOpen}
        onCloseDrawer={() => setMobileDrawerOpen(false)}
      />

      {/* Floating System Modals & AI Chatbot */}
      <FloatingAiLauncher onClick={() => setShowChatbot(true)} />
      <AgriChatbotModal
        isOpen={showChatbot}
        onClose={() => {
          setShowChatbot(false);
          setChatbotQuery('');
        }}
        onNavigate={handleNavigate}
        initialQuery={chatbotQuery}
      />
      <Phase2Modal />
      <OnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
      <ToastContainer />
    </div>
  );
};
