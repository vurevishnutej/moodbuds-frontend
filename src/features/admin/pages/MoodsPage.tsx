import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AdminModuleBar, AdminStats, AdminBody, AdminToggle } from '../components/AdminUI';
import { useToast } from '../../../app/providers/ToastProvider';
import { adminQuizService, type AdminSummary } from '../services/adminQuizService';
import { adminMoodService, type AdminMood, type CreateMoodInput } from '../services/adminMoodService';
import { moodBannerUrl } from '../../moods/utils/moodBanner';

const EMPTY_MOOD: CreateMoodInput = {
  name: '', slug: '', emoji: '✦', tagline: '', personalityTagline: '',
  color: '#6B7280', displayOrder: 1, active: true,
};

function readableError(error: unknown): string {
  if (!(error instanceof Error)) return 'The mood desk hit an unexpected snag. Please try again.';
  try {
    const body = JSON.parse(error.message) as { detail?: string };
    return body.detail || 'The mood desk could not complete that request.';
  } catch {
    return error.message || 'The mood desk could not complete that request.';
  }
}

export function MoodsPage() {
  const toast = useToast();
  const [admin, setAdmin] = useState<AdminSummary | null>(() => adminQuizService.currentAdmin());
  const [moods, setMoods] = useState<AdminMood[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<AdminMood | 'new' | null>(null);
  const [draft, setDraft] = useState<CreateMoodInput>(EMPTY_MOOD);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try { setMoods(await adminMoodService.list()); }
    catch (cause) { setError(readableError(cause)); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (admin) void load(); }, [admin]);

  const visible = useMemo(() => moods.filter((mood) => {
    const matchesFilter = filter === 'all' || (filter === 'active' ? mood.active : !mood.active);
    return matchesFilter && `${mood.name} ${mood.slug}`.toLowerCase().includes(query.trim().toLowerCase());
  }), [moods, filter, query]);

  const openNew = () => {
    setEditing('new');
    setDraft({ ...EMPTY_MOOD, displayOrder: Math.max(0, ...moods.map((mood) => mood.displayOrder)) + 1 });
    setError('');
  };

  const openEdit = (mood: AdminMood) => {
    setEditing(mood);
    setDraft({
      name: mood.name, emoji: mood.emoji || '✦', tagline: mood.tagline || '',
      personalityTagline: mood.personalityTagline || '', color: mood.color || '#6B7280',
      displayOrder: mood.displayOrder, active: mood.active,
    });
    setError('');
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const saved = editing === 'new'
        ? await adminMoodService.create({ ...draft, slug: draft.slug?.trim() || undefined })
        : await adminMoodService.update((editing as AdminMood).id, {
          name: draft.name, emoji: draft.emoji, tagline: draft.tagline,
          personalityTagline: draft.personalityTagline, color: draft.color,
          displayOrder: draft.displayOrder,
        });
      setMoods((current) => editing === 'new'
        ? [...current, saved].sort((a, b) => a.displayOrder - b.displayOrder)
        : current.map((mood) => mood.id === saved.id ? saved : mood).sort((a, b) => a.displayOrder - b.displayOrder));
      setEditing(null);
      window.dispatchEvent(new Event('moodbuds:moods-changed'));
      toast.success(editing === 'new' ? `${saved.name} mood created.` : `${saved.name} mood updated.`);
    } catch (cause) { setError(readableError(cause)); }
    finally { setSaving(false); }
  };

  const toggle = async (mood: AdminMood) => {
    const impact = !mood.active
      ? `${mood.name} will return to the storefront.`
      : `${mood.name} will disappear from customer mood tabs and pages. Its ${mood.productCount} product link(s) and ${mood.quizWeightCount} quiz weight(s) will be preserved.`;
    if (!window.confirm(`${impact}\n\nContinue?`)) return;
    try {
      const updated = await adminMoodService.setActive(mood.id, !mood.active);
      setMoods((current) => current.map((item) => item.id === updated.id ? updated : item));
      window.dispatchEvent(new Event('moodbuds:moods-changed'));
      toast.success(`${updated.name} is now ${updated.active ? 'active' : 'inactive'}.`);
    } catch (cause) { setError(readableError(cause)); }
  };

  const logout = () => { adminQuizService.logout(); setAdmin(null); setMoods([]); };

  if (!admin) return (
    <>
      <AdminModuleBar title="Mood Engine" sub="Manage the moods customers can shop" />
      <AdminBody><div className="adm-card qadm-login-card"><div className="adm-card-body">
        <div className="qadm-login-copy"><div className="qadm-lock">✦</div><div><span className="qadm-eyebrow">Restricted workspace</span><h2>SUPER_ADMIN access</h2><p>Sign in to create, edit, activate, or deactivate storefront moods.</p></div></div>
        <form className="qadm-login-form" onSubmit={async (event) => {
          event.preventDefault(); const form = new FormData(event.currentTarget); setLoading(true); setError('');
          try { setAdmin(await adminQuizService.login(String(form.get('username')), String(form.get('password')))); }
          catch (cause) { setError(readableError(cause)); } finally { setLoading(false); }
        }}>
          <label className="adm-field"><span>Username</span><input name="username" autoComplete="username" required /></label>
          <label className="adm-field"><span>Password</span><input name="password" type="password" autoComplete="current-password" required /></label>
          {error && <div className="qadm-error">{error}</div>}
          <button className="adm-btn primary" disabled={loading}>{loading ? 'Opening mood desk…' : 'Open mood desk'}</button>
        </form>
      </div></div></AdminBody>
    </>
  );

  return (
    <>
      <AdminModuleBar title="Mood Engine" sub="Create and control the moods visible across the storefront" actions={<div className="madm-actions"><button type="button" className="adm-btn" onClick={logout}>Sign out</button><button type="button" className="adm-btn primary" onClick={openNew}>+ New mood</button></div>} />
      <AdminBody>
        <AdminStats items={[
          { label: 'Active moods', value: moods.filter((mood) => mood.active).length, icon: '🎭' },
          { label: 'Inactive moods', value: moods.filter((mood) => !mood.active).length, icon: '◌' },
          { label: 'Linked products', value: moods.reduce((sum, mood) => sum + mood.productCount, 0), icon: '🔗' },
          { label: 'Quiz links', value: moods.reduce((sum, mood) => sum + mood.quizWeightCount, 0), icon: '✦' },
        ]} />
        <div className="madm-toolbar">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search moods…" aria-label="Search moods" />
          <div className="madm-filters">{(['all', 'active', 'inactive'] as const).map((item) => <button key={item} type="button" className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div>
        </div>
        {error && !editing && <div className="qadm-error madm-page-error">{error}</div>}
        {loading && moods.length === 0 ? <div className="badm-loading">Gathering the moods…</div> : (
          <div className="adm-mood-grid madm-grid">{visible.map((mood) => (
            <article className={`adm-mood-card madm-card${mood.active ? '' : ' inactive'}`} key={mood.id}>
              <div className="adm-mood-top madm-top" style={{ background: `${mood.color}22` }}>
                {mood.bannerConfigured && <img src={moodBannerUrl(mood.slug)} alt="" />}
                <span>{mood.emoji || '✦'}</span><b>#{mood.displayOrder}</b>
              </div>
              <div className="adm-mood-body">
                <div className="madm-title-row"><div><div className="adm-mood-name">{mood.name}</div><div className="madm-slug">/{mood.slug}</div></div><AdminToggle on={mood.active} onToggle={() => void toggle(mood)} /></div>
                <div className="adm-mood-tag">{mood.tagline || 'No storefront tagline yet'}</div>
                <div className="madm-impact"><span><b>{mood.productCount}</b> products</span><span><b>{mood.quizWeightCount}</b> quiz links</span><span className={mood.bannerConfigured ? 'ready' : ''}>{mood.bannerConfigured ? 'Banner ready' : 'No banner'}</span></div>
                <div className="adm-mood-foot"><span className={`madm-state ${mood.active ? 'active' : ''}`}>{mood.active ? 'Visible' : 'Hidden'}</span><button type="button" className="adm-btn ghost" onClick={() => openEdit(mood)}>Edit mood</button></div>
              </div>
            </article>
          ))}</div>
        )}
        {editing && <div className="madm-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditing(null); }}>
          <form className="madm-modal" onSubmit={(event) => void save(event)}>
            <div className="madm-modal-head"><div><span className="qadm-eyebrow">Mood details</span><h2>{editing === 'new' ? 'Create a new mood' : `Edit ${editing.name}`}</h2></div><button type="button" onClick={() => setEditing(null)} aria-label="Close">×</button></div>
            <div className="madm-form-grid">
              <label className="adm-field"><span>Name *</span><input value={draft.name} maxLength={100} onChange={(e) => setDraft({ ...draft, name: e.target.value })} required /></label>
              <label className="adm-field"><span>Emoji *</span><input value={draft.emoji} maxLength={20} onChange={(e) => setDraft({ ...draft, emoji: e.target.value })} required /></label>
              {editing === 'new' && <label className="adm-field madm-span"><span>Slug <small>Optional — generated from the name</small></span><input value={draft.slug} maxLength={140} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} placeholder="weekend-chill" /></label>}
              <label className="adm-field madm-span"><span>Storefront tagline</span><input value={draft.tagline} maxLength={300} onChange={(e) => setDraft({ ...draft, tagline: e.target.value })} placeholder="Bright & cheerful" /></label>
              <label className="adm-field madm-span"><span>Quiz-result personality line</span><input value={draft.personalityTagline} maxLength={300} onChange={(e) => setDraft({ ...draft, personalityTagline: e.target.value })} placeholder="You radiate positivity" /></label>
              <label className="adm-field"><span>Colour *</span><div className="madm-color"><input type="color" value={draft.color} onChange={(e) => setDraft({ ...draft, color: e.target.value })} /><input value={draft.color} pattern="#[0-9A-Fa-f]{6}" onChange={(e) => setDraft({ ...draft, color: e.target.value })} required /></div></label>
              <label className="adm-field"><span>Display order *</span><input type="number" min="0" max="10000" value={draft.displayOrder} onChange={(e) => setDraft({ ...draft, displayOrder: Number(e.target.value) })} required /></label>
            </div>
            {editing === 'new' && <label className="madm-checkbox"><input type="checkbox" checked={draft.active} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} /> Show this mood on the storefront immediately</label>}
            {editing !== 'new' && <p className="madm-slug-note">Permanent storefront URL: <b>/mood/{editing.slug}</b></p>}
            {error && <div className="qadm-error">{error}</div>}
            <div className="madm-modal-actions"><button type="button" className="adm-btn" onClick={() => setEditing(null)}>Cancel</button><button type="submit" className="adm-btn primary" disabled={saving}>{saving ? 'Saving…' : editing === 'new' ? 'Create mood' : 'Save changes'}</button></div>
            <p className="madm-banner-link">Banner images stay in the dedicated <Link to="../banners">Mood Banners</Link> workspace.</p>
          </form>
        </div>}
      </AdminBody>
    </>
  );
}
