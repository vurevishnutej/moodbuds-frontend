import { AdminModuleBar, AdminStats, AdminBody, AdminTable, AdminMoodBadge, AdminDemoNote } from '../components/AdminUI';
import { ADMIN_QUIZ_QUESTIONS, ADMIN_MOODS } from '../../../data/admin';
import { useToast } from '../../../app/providers/ToastProvider';

export function QuizManagementPage() {
  const toast = useToast();
  return (
    <>
      <AdminModuleBar
        title="Quiz Management"
        sub='Design the "Find your mood" quiz'
        actions={<button type="button" className="adm-btn primary" onClick={() => toast.info('New question (demo)')}>+ Add question</button>}
      />
      <AdminBody>
        <AdminStats
          items={[
            { label: 'Completion rate', value: '73%', delta: '+5%', dir: 'up', icon: '🧭' },
            { label: 'Quizzes taken (30d)', value: '4,210', icon: '📝' },
            { label: 'Top result', value: 'Cool', delta: '22% of users', dir: 'flat', icon: '😎' },
            { label: 'Avg. time', value: '58s', icon: '⏱️' },
          ]}
        />
        <div className="adm-card">
          <div className="adm-card-head">
            <span className="adm-card-title">Questions ({ADMIN_QUIZ_QUESTIONS.length})</span>
            <span className="adm-muted" style={{ fontSize: 12 }}>Drag to reorder</span>
          </div>
          <AdminTable
            rowKey={(q) => q.question}
            rows={ADMIN_QUIZ_QUESTIONS}
            columns={[
              { header: '#', render: (_q, i) => <span className="adm-strong">Q{i + 1}</span> },
              { header: 'Question', render: (q) => q.question },
              { header: 'Options', render: (q) => `${q.options} options` },
              {
                header: 'Maps mostly to',
                render: (q) => {
                  const m = ADMIN_MOODS.find((x) => x.id === q.mapsTo.toLowerCase())!;
                  return <AdminMoodBadge name={m.name} color={m.color} />;
                },
              },
              {
                header: 'Actions',
                render: () => (
                  <div className="adm-row-actions">
                    <button type="button" className="adm-ico-btn">✎</button>
                    <button type="button" className="adm-ico-btn danger">🗑</button>
                  </div>
                ),
              },
            ]}
          />
        </div>
        <AdminDemoNote />
      </AdminBody>
    </>
  );
}
