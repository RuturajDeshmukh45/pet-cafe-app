import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X, PawPrint } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info', title = '') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const newToast = { id, message, type, title };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container floating at top-right */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4">
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border animate-pop-in transition-all ${
                isSuccess
                  ? 'bg-emerald-50/95 border-emerald-200 text-emerald-900 shadow-emerald-500/10'
                  : isError
                  ? 'bg-rose-50/95 border-rose-200 text-rose-900 shadow-rose-500/10'
                  : 'bg-white/95 border-blue-200 text-slate-800 shadow-blue-500/10'
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {isSuccess ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : isError ? (
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                ) : (
                  <PawPrint className="w-5 h-5 text-[#1e75ff]" />
                )}
              </div>
              <div className="flex-1 text-sm">
                {toast.title && <h5 className="font-bold text-xs uppercase tracking-wider mb-0.5 opacity-80">{toast.title}</h5>}
                <p className="font-medium leading-relaxed">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
