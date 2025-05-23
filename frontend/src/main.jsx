import React from 'react'; // Correctly import React
import { StrictMode } from 'react'; // Correctly import StrictMode
import { createRoot } from 'react-dom/client'; // This is fine
import './index.css'; // Ensure your CSS file is correctly linked
import App from './App.jsx'; // Your App component

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
