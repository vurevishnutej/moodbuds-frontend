import { useState } from 'react';
import { AdminModuleBar, AdminBody, AdminBadge, AdminMoodBadge, AdminToggle, AdminDemoNote } from '../components/AdminUI';
import { ADMIN_BANNERS, ADMIN_MOODS, adminThumb } from '../../../data/admin';
import { useToast } from '../../../app/providers/ToastProvider';

export function BannersPage() {
  const [banners, setBanners] = useState(ADMIN_BANNERS);
  const toast = useToast();

  return (
    <>
      <AdminModuleBar
        title="Banners"
        sub="Manage homepage hero slides & banners"
        actions={<button type="button" className="adm-btn primary" onClick={() => toast.info('New banner (demo)')}>+ Add banner</button>}
      />
      <AdminBody>
        <div className="adm-card">
          <div className="adm-card-head">
            <span className="adm-card-title">Homepage banners</span>
            <span className="adm-muted" style={{ fontSize: 12 }}>Drag to reorder slides</span>
          </div>
          <table className="adm-table">
            <thead>
              <tr><th>Banner</th><th>Mood</th><th>Placement</th><th>Status</th><th>Live</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {banners.map((b, i) => {
                const m = ADMIN_MOODS.find((x) => x.id === b.mood)!;
                return (
                  <tr key={b.title}>
                    <td>
                      <div className="adm-prod-cell">
                        <img className="adm-thumb" style={{ width: 64, height: 40 }} src={adminThumb(i)} alt="" />
                        <span className="adm-prod-name">{b.title}</span>
                      </div>
                    </td>
                    <td><AdminMoodBadge name={m.name} color={m.color} /></td>
                    <td className="adm-muted">{b.placement}</td>
                    <td><AdminBadge status={b.status} /></td>
                    <td>
                      <AdminToggle
                        on={b.status === 'Active'}
                        onToggle={() =>
                          setBanners((prev) =>
                            prev.map((x) => (x.title === b.title ? { ...x, status: x.status === 'Active' ? 'Draft' : 'Active' } : x))
                          )
                        }
                      />
                    </td>
                    <td>
                      <div className="adm-row-actions">
                        <button type="button" className="adm-ico-btn">✎</button>
                        <button type="button" className="adm-ico-btn danger">🗑</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <AdminDemoNote />
      </AdminBody>
    </>
  );
}
