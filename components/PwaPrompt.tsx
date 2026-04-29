import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';

declare global {
    interface Window {
        deferredPrompt: any;
    }
}

const IOS_DISMISS_KEY = 'ios-install-dismissed';

export const PwaPrompt: React.FC = () => {
    const [installable, setInstallable] = useState(false);
    const [showIosInstallMessage, setShowIosInstallMessage] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            window.deferredPrompt = e;
            setInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        const isIos = () => /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);
        const wasDismissed = () => {
            try { return window.localStorage.getItem(IOS_DISMISS_KEY) === 'true'; } catch { return false; }
        };

        if (isIos() && !isInStandaloneMode() && !wasDismissed()) {
            setShowIosInstallMessage(true);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleDismissIos = () => {
        try { window.localStorage.setItem(IOS_DISMISS_KEY, 'true'); } catch {}
        setShowIosInstallMessage(false);
    };

    const handleInstallClick = () => {
        if (!window.deferredPrompt) return;
        window.deferredPrompt.prompt();
        window.deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            window.deferredPrompt = null;
            setInstallable(false);
        });
    };

    if (showIosInstallMessage) {
        return (
            <div className="fixed bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur-sm text-center text-sm p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] border-t border-slate-700 print:hidden">
                <button
                    onClick={handleDismissIos}
                    className="absolute top-2 right-3 text-slate-400 hover:text-white p-1"
                    aria-label="Cerrar mensaje de instalación"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
                <p className="text-slate-200">
                    Para instalar la app, toca el ícono de Compartir
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mx-1 -mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
                     y luego "Añadir a pantalla de inicio".
                </p>
            </div>
        );
    }

    if (installable) {
        return (
             <div className="fixed bottom-0 left-0 right-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] flex justify-center print:hidden">
                <Button onClick={handleInstallClick}>
                    Instalar Aplicación
                </Button>
            </div>
        );
    }

    return null;
};
