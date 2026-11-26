import { useSyncExternalStore } from 'react';

export type Route = 'landing' | 'dashboard' | 'results' | 'history' | 'about';

interface RouterState {
  route: Route;
  /** Optional payload — e.g. an analysis id or a freshly-uploaded file context. */
  params: Record<string, string>;
}

type Listener = () => void;

let state: RouterState = { route: 'landing', params: {} };
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

export function navigate(route: Route, params: Record<string, string> = {}) {
  state = { route, params };
  emit();
}

export function getState(): RouterState {
  return state;
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Hook-like accessor returning the current route + a navigate function. */
export function createSignal() {
  const snap = useSyncExternalStore(subscribe, getState, getState);
  return {
    route: snap.route,
    params: snap.params,
    navigate,
  };
}

/** Component that renders the page matching the current route. */
export function RouterOutlet({ pages }: { pages: Record<Route, () => React.ReactNode> }) {
  const snap = useSyncExternalStore(subscribe, getState, getState);
  return <>{pages[snap.route]?.()}</>;
}
