import type { SyntheticEvent } from 'react';
import type { Mood } from '../../../types';
import { apiUrl } from '../../../services/api/apiClient';

export function moodBannerUrl(slug: string, cacheKey?: string | number): string {
  const url = apiUrl(`/moods/${encodeURIComponent(slug)}/banner`);
  return cacheKey == null ? url : `${url}?updated=${encodeURIComponent(cacheKey)}`;
}

export function moodBannerBackground(mood: Mood): string {
  return mood.image
    ? `url("${mood.image}")`
    : `linear-gradient(135deg, ${mood.accentColor}CC, #171923)`;
}

export function useFallbackMoodImage(event: SyntheticEvent<HTMLImageElement>, fallback: string) {
  const image = event.currentTarget;
  if (image.src !== fallback) image.src = fallback;
}
