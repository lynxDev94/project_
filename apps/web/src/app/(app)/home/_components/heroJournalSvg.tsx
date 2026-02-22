export const HeroJournalSVG = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 280 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M0 12v136c0 6.6 5.4 12 12 12h116c6.6 0 12-5.4 12-12V12c0-6.6-5.4-12-12-12H12C5.4 0 0 5.4 0 12z"
        fill="rgba(var(--sj-white-rgb), 0.04)"
        stroke="rgba(var(--sj-white-rgb), 0.12)"
        strokeWidth="1"
      />
      {[28, 44, 60, 76, 92].map((y, i) => (
        <line
          key={i}
          x1="24"
          y1={y}
          x2="100"
          y2={y}
          stroke="rgba(var(--sj-white-rgb), 0.08)"
          strokeWidth="1"
        />
      ))}
      <path
        d="M128 0h24c6.6 0 12 5.4 12 12v136c0 6.6-5.4 12-12 12h-24V0z"
        fill="rgba(var(--sj-surface-dark-rgb), 0.9)"
        stroke="rgba(var(--sj-white-rgb), 0.15)"
        strokeWidth="1"
      />
      <path
        d="M152 0h116c6.6 0 12 5.4 12 12v136c0 6.6-5.4 12-12 12H152V0z"
        fill="rgba(var(--sj-white-rgb), 0.04)"
        stroke="rgba(var(--sj-white-rgb), 0.12)"
        strokeWidth="1"
      />
      {[28, 44, 60, 76, 92].map((y, i) => (
        <line
          key={i}
          x1="168"
          y1={y}
          x2="244"
          y2={y}
          stroke="rgba(var(--sj-white-rgb), 0.08)"
          strokeWidth="1"
        />
      ))}
      <path
        d="M140 0v50c0 4 3 7 7 7s7-3 7-7V0"
        fill="rgba(var(--sj-brand-rgb), 0.6)"
        stroke="rgba(var(--sj-white-rgb), 0.2)"
        strokeWidth="1"
      />
    </svg>
  );
};
