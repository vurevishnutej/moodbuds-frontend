import { useState } from 'react';
import { AdminModuleBar, AdminBody, AdminToggle, AdminDemoNote } from '../components/AdminUI';
import { ADMIN_USERS, ADMIN_ROLES, ADMIN_PERMISSIONS } from '../../../data/admin';
import { useToast } from '../../../app/providers/ToastProvider';

export function AboutContactPage() {
  const toast = useToast();
  return (
    <>
      <AdminModuleBar
        title="About & Contact"
        sub="Edit storefront about page & contact info"
        actions={<button type="button" className="adm-btn primary" onClick={() => toast.success('Changes saved ✦')}>Save changes</button>}
      />
      <AdminBody>
        <div className="adm-cols">
          <div className="adm-card">
            <div className="adm-card-head"><span className="adm-card-title">About MoodBuds</span></div>
            <div className="adm-card-body">
              <div className="adm-field"><label>Headline</label><input defaultValue="Fashion that follows your feelings" /></div>
              <div className="adm-field">
                <label>Story</label>
                <textarea defaultValue="MoodBuds began with a simple idea — what you wear should match how you want to feel. Shop by mood, wear what you feel." />
              </div>
              <div className="adm-field">
                <label>Mission</label>
                <textarea defaultValue="To make getting dressed feel less like a chore and more like self-expression." />
              </div>
            </div>
          </div>
          <div className="adm-card">
            <div className="adm-card-head"><span className="adm-card-title">Contact details</span></div>
            <div className="adm-card-body">
              <div className="adm-field"><label>Support email</label><input defaultValue="hello@moodbuds.com" /></div>
              <div className="adm-field"><label>Phone</label><input defaultValue="1800-MOOD-BUD" /></div>
              <div className="adm-field"><label>Hours</label><input defaultValue="Mon–Sat, 9am–8pm IST" /></div>
              <div className="adm-field">
                <label>Registered address</label>
                <textarea defaultValue={'MoodBuds Retail Pvt. Ltd.\n4th Floor, Brigade Road,\nBengaluru 560001'} />
              </div>
            </div>
          </div>
        </div>
        <AdminDemoNote />
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
