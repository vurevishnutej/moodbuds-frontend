import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Mood } from '../../types';
import { moodService } from '../../features/moods/services/moodService';

interface MoodContextValue {
  moods: Mood[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  findMood: (slug: string | undefined) => Mood | undefined;
}

const MoodContext = createContext<MoodContextValue | null>(null);

export function MoodProvider({ children }: { children: ReactNode }) {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setMoods(await moodService.getMoods());
    } catch {
      setError('Our mood wardrobe is taking a tiny breather. Please try again shortly.');
      setMoods([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const reload = () => void refresh();
    window.addEventListener('moodbuds:moods-changed', reload);
    window.addEventListener('focus', reload);
    return () => {
      window.removeEventListener('moodbuds:moods-changed', reload);
      window.removeEventListener('focus', reload);
    };
  }, [refresh]);

  const value = useMemo<MoodContextValue>(() => ({
    moods,
    loading,
    error,
    refresh,
    findMood: (slug) => moods.find((mood) => mood.id === slug),
  }), [moods, loading, error, refresh]);

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
}

export function useMoodCatalog() {
  const value = useContext(MoodContext);
  if (!value) throw new Error('useMoodCatalog must be used within MoodProvider');
  return value;
}
