import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import ErrorBoundary from './components/ErrorBoundary';
import Onboarding from './components/Onboarding';
import { trackEvent, AnalyticsEvents } from './utils/analytics';

// Lazy-loaded components
const Generator = lazy(() => import('./components/Generator'));
const MultiChainGenerator = lazy(() => import('./components/MultiChainGenerator'));
const Create2Calculator = lazy(() => import('./components/Create2Calculator'));
const CloakSeedPage = lazy(() => import('./pages/CloakSeedPage'));
const PoisonRadar = lazy(() => import('./components/PoisonRadar'));
const HDWallet = lazy(() => import('./components/HDWallet'));
const Settings = lazy(() => import('./components/Settings'));

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
    </div>
  );
}

function PageWrapper({ children }) {
  return (
    <div className="animate-fadeIn">
      {children}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ErrorBoundary fallbackTitle="Application Error">
        <Onboarding onComplete={() => trackEvent(AnalyticsEvents.ONBOARDING_COMPLETED)} />
        
        <DashboardLayout>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<PageWrapper><Generator /></PageWrapper>} />
              <Route path="/multi-chain" element={<PageWrapper><MultiChainGenerator /></PageWrapper>} />
              <Route path="/create2" element={<PageWrapper><Create2Calculator /></PageWrapper>} />
              <Route path="/cloakseed" element={<PageWrapper><CloakSeedPage /></PageWrapper>} />
              <Route path="/radar" element={<PageWrapper><PoisonRadar /></PageWrapper>} />
              <Route path="/hd-wallet" element={<PageWrapper><HDWallet /></PageWrapper>} />
              <Route path="/settings" element={<PageWrapper><Settings /></PageWrapper>} />
            </Routes>
          </Suspense>
        </DashboardLayout>
      </ErrorBoundary>
    </Router>
  );
}
