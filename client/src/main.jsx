import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TopRouter from './Router'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TopRouter />
  </StrictMode>,
)
