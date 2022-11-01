import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

/**
@description: This is the root for which your code is injected onto the DOM 
**/

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

