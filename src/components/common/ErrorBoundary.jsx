import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a1f0a]">
                    <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-center backdrop-blur-xl">
                        <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
                        <p className="text-gray-400 mb-8 text-sm">
                            The application encountered an unexpected error. Don't worry, your funds are safe.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-4 bg-[#a3e635] text-[#0a1f0a] font-bold rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)]"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
