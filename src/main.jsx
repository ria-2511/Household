import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import AuthGate from './auth/AuthGate';
import './styles/themes.scss';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AuthGate />
    </Provider>
  </StrictMode>,
);
