import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { StrictMode } from 'react';
import { NetworkStatusProvider } from './lib/network/NetworkStatusProvider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <NetworkStatusProvider>
      <App />
    </NetworkStatusProvider>
  </StrictMode>
);
