interface IconProps {
  size?: number;
  className?: string;
}

export function SearchIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" />
    </svg>
  );
}

export function HeartIcon({ size = 18, filled = false, className }: IconProps & { filled?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.5}
      className={className}
    >
      <path d="M12 20.5l-1.1-1C5.5 14.8 2 11.5 2 7.5 2 5 4 3 6.5 3c1.7 0 3.4 1 4.5 2.5C12.1 4 13.8 3 15.5 3 18 3 20 5 20 7.5c0 4-3.5 7.3-8.9 11.9L12 20.5z" />
    </svg>
  );
}

export function BagIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path d="M6 7h12l-1 14H7L6 7z" />
      <path d="M9 7V5a3 3 0 016 0v2" />
    </svg>
  );
}

export function UserIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}

export function ArrowLeftIcon({ size = 13, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path d="M8 2L4 6.5 8 11" />
    </svg>
  );
}

export function CloseIcon({ size = 13, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path d="M2 2l9 9M11 2l-9 9" />
    </svg>
  );
}
