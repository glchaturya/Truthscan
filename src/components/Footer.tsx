import { AlertTriangle } from 'lucide-react';
import { createSignal } from './router';
import Logo from './Logo';

export default function Footer() {
  const { navigate } = createSignal();
  return (
    <footer className="border-t border-navy-700/60 bg-navy-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-3 text-sm text-slate-400">
              Intelligent deepfake and digital media verification. Helping you trust what you see
              and verify what you hear.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <span className="font-semibold text-white">Navigate</span>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <button onClick={() => navigate('landing')} className="text-slate-400 hover:text-electric-300">Home</button>
              <button onClick={() => navigate('dashboard')} className="text-slate-400 hover:text-electric-300">Analyze</button>
              <button onClick={() => navigate('history')} className="text-slate-400 hover:text-electric-300">History</button>
              <button onClick={() => navigate('about')} className="text-slate-400 hover:text-electric-300">About</button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-300/90">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            TRUTHSCAN provides AI-assisted analysis only. Predictions are not absolute proof of
            authenticity or manipulation, and should never be the sole basis for consequential
            decisions.
          </p>
        </div>

        <p className="mt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} TRUTHSCAN. For research and verification assistance only.
        </p>
      </div>
    </footer>
  );
}
