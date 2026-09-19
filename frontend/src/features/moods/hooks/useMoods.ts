import { useEffect, useState } from 'react';
import type { Mood } from '../../../types';
import { moodService } from '../services/moodService';

export function useMoods() {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    moodService.getMoods().then((m) => {
      setMoods(m);
      setLoading(false);
    });
  }, []);

  return { moods, loading };
}

export function useMood(id: string | undefined) {
  const [mood, setMood] = useState<Mood | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setMood(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    moodService.getMood(id).then((m) => {
      setMood(m);
      setLoading(false);
    });
  }, [id]);

  return { mood, loading };
}
