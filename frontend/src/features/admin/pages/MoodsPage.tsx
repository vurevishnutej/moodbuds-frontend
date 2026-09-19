import { useState } from 'react';
import { AdminModuleBar, AdminStats, AdminBody, AdminToggle, AdminDemoNote } from '../components/AdminUI';
import { ADMIN_MOODS } from '../../../data/admin';
import { useToast } from '../../../app/providers/ToastProvider';

export function MoodsPage() {
  const [moods, setMoods] = useState(ADMIN_MOODS);
  const toast = useToast();

  return (
    <>
      <AdminModuleBar
        title="Mood Engine"
        sub="The heart of MoodBuds — manage your 9 moods"
        actions={<button type="button" className="adm-btn primary" onClick={() => toast.info('New mood (demo)')}>+ New mood</button>}
      />
      <AdminBody>
        <AdminStats
          items={[
            { label: 'Active moods', value: `${moods.filter((m) => m.active).length} / 9`, icon: '🎭' },
            { label: 'Top mood', value: 'Cool', delta: '51 products', dir: 'flat', icon: '😎' },
            { label: 'Linked products', value: 360, icon: '🔗' },
          ]}
        />
        <div className="adm-mood-grid">
          {moods.map((m) => (
            <div className="adm-mood-card" key={m.id}>
              <div className="adm-mood-top" style={{ background: `${m.color}22` }}>{m.emoji}</div>
              <div className="adm-mood-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="adm-mood-name">{m.name}</div>
                  <AdminToggle
                    on={m.active}
                    onToggle={() => setMoods((prev) => prev.map((x) => (x.id === m.id ? { ...x, active: !x.active } : x)))}
                  />
                </div>
                <div className="adm-mood-tag">{m.tag}</div>
                <div className="adm-mood-foot">
                  <div className="adm-mood-count"><b>{m.productCount}</b> products</div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span className="adm-mood-dot" style={{ background: m.color, width: 14, height: 14, border: '1px solid #ddd' }} />
                    <button type="button" className="adm-ico-btn" onClick={() => toast.info(`Edit ${m.name} mood`)}>✎</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <AdminDemoNote />
      </AdminBody>
    </>
  );
}
