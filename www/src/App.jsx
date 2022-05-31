import { useState } from 'react'
import logo from './logo.svg'
import {
  BrowserRouter,
  Routes, // instead of "Switch"
  Route,
} from 'react-router-dom'
import Login from './components/views/Login'
import Initiatives from './components/views/Initiatives'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Login />} />
          <Route exact path='/initiatives' element={<Initiatives />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
