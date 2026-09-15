import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { AdminBody, AdminModuleBar, AdminStats } from '../components/AdminUI';
import { useToast } from '../../../app/providers/ToastProvider';
import {
  adminQuizService,
  type AdminQuizEditor,
  type AdminQuizQuestion,
  type AdminSummary,
} from '../services/adminQuizService';

const START_TAB = 'START';

export function QuizManagementPage() {
  const toast = useToast();
  const [admin, setAdmin] = useState<AdminSummary | null>(() => adminQuizService.currentAdmin());
  const [editor, setEditor] = useState<AdminQuizEditor | null>(null);
  const [selectedTab, setSelectedTab] = useState(START_TAB);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [draft, setDraft] = useState<AdminQuizQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEditor = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminQuizService.getEditor();
      setEditor(response);
      const first = response.questions.find((question) => question.order === 1 && !question.pathKey);
      setSelectedQuestionId(first?.id ?? null);
      setDraft(first ? structuredClone(first) : null);
    } catch {
      adminQuizService.logout();
      setAdmin(null);
      setEditor(null);
      setError('Your admin session expired. Sign in again to continue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin) void loadEditor();
    // Load once when a SUPER_ADMIN session becomes available.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin]);

  const visibleQuestions = useMemo(() => {
    if (!editor) return [];
    return editor.questions
      .filter((question) => selectedTab === START_TAB ? !question.pathKey : question.pathKey === selectedTab)
      .sort((left, right) => left.order - right.order);
  }, [editor, selectedTab]);

  const selectTab = (tab: string) => {
    setSelectedTab(tab);
    if (!editor) return;
    const first = editor.questions
      .filter((question) => tab === START_TAB ? !question.pathKey : question.pathKey === tab)
      .sort((left, right) => left.order - right.order)[0];
    setSelectedQuestionId(first?.id ?? null);
    setDraft(first ? structuredClone(first) : null);
  };

  const selectQuestion = (question: AdminQuizQuestion) => {
    setSelectedQuestionId(question.id);
    setDraft(structuredClone(question));
    setError(null);
  };

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setError(null);
    try {
      const signedIn = await adminQuizService.login(String(form.get('username')), String(form.get('password')));
      setAdmin(signedIn);
      toast.success(`Welcome, ${signedIn.fullName}`);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to sign in as SUPER_ADMIN.');
    } finally {
      setLoading(false);
    }
  };

  const updateOptionText = (optionId: number, text: string) => {
    setDraft((current) => current ? {
      ...current,
      options: current.options.map((option) => option.id === optionId ? { ...option, text } : option),
    } : current);
  };

  const toggleMood = (optionId: number, moodId: number) => {
    if (!editor) return;
    const mood = editor.moods.find((candidate) => candidate.id === moodId);
    if (!mood) return;
    setDraft((current) => current ? {
      ...current,
      options: current.options.map((option) => {
        if (option.id !== optionId) return option;
        const exists = option.weights.some((weight) => weight.moodId === moodId);
        return {
          ...option,
          weights: exists
            ? option.weights.filter((weight) => weight.moodId !== moodId)
            : [...option.weights, {
                moodId: mood.id,
                moodName: mood.name,
                moodSlug: mood.slug,
                color: mood.color,
                score: 3,
              }],
        };
      }),
    } : current);
  };

  const updateMoodScore = (optionId: number, moodId: number, score: number) => {
    setDraft((current) => current ? {
      ...current,
      options: current.options.map((option) => option.id === optionId ? {
        ...option,
        weights: option.weights.map((weight) => weight.moodId === moodId ? { ...weight, score } : weight),
      } : option),
    } : current);
  };

  const save = async () => {
    if (!draft) return;
    if (!draft.text.trim() || draft.options.some((option) => !option.text.trim())) {
      setError('Question and option text cannot be empty.');
      return;
    }
    if (draft.options.some((option) => option.weights.length === 0)) {
      setError('Every answer option needs at least one mood influence.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const response = await adminQuizService.updateQuestion(draft.id, {
        questionText: draft.text.trim(),
        options: draft.options.map((option) => ({
          id: option.id,
          text: option.text.trim(),
          weights: option.weights.map((weight) => ({ moodId: weight.moodId, score: weight.score })),
        })),
      });
      setEditor(response);
      const updated = response.questions.find((question) => question.id === draft.id);
      setDraft(updated ? structuredClone(updated) : null);
      toast.success('Quiz question updated');
    } catch {
      setError('The question could not be saved. Nothing was changed—please retry.');
    } finally {
      setSaving(false);
    }
  };

  const signOut = () => {
    adminQuizService.logout();
    setAdmin(null);
    setEditor(null);
    setDraft(null);
    setError(null);
  };

  return (
    <>
      <AdminModuleBar
        title="Quiz Management"
        sub="Edit the fixed five-question mood journey"
        actions={admin ? (
          <button type="button" className="adm-btn ghost" onClick={signOut}>Sign out admin</button>
        ) : undefined}
      />
      <AdminBody>
        {!admin && (
          <div className="adm-card qadm-login-card">
            <div className="adm-card-body">
              <div className="qadm-lock">✦</div>
              <div className="qadm-login-copy">
                <span className="qadm-eyebrow">Restricted workspace</span>
                <h2>SUPER_ADMIN access</h2>
                <p>Quiz wording and mood scoring affect every recommendation. Sign in with a super-admin account to edit them.</p>
              </div>
              <form className="qadm-login-form" onSubmit={(event) => void login(event)}>
                <div className="adm-field">
                  <label htmlFor="quiz-admin-username">Username</label>
                  <input id="quiz-admin-username" name="username" autoComplete="username" required />
                </div>
                <div className="adm-field">
                  <label htmlFor="quiz-admin-password">Password</label>
                  <input id="quiz-admin-password" name="password" type="password" autoComplete="current-password" required />
                </div>
                {error && <div className="qadm-error" role="alert">{error}</div>}
                <button type="submit" className="adm-btn primary" disabled={loading}>
                  {loading ? 'Checking access…' : 'Open quiz editor'}
                </button>
              </form>
            </div>
          </div>
        )}

        {admin && loading && <div className="mb-state"><div className="mb-spinner" /><div>Loading quiz structure…</div></div>}

        {admin && editor && (
          <>
            <AdminStats items={[
              { label: 'Questions per quiz', value: editor.questionsPerQuiz, icon: '🧭' },
              { label: 'Adaptive paths', value: editor.paths.length, icon: '⑂' },
              { label: 'Editable records', value: editor.questions.length, icon: '✎' },
              { label: 'Active moods', value: editor.moods.length, icon: '◉' },
            ]} />

            <div className={`qadm-health ${editor.structure.valid ? 'valid' : 'invalid'}`}>
              <span className="qadm-health-icon">{editor.structure.valid ? '✓' : '!'}</span>
              <div>
                <strong>{editor.structure.valid ? 'Quiz structure is healthy' : 'Quiz structure needs attention'}</strong>
                <span>{editor.structure.valid
                  ? 'Every journey contains the starting question and four branch questions.'
                  : editor.structure.issues.join(' · ')}</span>
              </div>
            </div>

            <div className="adm-tabs qadm-tabs" role="tablist" aria-label="Quiz paths">
              <button type="button" className={`adm-tab${selectedTab === START_TAB ? ' on' : ''}`} onClick={() => selectTab(START_TAB)}>
                Starting question
              </button>
              {editor.paths.map((path) => (
                <button key={path.key} type="button" className={`adm-tab${selectedTab === path.key ? ' on' : ''}`} onClick={() => selectTab(path.key)}>
                  Path {path.key} <span className="cnt">{path.name}</span>
                </button>
              ))}
            </div>

            <div className="qadm-workspace">
              <aside className="adm-card qadm-question-list">
                <div className="adm-card-head">
                  <span className="adm-card-title">Fixed question slots</span>
                  <span className="qadm-fixed-badge">Structure locked</span>
                </div>
                <div className="qadm-question-items">
                  {visibleQuestions.map((question) => (
                    <button
                      key={question.id}
                      type="button"
                      className={`qadm-question-item${selectedQuestionId === question.id ? ' active' : ''}`}
                      onClick={() => selectQuestion(question)}
                    >
                      <span className="qadm-question-number">Q{question.order}</span>
                      <span>{question.text}</span>
                      <span className="qadm-chevron">›</span>
                    </button>
                  ))}
                </div>
                <div className="qadm-structure-note">
                  Question order, paths, option letters and Q1 routing are locked to protect the live quiz.
                </div>
              </aside>

              {draft && (
                <section className="adm-card qadm-editor-card">
                  <div className="adm-card-head qadm-editor-head">
                    <div>
                      <span className="qadm-eyebrow">{draft.pathKey ? `Path ${draft.pathKey}` : 'Universal'} · Question {draft.order}</span>
                      <div className="adm-card-title">Edit question and mood influence</div>
                    </div>
                    <button type="button" className="adm-btn primary" disabled={saving} onClick={() => void save()}>
                      {saving ? 'Saving…' : 'Save question'}
                    </button>
                  </div>
                  <div className="adm-card-body">
                    <div className="adm-field">
                      <label htmlFor="quiz-question-text">Question text</label>
                      <textarea
                        id="quiz-question-text"
                        maxLength={500}
                        value={draft.text}
                        onChange={(event) => setDraft({ ...draft, text: event.target.value })}
                      />
                      <span className="qadm-counter">{draft.text.length}/500</span>
                    </div>

                    <div className="qadm-option-stack">
                      {draft.options.map((option) => (
                        <article className="qadm-option-card" key={option.id}>
                          <div className="qadm-option-head">
                            <span className="qadm-option-letter">{option.key}</span>
                            <div className="adm-field qadm-option-field">
                              <label htmlFor={`option-${option.id}`}>Answer option</label>
                              <input
                                id={`option-${option.id}`}
                                maxLength={500}
                                value={option.text}
                                onChange={(event) => updateOptionText(option.id, event.target.value)}
                              />
                            </div>
                            {option.routesToPath && <span className="qadm-route">Routes to path {option.routesToPath}</span>}
                          </div>
                          <div className="qadm-mood-label">Mood influence <span>Select at least one; 5 is strongest</span></div>
                          <div className="qadm-mood-grid">
                            {editor.moods.map((mood) => {
                              const weight = option.weights.find((candidate) => candidate.moodId === mood.id);
                              return (
                                <div className={`qadm-mood-row${weight ? ' selected' : ''}`} key={mood.id}>
                                  <button type="button" className="qadm-mood-toggle" onClick={() => toggleMood(option.id, mood.id)}>
                                    <span className="qadm-mood-dot" style={{ background: mood.color || '#aaa' }} />
                                    <span>{mood.name}</span>
                                    <span className="qadm-checkmark">{weight ? '✓' : '+'}</span>
                                  </button>
                                  {weight && (
                                    <select
                                      aria-label={`${mood.name} influence for option ${option.key}`}
                                      value={weight.score}
                                      onChange={(event) => updateMoodScore(option.id, mood.id, Number(event.target.value))}
                                    >
                                      {[1, 2, 3, 4, 5].map((score) => <option value={score} key={score}>{score}</option>)}
                                    </select>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </article>
                      ))}
                    </div>
                    {error && <div className="qadm-error qadm-save-error" role="alert">{error}</div>}
                  </div>
                </section>
              )}
            </div>
          </>
        )}
      </AdminBody>
    </>
  );
}
