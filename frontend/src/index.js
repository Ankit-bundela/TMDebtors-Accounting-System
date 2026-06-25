import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';   // 👈 ye hona chahiye

import { BrowserRouter } from 'react-router-dom'; // 👈 important

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);