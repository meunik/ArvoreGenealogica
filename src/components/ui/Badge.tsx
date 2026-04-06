interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'muted' | 'success' | 'warning' | 'danger' | 'adoptive';
  size?: 'sm' | 'md';
}

const variantStyles: Record<NonNullable<BadgeProps['variant']>, string> = {
  default:  'bg-surface-elevated text-text-secondary border border-border',
  accent:   'bg-accent-subtle text-accent-text border border-accent',
  muted:    'bg-surface-elevated text-text-muted border border-border-subtle',
  success:  'bg-green-950 text-success border border-green-800',
  warning:  'bg-yellow-950 text-warning border border-yellow-800',
  danger:   'bg-red-950 text-danger border border-red-800',
  adoptive: 'bg-purple-950 text-edge-adoptive border border-purple-700',
};

const sizeStyles = {
  sm: 'text-[10px] px-1.5 py-0.5',
  md: 'text-xs px-2 py-1',
};

export function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variantStyles[variant]} ${sizeStyles[size]}`}>
      {children}
    </span>
  );
}
