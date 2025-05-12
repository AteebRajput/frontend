import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import store from '../store.js'
import App from './App.jsx'

if (import.meta.env.MODE === 'development') {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Failed prop type')
    ) {
      return;
    }
    originalConsoleError(...args);
  };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>

    <App />
    </Provider>
  </StrictMode>,
)
