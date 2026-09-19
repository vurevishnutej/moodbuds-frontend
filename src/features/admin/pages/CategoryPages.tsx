import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AdminModuleBar,
  AdminBody,
  AdminBadge,
  AdminToggle,
  AdminModal,
  AdminConfirmDialog,
} from '../components/AdminUI';
import { slugify, type AdminCategory, type AdminSubcategory } from '../../../data/admin';
import { catalogAdminApi } from '../services/catalogAdminApi';
import { useToast } from '../../../app/providers/ToastProvider';

/* ────────────────────────────────────────────────────────────
   Categories
   ──────────────────────────────────────────────────────────── */

type CategoryDraft = { name: string; slug: string; status: 'Active' | 'Draft' };

export function CategoriesPage() {
  const [cats, setCats] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<AdminCategory | null>(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    catalogAdminApi
      .listCategories()
      .then(setCats)
      .catch((err) => toast.error(err instanceof Error ? err.message : 'Failed to load categories'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (draft: CategoryDraft) => {
    if (!draft.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await catalogAdminApi.updateCategory(editing.id, draft);
        toast.success('Category updated');
        setEditing(null);
      } else {
        await catalogAdminApi.createCategory(draft);
        toast.success('Category created');
        setCreating(false);
      }
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await catalogAdminApi.deleteCategory(deleting.id);
      setCats((prev) => prev.filter((c) => c.id !== deleting.id));
      toast.success(`"${deleting.name}" deactivated`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const handleToggle = async (c: AdminCategory) => {
    const next = c.status === 'Active' ? 'Draft' : 'Active';
    setCats((prev) => prev.map((x) => (x.id === c.id ? { ...x, status: next } : x)));
    try {
      await catalogAdminApi.setCategoryActive(c.id, next === 'Active');
    } catch (err) {
      setCats((prev) => prev.map((x) => (x.id === c.id ? { ...x, status: c.status } : x)));
      toast.error(err instanceof Error ? err.message : 'Update failed');
    }
  };

  return (
    <>
      <AdminModuleBar
        title="Categories"
        sub="Organise your catalog into top-level categories"
        actions={
          <button type="button" className="adm-btn primary" onClick={() => setCreating(true)}>
            + Add category
          </button>
        }
      />
      <AdminBody>
        {loading ? (
          <div className="adm-muted" style={{ textAlign: 'center', padding: '40px 0' }}>Loading categories…</div>
        ) : (
          <div className="adm-cat-grid">
            {cats.map((c) => (
              <div className="adm-cat-card" key={c.id}>
                <div className="adm-cat-media">
                  <img src={c.image} alt={c.name} loading="lazy" />
                  <div className="adm-cat-status"><AdminBadge status={c.status} /></div>
                  <div className="adm-cat-menu">
                    <button type="button" className="adm-ico-btn" title="Edit" onClick={() => setEditing(c)}>✎</button>
                    <button type="button" className="adm-ico-btn danger" title="Deactivate" onClick={() => setDeleting(c)}>🗑</button>
                  </div>
                </div>
                <div className="adm-cat-body">
                  <div className="adm-cat-name">{c.name}</div>
                  <div className="adm-cat-slug">/{c.slug}</div>
                  <div className="adm-cat-meta">
                    <div className="adm-cat-meta-item"><b>{c.products}</b>Products</div>
                    <div className="adm-cat-meta-item"><b>{c.subcategoryCount}</b>Subcategories</div>
                  </div>
                  <div className="adm-cat-foot">
                    <AdminToggle on={c.status === 'Active'} onToggle={() => handleToggle(c)} />
                    <button
                      type="button"
                      className="adm-cat-link"
                      onClick={() => navigate('/admin/subcategories', { state: { parentId: c.id } })}
                    >
                      View subcategories →
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className="adm-cat-add" onClick={() => setCreating(true)}>
              <span className="big">＋</span>
              Add a new category
            </button>
          </div>
        )}
      </AdminBody>

      {(creating || editing) && (
        <CategoryFormModal
          initial={editing ?? undefined}
          saving={saving}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSave={handleSave}
        />
      )}

      {deleting && (
        <AdminConfirmDialog
          title="Deactivate category"
          message={`Deactivate "${deleting.name}"? It will be hidden from the storefront and its ${deleting.subcategoryCount} subcategories will need reassigning. You can reactivate it later.`}
          confirmLabel="Deactivate"
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
function CategoryFormModal({
  initial,
  saving,
  onClose,
  onSave,
}: {
  initial?: AdminCategory;
  saving: boolean;
  onClose: () => void;
  onSave: (draft: CategoryDraft) => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(!!initial);
  const [status, setStatus] = useState<'Active' | 'Draft'>(initial?.status ?? 'Active');

  return (
    <AdminModal
      title={initial ? 'Edit category' : 'Add category'}
      sub={initial ? `Editing "${initial.name}"` : 'Create a new top-level category'}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="adm-btn ghost sm" onClick={onClose}>Cancel</button>
          <button
            type="button"
            className="adm-btn primary sm"
            disabled={saving}
            onClick={() => onSave({ name, slug: slug || slugify(name), status })}
          >
            {saving ? 'Saving…' : initial ? 'Save changes' : 'Create category'}
          </button>
        </>
      }
    >
      <div className="adm-field">
        <label>Category name</label>
        <input
          placeholder="e.g. Men, Women, Kids"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
        />
      </div>
      <div className="adm-field">
        <label>URL slug</label>
        <input
          placeholder="men"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(slugify(e.target.value));
          }}
        />
        <div className="adm-field-hint">moodbuds.com/category/{slug || 'category-slug'}</div>
      </div>
      <div className="adm-field">
        <label>Status</label>
        <div className="adm-chips">
          {(['Active', 'Draft'] as const).map((s) => (
            <button
              key={s}
              type="button"
              className={`adm-chip${status === s ? ' on' : ''}`}
              onClick={() => setStatus(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </AdminModal>
  );
}

/* ────────────────────────────────────────────────────────────
   Subcategories
   ──────────────────────────────────────────────────────────── */

type SubcategoryDraft = { name: string; slug: string; status: 'Active' | 'Draft'; parentId: string };

export function SubcategoriesPage() {
  const location = useLocation();
  const initialParent = (location.state as { parentId?: string } | null)?.parentId;
  const [cats, setCats] = useState<AdminCategory[]>([]);
  const [subs, setSubs] = useState<AdminSubcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [parentFilter, setParentFilter] = useState(initialParent ?? 'all');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<AdminSubcategory | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<AdminSubcategory | null>(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const load = () => {
    setLoading(true);
    catalogAdminApi
      .listSubcategories()
      .then(({ subs, categories }) => {
        setSubs(subs);
        setCats(categories);
      })
      .catch((err) => toast.error(err instanceof Error ? err.message : 'Failed to load subcategories'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(
    () =>
      subs.filter((s) => {
        const matchesParent = parentFilter === 'all' || s.parentId === parentFilter;
        const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
        return matchesParent && matchesSearch;
      }),
    [subs, parentFilter, search]
  );

  const handleSave = async (draft: SubcategoryDraft) => {
    if (!draft.name.trim()) {
      toast.error('Subcategory name is required');
      return;
    }
    if (!draft.parentId) {
      toast.error('Please choose a parent category');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await catalogAdminApi.updateSubcategory(editing.id, draft);
        toast.success('Subcategory updated');
        setEditing(null);
      } else {
        await catalogAdminApi.createSubcategory(draft);
        toast.success('Subcategory created');
        setCreating(false);
      }
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await catalogAdminApi.deleteSubcategory(deleting.id);
      setSubs((prev) => prev.filter((s) => s.id !== deleting.id));
      toast.success(`"${deleting.name}" deactivated`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <AdminModuleBar
        title="Subcategories"
        sub="Fine-grained catalog grouping within each category"
        actions={
          <button type="button" className="adm-btn primary" onClick={() => setCreating(true)}>
            + Add subcategory
          </button>
        }
      />
      <AdminBody>
        <div className="adm-toolbar">
          <div className="adm-srch">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3-3" /></svg>
            <input placeholder="Search subcategories…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="adm-select" value={parentFilter} onChange={(e) => setParentFilter(e.target.value)}>
            <option value="all">All parent categories</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        {loading ? (
          <div className="adm-muted" style={{ textAlign: 'center', padding: '40px 0' }}>Loading subcategories…</div>
        ) : (
          <div className="adm-tablewrap">
            <table className="adm-table">
              <thead>
                <tr><th>Subcategory</th><th>Parent</th><th>Products</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="adm-prod-cell">
                        <img className="adm-thumb" style={{ height: 42, width: 42, borderRadius: 8 }} src={s.image} alt="" />
                        <div>
                          <div className="adm-prod-name">{s.name}</div>
                          <div className="adm-prod-sku">/{s.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td>{s.parent}</td>
                    <td>{s.products}</td>
                    <td><AdminBadge status={s.status} /></td>
                    <td>
                      <div className="adm-row-actions">
                        <button type="button" className="adm-ico-btn" title="Edit" onClick={() => setEditing(s)}>✎</button>
                        <button type="button" className="adm-ico-btn danger" title="Deactivate" onClick={() => setDeleting(s)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="adm-muted" style={{ textAlign: 'center', padding: '28px 0' }}>No subcategories match your filters</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </AdminBody>

      {(creating || editing) && (
        <SubcategoryFormModal
          categories={cats}
          initial={editing ?? undefined}
          saving={saving}
          defaultParentId={parentFilter !== 'all' ? parentFilter : undefined}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSave={handleSave}
        />
      )}

      {deleting && (
        <AdminConfirmDialog
          title="Deactivate subcategory"
          message={`Deactivate "${deleting.name}" from ${deleting.parent}? ${deleting.products} linked products will need reassigning. You can reactivate it later.`}
          confirmLabel="Deactivate"
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}

function SubcategoryFormModal({
  categories,
  initial,
  saving,
  defaultParentId,
  onClose,
  onSave,
}: {
  categories: AdminCategory[];
  initial?: AdminSubcategory;
  saving: boolean;
  defaultParentId?: string;
  onClose: () => void;
  onSave: (draft: SubcategoryDraft) => void;
}) {
  const [parentId, setParentId] = useState(initial?.parentId ?? defaultParentId ?? categories[0]?.id ?? '');
  const [name, setName] = useState(initial?.name ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(!!initial);
  const [status, setStatus] = useState<'Active' | 'Draft'>(initial?.status ?? 'Active');

  return (
    <AdminModal
      title={initial ? 'Edit subcategory' : 'Add subcategory'}
      sub={initial ? `Editing "${initial.name}"` : 'Create a subcategory under a parent category'}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="adm-btn ghost sm" onClick={onClose}>Cancel</button>
          <button
            type="button"
            className="adm-btn primary sm"
            disabled={saving}
            onClick={() => onSave({ name, slug: slug || slugify(name), status, parentId })}
          >
            {saving ? 'Saving…' : initial ? 'Save changes' : 'Create subcategory'}
          </button>
        </>
      }
    >
      <div className="adm-field">
        <label>Parent category</label>
        <select value={parentId} onChange={(e) => setParentId(e.target.value)}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="adm-field">
        <label>Subcategory name</label>
        <input
          placeholder="e.g. Jeans, T-Shirts"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
        />
      </div>
      <div className="adm-field">
        <label>URL slug</label>
        <input
          placeholder="jeans"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(slugify(e.target.value));
          }}
        />
        <div className="adm-field-hint">
          moodbuds.com/category/{categories.find((c) => c.id === parentId)?.slug ?? '…'}/{slug || 'subcategory-slug'}
        </div>
      </div>
      <div className="adm-field">
        <label>Status</label>
        <div className="adm-chips">
          {(['Active', 'Draft'] as const).map((s) => (
            <button
              key={s}
              type="button"
              className={`adm-chip${status === s ? ' on' : ''}`}
              onClick={() => setStatus(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </AdminModal>
  );
}
