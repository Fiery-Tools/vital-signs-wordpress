import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './globals.css';

ReactDOM.createRoot(document.getElementById('vs-admin-root')).render(
  <HashRouter>
    <App />
  </HashRouter>
);
