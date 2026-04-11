import React from 'react';
import ReactDOM from 'react-dom/client';
// Se a pasta for 'Pages', o import DEVE ser:
import Dashboard from './Page/Dashboard.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);