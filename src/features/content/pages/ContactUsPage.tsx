import { useEffect, useMemo, useState } from 'react';
import { PublicContentLayout } from './PublicContentLayout';
import { siteContentService, type ContactContent } from '../services/siteContentService';

function dialablePhone(value: string): string {
  const keys: Record<string, string> = {
    A: '2', B: '2', C: '2', D: '3', E: '3', F: '3', G: '4', H: '4', I: '4',
    J: '5', K: '5', L: '5', M: '6', N: '6', O: '6', P: '7', Q: '7', R: '7', S: '7',
    T: '8', U: '8', V: '8', W: '9', X: '9', Y: '9', Z: '9',
  };
  return value.toUpperCase().replace(/[A-Z]/g, (letter) => keys[letter]).replace(/[^+\d]/g, '');
}

export function ContactUsPage() {
  const [content, setContent] = useState<ContactContent | null>(null);
  const [error, setError] = useState(false);
  const load = async () => {
    setError(false);
    try { setContent(await siteContentService.contact()); }
    catch { setError(true); }
  };
  useEffect(() => { void load(); }, []);
  const phoneHref = useMemo(() => `tel:${dialablePhone(content?.supportPhone ?? '')}`, [content]);

  return <PublicContentLayout><main className="cms-page">
    {!content && !error && <div className="cms-state"><span className="mb-spinner" />Opening the help desk…</div>}
    {error && <div className="cms-state cms-error"><b>Our help desk is taking a tiny tea break.</b><span>Please try again shortly.</span><button type="button" onClick={() => void load()}>Retry</button></div>}
    {content && <>
      <header className="cms-hero contact"><span className="cms-kicker">Come say hello</span><h1>{content.title}</h1><p>{content.intro}</p></header>
      <section className="cms-contact-grid">
        <a href={`mailto:${content.supportEmail}`}><span className="cms-contact-icon">✉</span><small>Email</small><strong>{content.supportEmail}</strong><p>Send us a note anytime</p></a>
        <a href={phoneHref}><span className="cms-contact-icon">☏</span><small>Phone</small><strong>{content.supportPhone}</strong><p>{content.supportHours}</p></a>
        <article><span className="cms-contact-icon">⌂</span><small>Visit or write</small><strong>Registered office</strong><p className="cms-address">{content.registeredAddress}</p></article>
      </section>
    </>}
  </main></PublicContentLayout>;
}
