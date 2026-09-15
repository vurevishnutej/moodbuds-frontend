import { Outlet, useNavigate } from 'react-router-dom';
import { ADMIN_SECTIONS, ADMIN_MODULE_LABELS } from '../../../data/admin';

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
                onClick={() => navigate(`/profile/admin/${slug}`)}
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
  return (
    <div id="admin-stage">
      <div id="panel-admin">
        <Outlet />
      </div>
    </div>
  );
}
