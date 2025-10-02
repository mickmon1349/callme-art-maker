import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 確保 basename 屬性正確設定 */}
    <BrowserRouter basename="/callme-art-maker">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);