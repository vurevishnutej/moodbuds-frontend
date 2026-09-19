import { useEffect, useState } from 'react';
import { PublicContentLayout } from './PublicContentLayout';
import { siteContentService, type AboutContent } from '../services/siteContentService';

export function AboutUsPage() {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [error, setError] = useState(false);
  const load = async () => {
    setError(false);
    try { setContent(await siteContentService.about()); }
    catch { setError(true); }
  };
  useEffect(() => { void load(); }, []);

  return <PublicContentLayout><main className="cms-page">
    {!content && !error && <div className="cms-state"><span className="mb-spinner" />Preparing our story…</div>}
    {error && <div className="cms-state cms-error"><b>Our story wandered off for a moment.</b><span>Please try again shortly.</span><button type="button" onClick={() => void load()}>Retry</button></div>}
    {content && <>
      <header className="cms-hero"><span className="cms-kicker">The feeling behind the fit</span><h1>{content.title}</h1><p>{content.headline}</p></header>
      <section className="cms-about-grid">
        <article><span>01</span><div><h2>Our story</h2><p>{content.story}</p></div></article>
        <article><span>02</span><div><h2>Our mission</h2><p>{content.mission}</p></div></article>
      </section>
      <div className="cms-signoff">Dress the feeling <i>✦</i></div>
    </>}
  </main></PublicContentLayout>;
}
