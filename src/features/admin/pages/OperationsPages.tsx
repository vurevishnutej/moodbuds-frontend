import { AdminModuleBar, AdminStats, AdminBody, AdminBadge, AdminDemoNote } from '../components/AdminUI';
import { ADMIN_IMPORT_HISTORY, ADMIN_SHIPPING_QUEUE, ADMIN_TRACKING, ADMIN_RETURNS, ADMIN_REFUNDS } from '../../../data/admin';
import { formatINR } from '../../../utils/format';
import { useToast } from '../../../app/providers/ToastProvider';

export function BulkImportExportPage() {
  const toast = useToast();
  return (
    <>
      <AdminModuleBar
        title="Bulk Import / Export"
        sub="Move your catalog in and out via CSV"
        actions={<button type="button" className="adm-btn ghost">⬇ Download template</button>}
      />
      <AdminBody>
        <div className="adm-cols">
          <div>
            <div className="adm-card">
              <div className="adm-card-head"><span className="adm-card-title">Import products</span></div>
              <div className="adm-card-body">
                <div className="adm-dropzone" onClick={() => toast.info('CSV upload (demo)')}>
                  <div className="big">📄</div>Drop your CSV here or <b>browse files</b>
                  <div style={{ fontSize: 11, marginTop: 6, color: '#bbb' }}>Use the template to avoid mapping errors</div>
                </div>
                <div style={{ marginTop: 16 }}>
                  <button type="button" className="adm-btn primary">⬆ Start import</button>
                </div>
              </div>
            </div>
            <div className="adm-card">
              <div className="adm-card-head"><span className="adm-card-title">Recent imports</span></div>
              <table className="adm-table">
                <thead><tr><th>File</th><th>Rows</th><th>Status</th><th>When</th></tr></thead>
                <tbody>
                  {ADMIN_IMPORT_HISTORY.map((h) => (
                    <tr key={h.file}>
                      <td className="adm-strong">{h.file}</td>
                      <td>{h.rows}</td>
                      <td><AdminBadge status={h.status.includes('Failed') ? 'Rejected' : 'Approved'} /></td>
                      <td className="adm-muted">{h.when}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div className="adm-card">
              <div className="adm-card-head"><span className="adm-card-title">Export</span></div>
              <div className="adm-card-body">
                <div className="adm-field">
                  <label>What to export</label>
                  <select><option>All products</option><option>By mood</option><option>Low stock only</option><option>Orders</option></select>
                </div>
                <div className="adm-field"><label>Format</label><select><option>CSV</option><option>XLSX</option></select></div>
                <button type="button" className="adm-btn primary" onClick={() => toast.success('Export started — you\u2019ll get an email')}>⬇ Export now</button>
              </div>
            </div>
          </div>
        </div>
        <AdminDemoNote />
      </AdminBody>
    </>
  );
}

export function ShippingQueuePage() {
  const toast = useToast();
  return (
    <>
      <AdminModuleBar
        title="Shipping Queue"
        sub="Pack, label and dispatch orders"
        actions={<button type="button" className="adm-btn primary" onClick={() => toast.success('Batch labels generated')}>Generate labels</button>}
      />
      <AdminBody>
        <div className="adm-kanban">
          {ADMIN_SHIPPING_QUEUE.map((col) => (
            <div className="adm-kcol" key={col.column}>
              <div className="adm-kcol-h"><span>{col.column}</span><span>{col.orders.length}</span></div>
              {col.orders.map((id, i) => (
                <div className="adm-kcard" key={id}>
                  <div className="adm-kcard-id">#{id}</div>
                  <div className="adm-kcard-sub">{i + 1} item{i ? 's' : ''} · {['Standard', 'Express', 'Standard'][i % 3]}</div>
                  <button type="button" className="adm-btn ghost sm" onClick={() => toast.info('Label printing…')}>Print label</button>
                </div>
              ))}
            </div>
          ))}
        </div>
        <AdminDemoNote />
      </AdminBody>
    </>
  );
}

export function TrackingPage() {
  const toast = useToast();
  return (
    <>
      <AdminModuleBar
        title="Tracking & AWBs"
        sub="Live shipment tracking across couriers"
        actions={<button type="button" className="adm-btn ghost sm" onClick={() => toast.info('Syncing courier status…')}>Sync now</button>}
      />
      <AdminBody>
        <AdminStats
          items={[
            { label: 'In transit', value: 142, icon: '🚚' },
            { label: 'Out for delivery', value: 37, icon: '📦' },
            { label: 'Delivered (7d)', value: 908, delta: '+6%', dir: 'up', icon: '✅' },
            { label: 'Delayed', value: 5, delta: 'check', dir: 'down', icon: '⚠️' },
          ]}
        />
        <div className="adm-tablewrap">
          <table className="adm-table">
            <thead><tr><th>Order</th><th>Courier</th><th>AWB</th><th>Status</th><th>Last location</th><th></th></tr></thead>
            <tbody>
              {ADMIN_TRACKING.map((r) => (
                <tr key={r.order}>
                  <td className="adm-strong">#{r.order}</td>
                  <td>{r.courier}</td>
                  <td className="adm-muted">{r.awb}</td>
                  <td><AdminBadge status={r.status} /></td>
                  <td>{r.location}</td>
                  <td><button type="button" className="adm-ico-btn" onClick={() => toast.info('Opening tracking…')}>👁</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminBody>
    </>
  );
}

export function ReturnRequestsPage() {
  const toast = useToast();
  return (
    <>
      <AdminModuleBar title="Return Requests" sub="Review and action customer returns" />
      <AdminBody>
        <AdminStats
          items={[
            { label: 'Open requests', value: 9, delta: 'action needed', dir: 'flat', icon: '↩️' },
            { label: 'Approved (30d)', value: 64, icon: '✅' },
            { label: 'Return rate', value: '4.2%', delta: '-0.6%', dir: 'up', icon: '📉' },
            { label: 'Refund value', value: formatINR(28400), icon: '💸' },
          ]}
        />
        <div className="adm-tablewrap">
          <table className="adm-table">
            <thead><tr><th>Return ID</th><th>Order</th><th>Item</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {ADMIN_RETURNS.map((r) => (
                <tr key={r.id}>
                  <td className="adm-strong">{r.id}</td>
                  <td className="adm-muted">#{r.order}</td>
                  <td>{r.item}</td>
                  <td>{r.reason}</td>
                  <td><AdminBadge status={r.status} /></td>
                  <td>
                    {r.status === 'Pending' ? (
                      <div className="adm-row-actions">
                        <button type="button" className="adm-btn rose sm" onClick={() => toast.success('Return approved')}>Approve</button>
                        <button type="button" className="adm-btn ghost sm" onClick={() => toast.info('Return rejected')}>Reject</button>
                      </div>
                    ) : (
                      <button type="button" className="adm-ico-btn" onClick={() => toast.info('Viewing return')}>👁</button>
                    )}
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

export function RefundCenterPage() {
  const toast = useToast();
  return (
    <>
      <AdminModuleBar
        title="Refund Center"
        sub="Process and track refunds"
        actions={<button type="button" className="adm-btn primary" onClick={() => toast.success('Batch refunds queued')}>Process selected</button>}
      />
      <AdminBody>
        <AdminStats
          items={[
            { label: 'Pending refunds', value: 6, delta: `${formatINR(19800)} total`, dir: 'flat', icon: '💸' },
            { label: 'Processed (30d)', value: 58, icon: '✅' },
            { label: 'Avg. time', value: '1.4 days', delta: '-0.3d', dir: 'up', icon: '⏱️' },
          ]}
        />
        <div className="adm-tablewrap">
          <table className="adm-table">
            <thead><tr><th>Refund ID</th><th>Order</th><th>Customer</th><th>Amount</th><th>Method</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {ADMIN_REFUNDS.map((r) => (
                <tr key={r.id}>
                  <td className="adm-strong">{r.id}</td>
                  <td className="adm-muted">#{r.order}</td>
                  <td>{r.customer}</td>
                  <td className="adm-strong">{formatINR(r.amount)}</td>
                  <td>{r.method}</td>
                  <td><AdminBadge status={r.status} /></td>
                  <td>
                    {r.status === 'Pending' ? (
                      <button type="button" className="adm-btn rose sm" onClick={() => toast.success('Refund issued ✦')}>Issue refund</button>
                    ) : (
                      <span className="adm-muted">Done</span>
                    )}
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
