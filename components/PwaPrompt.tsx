
import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';

// Extend the Window interface to include our deferred prompt
declare global {
    interface Window {
        deferredPrompt: any;
    }
}

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

        // Detect iOS and if not in standalone mode
        const isIos = () => /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

        if (isIos() && !isInStandaloneMode()) {
            setShowIosInstallMessage(true);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = () => {
        if (!window.deferredPrompt) {
            return;
        }
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
                <p className="text-slate-200">
                    Para instalar la app, toca el ícono de Compartir
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mx-1 -mt-1" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>
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
