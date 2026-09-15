import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { AdminBody, AdminModuleBar, AdminStats } from '../components/AdminUI';
import { useToast } from '../../../app/providers/ToastProvider';
import { moodBannerUrl } from '../../moods/utils/moodBanner';
import { adminBannerService } from '../services/adminBannerService';
import type { AdminMoodBanner } from '../services/adminBannerService';
import { adminQuizService } from '../services/adminQuizService';
import type { AdminSummary } from '../services/adminQuizService';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function readableError(error: unknown): string {
  if (!(error instanceof Error)) return 'The banner studio hit an unexpected snag. Please try again.';
  try {
    const body = JSON.parse(error.message) as { detail?: string };
    return body.detail || 'The banner studio could not complete that request.';
  } catch {
    return error.message || 'The banner studio could not complete that request.';
  }
}

function formatBytes(bytes?: number): string {
  if (!bytes) return '—';
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.ceil(bytes / 1024)} KB`;
}

function MoodBannerCard({ banner, onUpdated }: {
  banner: AdminMoodBanner;
  onUpdated: (next: AdminMoodBanner) => void;
}) {
  const toast = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const storedPreview = banner.configured
    ? moodBannerUrl(banner.moodSlug, banner.updatedAt ?? 'current')
    : null;
  const previewUrl = preview ?? storedPreview;

  const choose = (selected?: File) => {
    setError('');
    if (!selected) {
      setFile(null);
      return;
    }
    if (!ALLOWED_TYPES.has(selected.type)) {
      setError('Choose a JPG, PNG, or WebP image.');
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setError('This image is over 5 MB. Choose a lighter banner.');
      return;
    }
    setPreviewFailed(false);
    setFile(selected);
  };

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const updated = await adminBannerService.replace(banner.moodId, file);
      onUpdated(updated);
      setFile(null);
      setPreviewFailed(false);
      toast.success(`${banner.moodName} banner is now live.`);
    } catch (cause) {
      setError(readableError(cause));
    } finally {
      setUploading(false);
    }
  };

  return (
    <article className="badm-card">
      <div
        className="badm-preview"
        style={{ background: `linear-gradient(135deg, ${banner.color ?? '#252936'}55, #151823)` }}
      >
        {previewUrl && !previewFailed ? (
          <img src={previewUrl} alt={`${banner.moodName} banner preview`} onError={() => setPreviewFailed(true)} />
        ) : (
          <div className="badm-empty">
            <span>{banner.moodName.slice(0, 1)}</span>
            <small>No banner uploaded</small>
          </div>
        )}
        <span className={`badm-status ${banner.configured ? 'live' : 'empty'}`}>
          {banner.configured ? 'Live' : 'Needs image'}
        </span>
        <div className="badm-safe-area">Desktop crop</div>
      </div>

      <div className="badm-card-body">
        <div className="badm-card-title">
          <span className="badm-mood-dot" style={{ background: banner.color ?? '#aaa' }} />
          <div>
            <h3>{banner.moodName}</h3>
            <p>{banner.moodSlug}</p>
          </div>
        </div>

        <div className="badm-meta">
          <span><b>File</b>{banner.imagePath ?? 'Not configured'}</span>
          <span><b>Dimensions</b>{banner.widthPx && banner.heightPx ? `${banner.widthPx} × ${banner.heightPx}` : '—'}</span>
          <span><b>Size</b>{formatBytes(banner.sizeBytes)}</span>
        </div>

        <label className="badm-file-picker">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            onChange={(event) => choose(event.target.files?.[0])}
          />
          <span>{file ? file.name : banner.configured ? 'Choose replacement' : 'Choose banner image'}</span>
          <strong>Browse</strong>
        </label>
        {file && <p className="badm-pending">Ready to replace with {formatBytes(file.size)} image</p>}
        {error && <div className="qadm-error">{error}</div>}

        <button type="button" className="adm-btn primary badm-upload" disabled={!file || uploading} onClick={() => void upload()}>
          {uploading ? 'Uploading…' : banner.configured ? 'Replace banner' : 'Upload banner'}
        </button>
      </div>
    </article>
  );
}

export function BannersPage() {
  const toast = useToast();
  const [admin, setAdmin] = useState<AdminSummary | null>(() => adminQuizService.currentAdmin());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [banners, setBanners] = useState<AdminMoodBanner[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  const configured = useMemo(() => banners.filter((banner) => banner.configured).length, [banners]);

  const load = async () => {
    setLoading(true);
    setLoadError('');
    try {
      setBanners(await adminBannerService.list());
    } catch (cause) {
      setLoadError(readableError(cause));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin) void load();
  }, [admin]);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setLoggingIn(true);
    setLoginError('');
    try {
      const signedIn = await adminQuizService.login(username, password);
      setAdmin(signedIn);
      setPassword('');
      toast.success(`Welcome, ${signedIn.fullName}.`);
    } catch (cause) {
      setLoginError(readableError(cause));
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = () => {
    adminQuizService.logout();
    setAdmin(null);
    setBanners([]);
  };

  return (
    <>
      <AdminModuleBar
        title="Mood Banners"
        sub="Upload the live storefront image for each mood"
        actions={admin ? <button type="button" className="adm-btn" onClick={logout}>Sign out admin</button> : undefined}
      />
      <AdminBody>
        {!admin ? (
          <div className="adm-card qadm-login-card">
            <div className="adm-card-body">
              <div className="qadm-login-copy">
                <div className="qadm-lock">✦</div>
                <div>
                  <span className="qadm-eyebrow">Restricted workspace</span>
                  <h2>SUPER_ADMIN access</h2>
                  <p>Banner changes appear across the live storefront. Sign in with a super-admin account to continue.</p>
                </div>
              </div>
              <form className="qadm-login-form" onSubmit={(event) => void login(event)}>
                <label className="adm-field"><span>Username</span><input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required /></label>
                <label className="adm-field"><span>Password</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
                {loginError && <div className="qadm-error">{loginError}</div>}
                <button type="submit" className="adm-btn primary" disabled={loggingIn}>{loggingIn ? 'Opening studio…' : 'Open banner studio'}</button>
              </form>
            </div>
          </div>
        ) : (
          <>
            <AdminStats items={[
              { label: 'Configured banners', value: `${configured} / ${banners.length || 9}`, icon: '▣' },
              { label: 'Storage model', value: 'One per mood', icon: '↻' },
              { label: 'Accepted files', value: 'JPG · PNG · WebP', icon: '◉' },
              { label: 'Maximum size', value: '5 MB', icon: '⇣' },
            ]} />
            <div className="badm-guidance">
              <strong>Upload once, update everywhere.</strong>
              <span>Recommended: at least 1400 × 700. Important subjects should stay near the centre for mobile cropping.</span>
            </div>
            {loadError && <div className="qadm-error badm-page-error">{loadError} <button type="button" onClick={() => void load()}>Retry</button></div>}
            {loading && banners.length === 0 ? (
              <div className="badm-loading">Preparing the banner studio…</div>
            ) : (
              <div className="badm-grid">
                {banners.map((banner) => (
                  <MoodBannerCard
                    key={banner.moodId}
                    banner={banner}
                    onUpdated={(updated) => setBanners((current) => current.map((item) => item.moodId === updated.moodId ? updated : item))}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </AdminBody>
    </>
  );
}
