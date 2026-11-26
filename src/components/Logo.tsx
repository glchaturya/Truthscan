import { ShieldCheck } from 'lucide-react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export default function Logo({ className = '', showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 rounded-lg bg-electric-400/30 blur-md" />
        <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-electric-400/40 bg-navy-800">
          <ShieldCheck className="h-5 w-5 text-electric-300" strokeWidth={2.2} />
        </div>
      </div>
      {showText && (
        <span className="font-mono text-lg font-bold tracking-tight text-white">
          TRUTH<span className="text-electric-300">SCAN</span>
        </span>
      )}
    </div>
  );
}
