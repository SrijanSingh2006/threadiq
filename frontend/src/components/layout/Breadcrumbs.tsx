import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNameMap: Record<string, string> = {
  '': 'Overview',
  'customer-research': 'Customer Research',
  'product-discovery': 'Product Discovery',
  'market-intelligence': 'Market Intelligence',
  'storefront': 'Storefront Prototype',
  'product-analytics': 'Product Analytics',
  'experimentation': 'Experimentation Lab',
  'roadmap': 'Product Roadmap',
  'sprint-workspace': 'Sprint Workspace',
  'operations-intelligence': 'Operations Intelligence',
  'stakeholder-feedback': 'Stakeholder Feedback',
  'sop-management': 'SOP Management',
  'release-management': 'Release Management',
  'launch-readiness': 'Launch Readiness',
  'ai-copilot': 'AI Product Copilot',
  'reports-exports': 'Reports & Exports',
  'settings': 'Settings'
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex items-center space-x-1.5 text-xs text-slate-500 mb-4 select-none">
      <Link to="/" className="flex items-center hover:text-slate-900 transition-colors">
        <Home className="w-3.5 h-3.5 mr-1 text-slate-400" />
        <span>Platform</span>
      </Link>
      {pathnames.length === 0 ? (
        <>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="font-semibold text-slate-900">Overview</span>
        </>
      ) : (
        pathnames.map((segment, index) => {
          const isLast = index === pathnames.length - 1;
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const displayName = routeNameMap[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

          return (
            <React.Fragment key={routeTo}>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              {isLast ? (
                <span className="font-semibold text-slate-900">{displayName}</span>
              ) : (
                <Link to={routeTo} className="hover:text-slate-900 transition-colors">
                  {displayName}
                </Link>
              )}
            </React.Fragment>
          );
        })
      )}
    </nav>
  );
};
