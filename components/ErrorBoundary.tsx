import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    handleReload = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
                    <div className="text-center max-w-sm space-y-4">
                        <div className="text-5xl">⚠️</div>
                        <h1 className="text-xl font-bold text-white">Algo salió mal</h1>
                        <p className="text-sm text-slate-400">
                            La aplicación encontró un error inesperado. Toca el botón para recargar.
                        </p>
                        {this.state.error && (
                            <p className="text-xs text-slate-600 font-mono bg-slate-800 p-2 rounded break-all">
                                {this.state.error.message.slice(0, 200)}
                            </p>
                        )}
                        <button
                            onClick={this.handleReload}
                            className="min-h-[44px] px-6 py-2.5 rounded-lg font-semibold bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700 transition-colors"
                        >
                            Recargar App
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
