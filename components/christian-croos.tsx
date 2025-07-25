interface ChristianCrossProps {
  className?: string
}

export function ChristianCross({ className = "w-6 h-6" }: ChristianCrossProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Vertical line */}
      <line x1="12" y1="2" x2="12" y2="22" />
      {/* Horizontal line */}
      <line x1="7" y1="8" x2="17" y2="8" />
    </svg>
  )
}
