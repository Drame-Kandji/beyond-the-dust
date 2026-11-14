import { Component, type ReactNode } from 'react';

/** Never leave a blank screen: show a friendly message and a way back to the map. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error) {
    console.error('[Beyond the Dust]', error);
  }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <main className="grid min-h-dvh place-items-center bg-space-950 px-6 text-center">
        <div>
          <p className="font-display text-2xl">Houston, we have a small problem.</p>
          <p className="mt-2 text-ink-300">Something went wrong while loading this screen.</p>
          <pre data-error className="mx-auto mt-4 max-w-xl overflow-auto rounded-xl bg-white/5 p-3 text-left text-xs whitespace-pre-wrap text-ink-500">{String(this.state.error?.stack || this.state.error).slice(0, 1200)}</pre>
          <button className="btn btn-primary mt-6" onClick={() => (window.location.hash = '#/hub', window.location.reload())}>
            Back to the map
          </button>
        </div>
      </main>
    );
  }
}
