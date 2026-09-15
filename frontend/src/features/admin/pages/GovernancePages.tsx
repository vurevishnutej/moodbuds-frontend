import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AdminModuleBar, AdminBody, AdminToggle, AdminDemoNote } from '../components/AdminUI';
import { ADMIN_USERS, ADMIN_ROLES, ADMIN_PERMISSIONS } from '../../../data/admin';
import { useToast } from '../../../app/providers/ToastProvider';
import { adminQuizService, type AdminSummary } from '../services/adminQuizService';
import { siteContentService, type AdminSiteContent, type SiteContentDraft } from '../../content/services/siteContentService';
import { ApiError } from '../../../services/api/apiClient';

const EMPTY_CONTENT: SiteContentDraft = {
  about: { title: '', headline: '', story: '', mission: '' },
  contact: { title: '', intro: '', supportEmail: '', supportPhone: '', supportHours: '', registeredAddress: '' },
};

function contentError(error: unknown): string {
  if (!(error instanceof Error)) return 'The content desk hit an unexpected snag. Please retry.';
  try {
    const body = JSON.parse(error.message) as { detail?: string; message?: string };
    return body.detail || body.message || 'The content desk could not complete that request.';
  } catch { return error.message || 'The content desk could not complete that request.'; }
}

export function AboutContactPage() {
  const toast = useToast();
  const [admin, setAdmin] = useState<AdminSummary | null>(() => adminQuizService.currentAdmin());
  const [saved, setSaved] = useState<AdminSiteContent | null>(null);
  const [draft, setDraft] = useState<SiteContentDraft>(EMPTY_CONTENT);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const value = await siteContentService.admin();
      setSaved(value);
      setDraft({
        about: { title: value.about.title, headline: value.about.headline, story: value.about.story, mission: value.about.mission },
        contact: { title: value.contact.title, intro: value.contact.intro, supportEmail: value.contact.supportEmail,
          supportPhone: value.contact.supportPhone, supportHours: value.contact.supportHours, registeredAddress: value.contact.registeredAddress },
      });
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) {
        adminQuizService.logout(); setAdmin(null); setError('Your admin session expired. Sign in again to continue.');
      } else setError(contentError(cause));
    }
    finally { setLoading(false); }
  };

  useEffect(() => { if (admin) void load(); }, [admin]);

  const save = async (event: FormEvent) => {
    event.preventDefault(); setSaving(true); setError('');
    try {
      const value = await siteContentService.update(draft);
      setSaved(value);
      toast.success('About and Contact pages are live ✦');
    } catch (cause) { setError(contentError(cause)); }
    finally { setSaving(false); }
  };

  if (!admin) return <>
    <AdminModuleBar title="About & Contact" sub="Edit public storefront information" />
    <AdminBody><div className="adm-card qadm-login-card"><div className="adm-card-body">
      <div className="qadm-login-copy"><div className="qadm-lock">✎</div><div><span className="qadm-eyebrow">Restricted workspace</span><h2>Admin access</h2><p>Sign in to publish About and Contact page content.</p></div></div>
      <form className="qadm-login-form" onSubmit={async (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); setLoading(true); setError(''); try { setAdmin(await adminQuizService.login(String(form.get('username')), String(form.get('password')))); } catch (cause) { setError(contentError(cause)); } finally { setLoading(false); } }}>
        <label className="adm-field"><span>Username</span><input name="username" autoComplete="username" required /></label>
        <label className="adm-field"><span>Password</span><input name="password" type="password" autoComplete="current-password" required /></label>
        {error && <div className="qadm-error">{error}</div>}
        <button className="adm-btn primary" disabled={loading}>{loading ? 'Opening content desk…' : 'Open content desk'}</button>
      </form>
    </div></div></AdminBody>
  </>;

  return (
    <>
      <AdminModuleBar
        title="About & Contact"
        sub="Edit the public pages linked from the storefront footer"
        actions={<div className="acadm-actions"><Link className="adm-btn ghost sm" to="/about-us" target="_blank">Preview About</Link><Link className="adm-btn ghost sm" to="/contact-us" target="_blank">Preview Contact</Link></div>}
      />
      <AdminBody>
        {loading && !saved ? <div className="badm-loading">Opening the content desk…</div> : <form onSubmit={(event) => void save(event)}>
        <div className="adm-cols acadm-cols">
          <div className="adm-card">
            <div className="adm-card-head"><span className="adm-card-title">About MoodBuds</span></div>
            <div className="adm-card-body">
              <div className="adm-field"><label>Page title *</label><input value={draft.about.title} maxLength={160} onChange={(event) => setDraft({ ...draft, about: { ...draft.about, title: event.target.value } })} required /></div>
              <div className="adm-field"><label>Headline *</label><input value={draft.about.headline} maxLength={300} onChange={(event) => setDraft({ ...draft, about: { ...draft.about, headline: event.target.value } })} required /></div>
              <div className="adm-field"><label>Story *</label><textarea className="acadm-long" value={draft.about.story} maxLength={10000} onChange={(event) => setDraft({ ...draft, about: { ...draft.about, story: event.target.value } })} required /></div>
              <div className="adm-field"><label>Mission *</label><textarea className="acadm-long" value={draft.about.mission} maxLength={10000} onChange={(event) => setDraft({ ...draft, about: { ...draft.about, mission: event.target.value } })} required /></div>
            </div>
          </div>
          <div className="adm-card">
            <div className="adm-card-head"><span className="adm-card-title">Contact details</span></div>
            <div className="adm-card-body">
              <div className="adm-field"><label>Page title *</label><input value={draft.contact.title} maxLength={160} onChange={(event) => setDraft({ ...draft, contact: { ...draft.contact, title: event.target.value } })} required /></div>
              <div className="adm-field"><label>Introduction *</label><textarea value={draft.contact.intro} maxLength={500} onChange={(event) => setDraft({ ...draft, contact: { ...draft.contact, intro: event.target.value } })} required /></div>
              <div className="adm-field"><label>Support email *</label><input type="email" value={draft.contact.supportEmail} maxLength={254} onChange={(event) => setDraft({ ...draft, contact: { ...draft.contact, supportEmail: event.target.value } })} required /></div>
              <div className="adm-field"><label>Phone *</label><input value={draft.contact.supportPhone} maxLength={60} onChange={(event) => setDraft({ ...draft, contact: { ...draft.contact, supportPhone: event.target.value } })} required /></div>
              <div className="adm-field"><label>Hours *</label><input value={draft.contact.supportHours} maxLength={200} onChange={(event) => setDraft({ ...draft, contact: { ...draft.contact, supportHours: event.target.value } })} required /></div>
              <div className="adm-field"><label>Registered address *</label><textarea value={draft.contact.registeredAddress} maxLength={2000} onChange={(event) => setDraft({ ...draft, contact: { ...draft.contact, registeredAddress: event.target.value } })} required /></div>
            </div>
          </div>
        </div>
        {error && <div className="qadm-error acadm-error" role="alert">{error}</div>}
        <div className="acadm-savebar"><span>{saved ? `Last published ${new Date(saved.updatedAt).toLocaleString()}${saved.updatedBy ? ` by ${saved.updatedBy}` : ''}` : 'Complete both sections to publish.'}</span><button type="submit" className="adm-btn primary" disabled={saving || loading}>{saving ? 'Publishing…' : 'Save & publish'}</button></div>
        </form>}
      </AdminBody>
    </>
  );
}

