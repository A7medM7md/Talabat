import { environment } from '@env/environment';

export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80';

export function resolveImageUrl(pictureUrl: string | null | undefined): string {
  if (!pictureUrl) return FALLBACK_IMAGE;
  if (pictureUrl.startsWith('http')) return pictureUrl;
  return `${environment.apiBase}/${pictureUrl.replace(/^\//, '')}`;
}
