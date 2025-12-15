import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import './index.css'

// Set absolute base URL for axios to support separate hosting
// In dev: http://localhost:5000
// In prod: https://your-backend.onrender.com
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.defaults.withCredentials = true; // Important for session cookies

// Ideally this should be import.meta.env.VITE_GOOGLE_CLIENT_ID
const clientId = "427687386236-l1iintgsf9s4n95p63lqpq0bn0o56nu0.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
