import type { ReactNode } from 'react';

export function Card({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`rounded-2xl border border-navy-700/70 bg-navy-900/60 backdrop-blur-sm ${className}`}>
      {children}
    </div>
  );
}

export function SectionTitle({ kicker, title, subtitle }: { kicker?: string; title: string; subtitle?: string }) {
  return (
    <div className="max-w-2xl">
      {kicker && <p className="font-mono text-xs uppercase tracking-[0.2em] text-electric-300">{kicker}</p>}
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
      {subtitle && <p className="mt-3 text-slate-400">{subtitle}</p>}
    </div>
  );
}

export function Badge({ tone = 'neutral', children }: { tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info'; children: ReactNode }) {
  const tones: Record<string, string> = {
    neutral: 'bg-navy-700/60 text-slate-300 border-navy-600',
    success: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    danger: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    info: 'bg-electric-500/10 text-electric-200 border-electric-400/30',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}