const SOCIAL = [
  ['Instagram', '@moodbuds', '🟣'],
  ['Facebook', '/moodbuds', '🔵'],
  ['Twitter / X', '@moodbuds', '⚫'],
  ['YouTube', 'MoodBuds', '🔴'],
  ['Pinterest', 'moodbuds', '🟥'],
  ['LinkedIn', 'moodbuds', '🔷'],
];

export function SocialLinksPage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(SOCIAL.map(([name]) => [name, name !== 'LinkedIn']))
  );
  const toast = useToast();

  return (
    <>
      <AdminModuleBar
        title="Social Links"
        sub="Connect your storefront to social"
        actions={<button type="button" className="adm-btn primary" onClick={() => toast.success('Links saved ✦')}>Save changes</button>}
      />
      <AdminBody>
        <div className="adm-card">
          <div className="adm-card-head"><span className="adm-card-title">Social profiles</span></div>
          <div className="adm-card-body">
            {SOCIAL.map(([name, handle, icon]) => (
              <div className="adm-field" key={name}>
                <label>{icon} {name}</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input style={{ flex: 1 }} defaultValue={handle} />
                  <AdminToggle on={enabled[name]} onToggle={() => setEnabled((prev) => ({ ...prev, [name]: !prev[name] }))} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <AdminDemoNote />
      </AdminBody>
    </>
  );
}

export function AdminAccountsPage() {
  return (
    <>
      <AdminModuleBar title="Admin Accounts & Security" sub="Manage admin users and security" actions={<button type="button" className="adm-btn primary">+ Invite admin</button>} />
      <AdminBody>
        <div className="adm-card">
          <div className="adm-card-head"><span className="adm-card-title">Admin users</span></div>
          <table className="adm-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Last active</th><th>2FA</th><th>Actions</th></tr></thead>
            <tbody>
              {ADMIN_USERS.map((u) => (
                <tr key={u.email}>
                  <td className="adm-prod-name">{u.name}</td>
                  <td className="adm-muted">{u.email}</td>
                  <td><span className={`adm-badge ${u.role === 'Super Admin' ? 'rose' : 'blue'} plain`}>{u.role}</span></td>
                  <td className="adm-muted">{u.lastActive}</td>
                  <td><AdminToggle on={u.twoFA} /></td>
                  <td>
                    <div className="adm-row-actions">
                      <button type="button" className="adm-ico-btn">✎</button>
                      <button type="button" className="adm-ico-btn danger">🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="adm-card">
          <div className="adm-card-head"><span className="adm-card-title">Security settings</span></div>
          <div className="adm-card-body">
            <div className="adm-info-row"><span className="k">Require 2FA for all admins</span><span className="v"><AdminToggle on /></span></div>
            <div className="adm-info-row"><span className="k">Auto sign-out after inactivity</span><span className="v">30 minutes</span></div>
            <div className="adm-info-row"><span className="k">Password rotation</span><span className="v">Every 90 days</span></div>
            <div className="adm-info-row"><span className="k">Login alerts</span><span className="v"><AdminToggle on /></span></div>
          </div>
        </div>
        <AdminDemoNote />
      </AdminBody>
    </>
  );
}

export function RolesPermissionsPage() {
  return (
    <>
      <AdminModuleBar title="Roles & Permissions" sub="Control who can do what" actions={<button type="button" className="adm-btn primary">+ New role</button>} />
      <AdminBody>
        <div className="adm-card">
          <div className="adm-card-head">
            <span className="adm-card-title">Permission matrix</span>
            <span className="adm-muted" style={{ fontSize: 12 }}>Tap a cell to toggle</span>
          </div>
          <div className="adm-card-body" style={{ overflowX: 'auto' }}>
            <table className="adm-matrix">
              <thead><tr><th>Module</th>{ADMIN_ROLES.map((r) => <th key={r}>{r}</th>)}</tr></thead>
              <tbody>
                {ADMIN_PERMISSIONS.map((p) => (
                  <tr key={p.module}>
                    <td>{p.module}</td>
                    {p.grants.map((g, i) => (
                      <td key={i}><span className={`adm-check${g ? ' on' : ''}`}>{g ? '✓' : ''}</span></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <AdminDemoNote />
      </AdminBody>
    </>
  );
}
