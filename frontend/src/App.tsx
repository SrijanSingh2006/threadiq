import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { Breadcrumbs } from './components/layout/Breadcrumbs';
import { ToastContainer } from './components/common/ToastContainer';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { CartDrawer } from './components/storefront/CartDrawer';
import { CompareDrawer } from './components/storefront/CompareDrawer';

// 17 Pages
import { Overview } from './pages/Overview';
import { CustomerResearch } from './pages/CustomerResearch';
import { ProductDiscovery } from './pages/ProductDiscovery';
import { MarketIntelligence } from './pages/MarketIntelligence';
import { Storefront } from './pages/Storefront';
import { ProductAnalytics } from './pages/ProductAnalytics';
import { ExperimentationLab } from './pages/ExperimentationLab';
import { ProductRoadmap } from './pages/ProductRoadmap';
import { OperationsIntelligence } from './pages/OperationsIntelligence';
import { StakeholderFeedback } from './pages/StakeholderFeedback';
import { SOPManagement } from './pages/SOPManagement';
import { ReleaseManagement } from './pages/ReleaseManagement';
import { SprintWorkspace } from './pages/SprintWorkspace';
import { LaunchReadiness } from './pages/LaunchReadiness';
import { AICopilot } from './pages/AICopilot';
import { ReportsExports } from './pages/ReportsExports';
import { Settings } from './pages/Settings';

export function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
        {/* Main Collapsible Sidebar */}
        <Sidebar />

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Navigation Bar */}
          <Navbar
            onOpenCart={() => setIsCartOpen(true)}
            onOpenCompare={() => setIsCompareOpen(true)}
          />

          {/* Scrollable Page Body */}
          <main className="flex-1 overflow-y-auto px-6 py-5">
            <Breadcrumbs />
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/customer-research" element={<CustomerResearch />} />
                <Route path="/product-discovery" element={<ProductDiscovery />} />
                <Route path="/market-intelligence" element={<MarketIntelligence />} />
                <Route path="/storefront" element={<Storefront />} />
                <Route path="/product-analytics" element={<ProductAnalytics />} />
                <Route path="/analytics" element={<ProductAnalytics />} />
                <Route path="/experimentation" element={<ExperimentationLab />} />
                <Route path="/experiments" element={<ExperimentationLab />} />
                <Route path="/roadmap" element={<ProductRoadmap />} />
                <Route path="/sprint-workspace" element={<SprintWorkspace />} />
                <Route path="/sprint" element={<SprintWorkspace />} />
                <Route path="/operations-intelligence" element={<OperationsIntelligence />} />
                <Route path="/operations" element={<OperationsIntelligence />} />
                <Route path="/stakeholder-feedback" element={<StakeholderFeedback />} />
                <Route path="/sop-management" element={<SOPManagement />} />
                <Route path="/release-management" element={<ReleaseManagement />} />
                <Route path="/launch-readiness" element={<LaunchReadiness />} />
                <Route path="/ai-copilot" element={<AICopilot />} />
                <Route path="/reports-exports" element={<ReportsExports />} />
                <Route path="/settings" element={<Settings />} />
                {/* Fallback */}
                <Route path="*" element={<Overview />} />
              </Routes>
            </ErrorBoundary>
          </main>
        </div>

        {/* Drawers & Notifications */}
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <CompareDrawer isOpen={isCompareOpen} onClose={() => setIsCompareOpen(false)} />
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}

export default App;
