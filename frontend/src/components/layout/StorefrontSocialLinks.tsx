import { useEffect, useState } from 'react';
import { socialLinkService, type SocialLink } from '../../features/content/services/socialLinkService';

function SocialIcon({ icon }: { icon: string }) {
  if (icon === 'instagram') return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>;
  if (icon === 'facebook') return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v6h4v-6h3l1-4h-4V9c0-.7.3-1 1-1z"/></svg>;
  if (icon === 'x') return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
  if (icon === 'youtube') return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="2" y="5" width="20" height="14" rx="3"/><polygon points="10,9 16,12 10,15" fill="currentColor" stroke="none"/></svg>;
  if (icon === 'pinterest') return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.64 7.86 6.36 9.31-.09-.79-.17-2 .03-2.87.18-.78 1.17-4.97 1.17-4.97s-.3-.6-.3-1.48c0-1.39.81-2.43 1.81-2.43.85 0 1.27.64 1.27 1.41 0 .86-.55 2.14-.83 3.33-.24 1 .5 1.81 1.48 1.81 1.77 0 3.13-1.87 3.13-4.56 0-2.38-1.72-4.05-4.16-4.05-2.84 0-4.5 2.13-4.5 4.33 0 .86.33 1.77.74 2.28a.3.3 0 01.07.28c-.08.31-.24 1-.28 1.13-.04.18-.15.22-.34.13-1.25-.58-2.03-2.41-2.03-3.87 0-3.15 2.29-6.05 6.61-6.05 3.47 0 6.16 2.47 6.16 5.78 0 3.45-2.17 6.22-5.19 6.22-1.01 0-1.97-.53-2.29-1.15l-.62 2.38c-.23.87-.84 1.96-1.24 2.62.94.29 1.93.45 2.96.45C17.52 22 22 17.52 22 12S17.52 2 12 2z"/></svg>;
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3.5A2.5 2.5 0 115 8.5a2.5 2.5 0 010-5zM3 10h4v11H3zm6 0h4v1.7c.9-1.3 2.2-2.1 4.1-2.1 3.1 0 3.9 2 3.9 4.8V21h-4v-5.8c0-1.4 0-3.1-1.9-3.1s-2.2 1.5-2.2 3V21H9z"/></svg>;
}

export function StorefrontSocialLinks({ className, itemClassName }: { className: string; itemClassName?: string }) {
  const [links, setLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    let active = true;
    socialLinkService.public().then((value) => { if (active) setLinks(value); }).catch(() => { if (active) setLinks([]); });
    return () => { active = false; };
  }, []);

  if (links.length === 0) return null;
  return <div className={className}>{links.map((link) => (
    <a key={link.id} className={itemClassName} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.displayName} title={link.displayName}>
      <SocialIcon icon={link.icon} />
    </a>
  ))}</div>;
}
