import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 pointer-events-none flex items-end justify-start p-6 z-[9999]">
          <div className="bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-red-500/30 shadow-[0_8px_32px_0_rgba(239,68,68,0.2)] rounded-2xl p-5 max-w-lg w-full pointer-events-auto animate-in slide-in-from-bottom-5 fade-in duration-500">
            <div className="flex items-start gap-4">
              <div className="bg-red-500/20 text-red-500 p-3 rounded-full shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1 overflow-hidden">
                <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-1">Oops! Something went wrong.</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">An unexpected error occurred in the application.</p>
                <details className="group">
                  <summary className="cursor-pointer text-sm font-semibold text-orange-500 hover:text-orange-600 select-none outline-none transition-colors">
                    Click to view Error Details
                  </summary>
                  <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-100 dark:border-red-900/50 max-h-48 overflow-y-auto custom-scrollbar">
                    <p className="text-xs font-mono text-red-800 dark:text-red-300 break-words mb-2 font-bold">
                      {this.state.error && this.state.error.toString()}
                    </p>
                    <pre className="text-[10px] font-mono text-red-600 dark:text-red-400/80 whitespace-pre-wrap break-words">
                      {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
