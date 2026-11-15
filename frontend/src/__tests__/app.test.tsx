import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useStore } from '../store/useStore';
import { Sidebar } from '../components/layout/Sidebar';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { BrowserRouter } from 'react-router-dom';
import { getProductFallbackImage } from '../utils/imageUtils';
import { api } from '../api/client';

describe('ThreadIQ Frontend Core Architecture', () => {
  beforeEach(() => {
    useStore.getState().clearCart();
  });

  it('renders enterprise navigation with all core modules', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    expect(screen.getByText('THREAD')).toBeInTheDocument();
    expect(screen.getByText('IQ')).toBeInTheDocument();
    expect(screen.getByText('Customer Research')).toBeInTheDocument();
    expect(screen.getByText('Storefront Prototype')).toBeInTheDocument();
    expect(screen.getByText('Product Analytics')).toBeInTheDocument();
    expect(screen.getByText('Experimentation Lab')).toBeInTheDocument();
    expect(screen.getByText('Sprint Workspace')).toBeInTheDocument();
    expect(screen.getByText('Launch Readiness')).toBeInTheDocument();
    expect(screen.getByText('AI Product Copilot')).toBeInTheDocument();
    expect(screen.getByText('Reports & Exports')).toBeInTheDocument();
  });

  it('handles cart additions and first-party state updates', () => {
    const dummyProduct = {
      id: 101,
      name: 'Roadster Pure Cotton Casual Shirt',
      price: 1499,
      category: { name: 'Casual Shirts' }
    };

    useStore.getState().addToCart(dummyProduct, 'M');
    expect(useStore.getState().cart.length).toBe(1);
    expect(useStore.getState().cart[0].product.name).toBe('Roadster Pure Cotton Casual Shirt');
    expect(useStore.getState().cart[0].size).toBe('M');
    expect(useStore.getState().cart[0].quantity).toBe(1);

    // Add again to verify quantity increment
    useStore.getState().addToCart(dummyProduct, 'M');
    expect(useStore.getState().cart.length).toBe(1);
    expect(useStore.getState().cart[0].quantity).toBe(2);

    // Remove from cart
    useStore.getState().removeFromCart(useStore.getState().cart[0].id);
    expect(useStore.getState().cart.length).toBe(0);
  });

  it('supports cross-functional role switching', () => {
    expect(useStore.getState().currentRole).toBe('Product Manager');
    useStore.getState().setRole('Product Analyst');
    expect(useStore.getState().currentRole).toBe('Product Analyst');
    useStore.getState().setRole('UX Researcher');
    expect(useStore.getState().currentRole).toBe('UX Researcher');
  });

  it('renders breadcrumbs cleanly for root view', () => {
    render(
      <BrowserRouter>
        <Breadcrumbs />
      </BrowserRouter>
    );
    expect(screen.getByText('Platform')).toBeInTheDocument();
    expect(screen.getByText('Overview')).toBeInTheDocument();
  });

  it('generates resilient SVG data URIs for product fallback images', () => {
    const dataUri = getProductFallbackImage(
      'Men Relaxed Fit Poplin Casual Shirt',
      'Casual Shirts',
      'Roadster'
    );
    expect(dataUri).toContain('data:image/svg+xml;utf8,');
    const decoded = decodeURIComponent(dataUri.replace('data:image/svg+xml;utf8,', ''));
    expect(decoded).toContain('<svg');
    expect(decoded).toContain('ROADSTER');
    expect(decoded).toContain('Casual Shirts');
    expect(decoded).toContain('MR');
  });

  it('safely provides research data without throwing doctype HTML parsing errors', async () => {
    const painPoints = await api.research.getPainPoints();
    expect(Array.isArray(painPoints)).toBe(true);
    expect(painPoints.length).toBeGreaterThan(0);
    expect(painPoints[0]).toHaveProperty('title');
  });
});
