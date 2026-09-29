import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Keystatic } from '@keystatic/core/ui';
import keystaticConfig from '../keystatic.config';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in KeystaticAdmin:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      const errorStr = this.state.error?.toString() || '';
      const isRateLimit = errorStr.includes('RATE_LIMIT') || errorStr.includes('rate_limit') || errorStr.includes('graphql_rate_limit');

      if (isRateLimit) {
        return (
          <div className="p-8 bg-amber-50 text-amber-950 min-h-screen flex items-center justify-center font-sans">
            <div className="max-w-xl bg-white border border-amber-200 rounded-2xl p-8 shadow-xl">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 mb-4">
                GitHub API Rate Limit
              </div>
              <h1 className="text-2xl font-bold font-serif text-brand-900 mb-3">
                Limite de requêtes GitHub atteinte
              </h1>
              <p className="text-brand-700 text-sm leading-relaxed mb-6">
                GitHub a temporairement limité les requêtes GraphQL pour ce compte (les quotas GitHub se réinitialisent automatiquement toutes les 60 minutes).
                Vous pouvez basculer immédiatement en mode local pour éditer sans aucune limite de requêtes, ou patienter.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    window.location.href = '/keystatic?storage=local';
                  }}
                  className="px-5 py-2.5 bg-accent-soft hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-sm"
                >
                  Basculer en mode local
                </button>
                <button
                  onClick={() => {
                    window.location.href = '/';
                  }}
                  className="px-5 py-2.5 bg-brand-100 hover:bg-brand-200 text-brand-900 text-xs font-bold uppercase tracking-wider rounded-xl transition"
                >
                  Retour au site
                </button>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="p-8 bg-red-50 text-red-900 min-h-screen font-mono">
          <h1 className="text-2xl font-bold mb-4">Keystatic Admin Error Boundary</h1>
          <p className="mb-4 text-red-700 font-semibold">
            {this.state.error?.toString() || "An unexpected error occurred during rendering."}
          </p>
          {this.state.error?.stack && (
            <pre className="p-4 bg-red-100 border border-red-200 rounded overflow-auto max-h-96 text-xs whitespace-pre-wrap">
              {this.state.error.stack}
            </pre>
          )}
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => window.location.href = '/keystatic?storage=local'}
              className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition"
            >
              Essayer en mode local
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const KeystaticAdmin: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="w-full h-screen bg-white">
        <Keystatic config={keystaticConfig} />
      </div>
    </ErrorBoundary>
  );
};

