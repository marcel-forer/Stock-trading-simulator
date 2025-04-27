// This is the entry point of the frontend application. It renders the App component into the root element of the HTML document.
import { createRoot } from 'react-dom/client'
import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';
import App from './App';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
