import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './Pages/Home.tsx'
import Game from './Pages/Game.tsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import SSEClient from './Pages/SSEClient.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename='/politic-field'>
    <Routes>
      <Route index element={<Home />} />
      <Route path='/:id' element={<Game />} />
      <Route path='/sse' element={<SSEClient />} />
    </Routes>
  </BrowserRouter>,
)
