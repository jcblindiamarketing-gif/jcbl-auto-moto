import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MenuProvider } from "./context/MenuContext"; // ✅ IMPORT

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MenuProvider>  
      <App />
    </MenuProvider>
  </StrictMode>
)