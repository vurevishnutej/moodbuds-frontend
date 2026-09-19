import type { ReactNode } from 'react';
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
  Active: 'green', 'In stock': 'green', 'Out of stock': 'red', 'Low stock': 'amber', Disabled: 'gray', New: 'blue', Processing: 'amber',
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
      <button type="button" className="adm-back" onClick={() => navigate('/admin')}>
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
