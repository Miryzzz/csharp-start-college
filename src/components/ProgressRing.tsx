interface ProgressRingProps {
  progress: number;
}

export function ProgressRing({ progress }: ProgressRingProps) {
  const value = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div
      className="progress-ring"
      role="progressbar"
      aria-label={`Прогресс курса: ${value}%`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      style={{ '--progress': value } as React.CSSProperties}
    >
      <span>{value}%</span>
    </div>
  );
}
