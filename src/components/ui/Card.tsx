import type { ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}
