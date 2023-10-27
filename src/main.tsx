import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.js'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import GlobalStateContext from './contexts/globalStateContext.js'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GlobalStateContext>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GlobalStateContext>
  </React.StrictMode>
)
