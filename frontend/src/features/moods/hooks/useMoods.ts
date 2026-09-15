import { useMoodCatalog } from '../../../app/providers/MoodProvider';

export function useMoods() {
  return useMoodCatalog();
}

export function useMood(id: string | undefined) {
  const catalog = useMoodCatalog();
  return { mood: catalog.findMood(id) ?? null, loading: catalog.loading, error: catalog.error };
}
