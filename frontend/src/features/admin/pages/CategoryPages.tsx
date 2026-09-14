import { useState } from 'react';
import { AdminModuleBar, AdminBody, AdminBadge, AdminToggle, AdminDemoNote } from '../components/AdminUI';
import { ADMIN_CATEGORIES, ADMIN_SUBCATEGORIES } from '../../../data/admin';
import { useToast } from '../../../app/providers/ToastProvider';

export function CategoriesPage() {
  const [cats, setCats] = useState(ADMIN_CATEGORIES);
  const toast = useToast();

  return (
    <>
      <AdminModuleBar
        title="Categories"
        sub="Organise your catalog structure"
        actions={<button type="button" className="adm-btn primary" onClick={() => toast.info('New category (demo)')}>+ Add category</button>}
      />
      <AdminBody>
        <div className="adm-card">
          <div className="adm-card-head">
            <span className="adm-card-title">Categories ({cats.length})</span>
            <span className="adm-muted" style={{ fontSize: 12 }}>Drag to reorder</span>
          </div>
          <table className="adm-table">
            <thead><tr><th>Category</th><th>Products</th><th>Status</th><th>Visible</th><th>Actions</th></tr></thead>
            <tbody>
              {cats.map((c) => (
                <tr key={c.name}>
                  <td className="adm-prod-name">{c.name}</td>
                  <td>{c.products}</td>
                  <td><AdminBadge status={c.status} /></td>
                  <td>
                    <AdminToggle
                      on={c.status === 'Active'}
                      onToggle={() => setCats((prev) => prev.map((x) => (x.name === c.name ? { ...x, status: x.status === 'Active' ? 'Draft' : 'Active' } : x)))}
                    />
                  </td>
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
        <AdminDemoNote />
      </AdminBody>
    </>
  );
}

export function SubcategoriesPage() {
  const toast = useToast();
  return (
    <>
      <AdminModuleBar
        title="Subcategories"
        sub="Fine-grained catalog grouping"
        actions={<button type="button" className="adm-btn primary" onClick={() => toast.info('New subcategory (demo)')}>+ Add subcategory</button>}
      />
      <AdminBody>
        <div className="adm-toolbar">
          <select className="adm-select">
            <option>All parent categories</option>
            <option>Dresses</option>
            <option>Outerwear</option>
            <option>Footwear</option>
          </select>
        </div>
        <div className="adm-tablewrap">
          <table className="adm-table">
            <thead><tr><th>Parent</th><th>Subcategory</th><th>Products</th><th>Actions</th></tr></thead>
            <tbody>
              {ADMIN_SUBCATEGORIES.map((s) => (
                <tr key={s.parent + s.name}>
                  <td>{s.parent}</td>
                  <td className="adm-prod-name">{s.name}</td>
                  <td>{s.products}</td>
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
        <AdminDemoNote />
      </AdminBody>
    </>
  );
}
