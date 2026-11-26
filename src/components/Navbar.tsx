import { createSignal } from './router';
import Logo from './Logo';

type Route = 'landing' | 'dashboard' | 'results' | 'history' | 'about';

const NAV_ITEMS: { label: string; route: Route }[] = [
  { label: 'Home', route: 'landing' },
  { label: 'Analyze', route: 'dashboard' },
  { label: 'History', route: 'history' },
  { label: 'About', route: 'about' },
];

export default function Navbar() {
  const { route, navigate } = createSignal();
  return (
    <header className="sticky top-0 z-40 border-b border-navy-700/60 bg-navy-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate('landing')} className="transition-opacity hover:opacity-80">
          <Logo />
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.route}
              onClick={() => navigate(item.route)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                route === item.route
                  ? 'bg-electric-500/15 text-electric-200'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => navigate('dashboard')}
          className="hidden rounded-lg bg-electric-500 px-4 py-2 text-sm font-semibold text-navy-950 shadow-glow transition-all hover:bg-electric-400 md:block"
        >
          Get Started
        </button>

        {/* mobile: compact select */}
        <div className="flex items-center gap-2 md:hidden">
          <select
            value={route}
            onChange={(e) => navigate(e.target.value as Route)}
            className="rounded-lg border border-navy-700 bg-navy-800 px-3 py-2 text-sm text-white"
          >
            {NAV_ITEMS.map((item) => (
              <option key={item.route} value={item.route}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
