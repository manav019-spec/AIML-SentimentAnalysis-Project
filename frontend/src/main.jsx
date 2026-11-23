import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { LanguageProvider } from './context/LanguageContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { SentimentProvider } from './context/SentimentContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <SentimentProvider>
          <App />
        </SentimentProvider>
      </AuthProvider>
    </LanguageProvider>
  </React.StrictMode>,
)
