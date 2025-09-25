import { createRoot } from 'react-dom/client'
import './Style/index.css'
import Home from './Pages/Home.tsx'
import Game from './Pages/Game.tsx'
import Compass from './Components/Compass.tsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import SSEClient from './Pages/SSEClient.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename='/politic-field'>
    <Routes>
      <Route index element={<Home />} />
      <Route path='/:id' element={<Game />} />
      <Route path='/sse' element={<SSEClient />} />
      <Route path='/compass' element={<Compass />} />
    </Routes>
  </BrowserRouter>,
)
