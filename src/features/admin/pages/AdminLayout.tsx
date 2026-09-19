import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ADMIN_SECTIONS, ADMIN_MODULE_LABELS } from '../../../data/admin';
import { useAdminAuth } from '../../../app/providers/AdminAuthProvider';

export function AdminHub() {
  const navigate = useNavigate();
  return (
    <div className="adm-body" style={{ paddingTop: 8 }}>
      {ADMIN_SECTIONS.map((section) => (
        <div key={section.title}>
          <div className="admin-sec-h">{section.title}</div>
          <div className="admin-grid">
            {section.modules.map((slug) => (
              <button
                key={slug}
                type="button"
                className="admin-card"
                onClick={() => navigate(`/admin/${slug}`)}
              >
                <span className="admin-card-tag">Module</span>
                <span className="admin-card-title">{ADMIN_MODULE_LABELS[slug]}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  return (
    <div id="admin-stage">
      <header className="admin-shell-header">
        <Link to="/" className="admin-shell-logo">Mood<em>Buds</em></Link>
        <Link to="/admin" className="admin-shell-home">Admin Dashboard</Link>
        <div className="admin-shell-account">
          <span>{admin?.fullName} · {admin?.role}</span>
          <button type="button" onClick={() => { logout(); navigate('/admin/login'); }}>Sign out</button>
        </div>
      </header>
      <div id="panel-admin">
        <Outlet />
      </div>
    </div>
  );
}
