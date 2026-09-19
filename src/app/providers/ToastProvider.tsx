import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

type ToastType = 'success' | 'info' | 'error';

interface ToastMessage {
  id: number;
  type: ToastType;
  text: string;
}

interface ToastContextValue {
  success: (text: string) => void;
  info: (text: string) => void;
  error: (text: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const counter = useRef(0);

  const push = useCallback((type: ToastType, text: string) => {
    counter.current += 1;
    const id = counter.current;
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2200);
  }, []);

  const value: ToastContextValue = {
    success: (text) => push('success', text),
    info: (text) => push('info', text),
    error: (text) => push('error', text),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="mb-toast-stack" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`mb-toast mb-toast-${t.type}`}>
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
