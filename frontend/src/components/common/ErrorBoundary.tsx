import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ThreadIQ ErrorBoundary]', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-xl mx-auto my-12 bg-white rounded-2xl border border-rose-200 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-100 shadow-sm">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {this.props.fallbackTitle || 'Something went wrong in this module'}
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            {this.state.error?.message || 'An unexpected rendering error occurred. The application remains operational.'}
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reload Page
            </button>
            <a
              href="/"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <Home className="w-3.5 h-3.5" />
              Return to Overview
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
