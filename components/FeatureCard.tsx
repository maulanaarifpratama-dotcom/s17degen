import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function FeatureCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40', className)}>
      <h3 className="text-xl font-black text-slate-50">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}
