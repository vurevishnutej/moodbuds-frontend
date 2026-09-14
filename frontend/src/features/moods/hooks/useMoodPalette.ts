import { useEffect } from 'react';
import type { MoodId } from '../../../types';
import { MOOD_PALETTE } from '../../../data/moodPalette';

export function useMoodPalette(moodId: MoodId | undefined) {
  useEffect(() => {
    const root = document.documentElement;
    if (!moodId) {
      root.style.background = '';
      return;
    }
    const p = MOOD_PALETTE[moodId];
    if (!p) return;
    root.style.setProperty('--bg', p.bg);
    root.style.setProperty('--surface', p.surface);
    root.style.setProperty('--card', p.card);
    root.style.setProperty('--mood-accent', p.accent);
    root.style.setProperty('--accent', p.accent);
    root.style.setProperty('--img-bg', p.imgBg);
    root.style.setProperty('--line', p.line);
    root.style.setProperty('--search-bg', 'rgba(255,255,255,0.7)');
    root.style.background = p.bg;

    return () => {
      root.style.background = '';
    };
  }, [moodId]);
}
