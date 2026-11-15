export function RocketSilhouette({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 160"
      fill="none"
      className={className}
    >
      <path
        d="M32 6c10 11 15 31 15 52 0 32-11 58-20 75-5-28-6.6-56-1.5-77C28.6 40.2 29.8 22.6 32 6Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M32 118L17 150l19-12L55 150" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="32" cy="66" r="7.5" stroke="currentColor" strokeWidth="3" />
      <path d="M22 141l-7 17M42 141l7 17" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
