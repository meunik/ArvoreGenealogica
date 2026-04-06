interface InfoRowProps {
  label: string;
  value?: string | null;
  fallback?: string;
  icon?: string;
}

export function InfoRow({ label, value, fallback = '—', icon }: InfoRowProps) {
  const display = value || fallback;
  const isEmpty = !value;

  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border-subtle last:border-0">
      {icon && <span className="text-text-muted text-sm mt-0.5 shrink-0">{icon}</span>}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted mb-0.5">
          {label}
        </p>
        <p
          className={`text-sm break-words ${isEmpty ? 'text-text-muted italic' : 'text-text-primary'}`}
        >
          {display}
        </p>
      </div>
    </div>
  );
}
