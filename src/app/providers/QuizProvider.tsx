import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

interface QuizContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const value = useMemo(
    () => ({ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }),
    [isOpen]
  );
  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuizModal(): QuizContextValue {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error('useQuizModal must be used within QuizProvider');
  return ctx;
}
