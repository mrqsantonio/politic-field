import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Game from './Game.tsx'
import { BrowserRouter, Routes, Route } from 'react-router'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename='/politic-field'>
    <Routes>
      <Route index element={<App />} />
      <Route path='/game' element={<Game />} />
    </Routes>
  </BrowserRouter>,
)
