import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/fraunces';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/600.css';
import './styles/globals.css';
import { App } from './app/App';

createRoot(document.getElementById('root')!, {
  onUncaughtError: (error, info) => console.error('[Beyond the Dust] render error', error, info.componentStack),
}).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
