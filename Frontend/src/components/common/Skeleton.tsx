interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function Skeleton({ className = "", children }: SkeletonProps) {
  return (
    <div className={`relative overflow-hidden bg-surface-variant/60 rounded-md ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      {children}
    </div>
  );
}
