import type { ReactNode } from 'react';

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="mb-state mb-state-loading" role="status" aria-live="polite">
      <div className="mb-spinner" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="mb-state mb-state-error" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="mb-state-retry" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-state mb-state-empty">
      <div className="mb-state-title">{title}</div>
      {subtitle && <div className="mb-state-subtitle">{subtitle}</div>}
      {action}
    </div>
  );
}
