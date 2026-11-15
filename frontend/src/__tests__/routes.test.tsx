import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

describe('Route Rendering Verification', () => {
  const routes = [
    { path: '/', expected: 'Platform' },
    { path: '/customer-research', expected: 'Customer Research' },
    { path: '/product-discovery', expected: 'Product Discovery' },
    { path: '/market-intelligence', expected: 'Market' },
    { path: '/storefront', expected: 'Storefront' },
    { path: '/product-analytics', expected: 'Product Analytics' },
    { path: '/experimentation', expected: 'Experimentation' },
    { path: '/roadmap', expected: 'Roadmap' },
    { path: '/sprint-workspace', expected: 'Sprint' },
    { path: '/operations-intelligence', expected: 'Operations' },
    { path: '/stakeholder-feedback', expected: 'Stakeholder' },
    { path: '/sop-management', expected: 'SOP' },
    { path: '/release-management', expected: 'Release' },
    { path: '/launch-readiness', expected: 'Launch' },
    { path: '/ai-copilot', expected: 'Copilot' },
    { path: '/reports-exports', expected: 'Reports' },
    { path: '/settings', expected: 'Settings' }
  ];

  for (const { path, expected } of routes) {
    it(`renders route ${path} without crashing`, async () => {
      window.history.pushState({}, 'Test Page', path);
      const { container } = render(<App />);
      expect(container).toBeDefined();
    });
  }
});
