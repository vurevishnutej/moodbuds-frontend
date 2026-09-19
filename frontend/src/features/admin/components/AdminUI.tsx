import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export function AdminStatCard({ label, value, delta, dir, icon }: { label: string; value: string | number; delta?: string; dir?: 'up' | 'down' | 'flat'; icon?: string }) {
  return (
    <div className="adm-stat">
      {icon && <div className="adm-stat-ico">{icon}</div>}
      <div className="adm-stat-label">{label}</div>
      <div className="adm-stat-value">{value}</div>
      {delta && (
        <div className={`adm-stat-delta ${dir ?? 'flat'}`}>
          {dir === 'up' ? '▲' : dir === 'down' ? '▼' : '•'} {delta}
        </div>
      )}
    </div>
  );
}

export function AdminStats({ items }: { items: { label: string; value: string | number; delta?: string; dir?: 'up' | 'down' | 'flat'; icon?: string }[] }) {
  return (
    <div className="adm-stats">
      {items.map((s) => (
        <AdminStatCard key={s.label} {...s} />
      ))}
    </div>
  );
}

const BADGE_COLOR: Record<string, string> = {
  Active: 'green', 'Out of stock': 'red', 'Low stock': 'amber', New: 'blue', Processing: 'amber',
  Shipped: 'blue', Delivered: 'green', Cancelled: 'red', Paid: 'green', COD: 'gray', Refunded: 'red',
  Pending: 'amber', Approved: 'green', Rejected: 'red', Scheduled: 'blue', Draft: 'gray', Expired: 'red',
};

export function AdminBadge({ status }: { status: string }) {
  return <span className={`adm-badge ${BADGE_COLOR[status] ?? 'gray'}`}>{status}</span>;
}

export function AdminMoodBadge({ name, color }: { name: string; color: string }) {
  return (
    <span className="adm-mood-badge">
      <span className="adm-mood-dot" style={{ background: color }} />
      {name}
    </span>
  );
}

export function AdminToggle({ on, onToggle }: { on: boolean; onToggle?: () => void }) {
  return <button type="button" className={`adm-toggle${on ? ' on' : ''}`} onClick={onToggle} />;
}

export function AdminModuleBar({ title, sub, actions }: { title: string; sub: string; actions?: ReactNode }) {
  const navigate = useNavigate();
  return (
    <div className="adm-modbar">
      <button type="button" className="adm-back" onClick={() => navigate('/profile/admin')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Admin
      </button>
      <div className="adm-modbar-titles">
        <div className="adm-modbar-title">{title}</div>
        <div className="adm-modbar-sub">{sub}</div>
      </div>
      <div className="adm-modbar-actions">{actions}</div>
    </div>
  );
}

export function AdminDemoNote() {
  return <div className="adm-demo-note">Demo screen — sample data for design preview</div>;
}

interface AdminTableColumn<T> {
  header: string;
  render: (row: T, index: number) => ReactNode;
}

export function AdminTable<T>({ columns, rows, rowKey }: { columns: AdminTableColumn<T>[]; rows: T[]; rowKey: (row: T) => string }) {
  return (
    <div className="adm-tablewrap">
      <table className="adm-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.header}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={rowKey(row)}>
              {columns.map((c) => (
                <td key={c.header}>{c.render(row, i)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AdminBody({ children }: { children: ReactNode }) {
  return <div className="adm-body">{children}</div>;
}

export function AdminModal({
  title,
  sub,
  onClose,
  children,
  footer,
  width,
}: {
  title: string;
  sub?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="adm-modal-overlay" onMouseDown={onClose}>
      <div
        className="adm-modal"
        style={width ? { maxWidth: width } : undefined}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="adm-modal-head">
          <div>
            <div className="adm-modal-title">{title}</div>
            {sub && <div className="adm-modal-sub">{sub}</div>}
          </div>
          <button type="button" className="adm-modal-x" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="adm-modal-body">{children}</div>
        {footer && <div className="adm-modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

export function AdminConfirmDialog({
  title,
  message,
  confirmLabel = 'Delete',
  danger = true,
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <AdminModal
      title={title}
      onClose={onCancel}
      width={380}
      footer={
        <>
          <button type="button" className="adm-btn ghost sm" onClick={onCancel}>Cancel</button>
          <button type="button" className={`adm-btn sm ${danger ? 'rose' : 'primary'}`} onClick={onConfirm}>{confirmLabel}</button>
        </>
      }
    >
      <p className="adm-modal-msg">{message}</p>
    </AdminModal>
  );
}

export function AdminImagePicker({
  images,
  onAdd,
  onRemove,
  max = 6,
  hint = 'PNG / JPG up to 5MB',
}: {
  images: string[];
  onAdd: (dataUrl: string) => void;
  onRemove: (index: number) => void;
  max?: number;
  hint?: string;
}) {
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') onAdd(reader.result);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div>
      {images.length > 0 && (
        <div className="adm-img-strip">
          {images.map((src, i) => (
            <div className="adm-img-thumb" key={i}>
              <img src={src} alt="" />
              <button type="button" className="adm-img-remove" onClick={() => onRemove(i)} aria-label="Remove image">✕</button>
              {i === 0 && <span className="adm-img-primary">Cover</span>}
            </div>
          ))}
        </div>
      )}
      {images.length < max && (
        <label className="adm-dropzone" style={{ display: 'block', cursor: 'pointer' }}>
          <div className="big">⬆</div>
          Drag images here or <b>browse</b>
          <div style={{ fontSize: 11, marginTop: 6, color: '#bbb' }}>{hint}</div>
          <input
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = '';
            }}
          />
        </label>
      )}
    </div>
  );
}
