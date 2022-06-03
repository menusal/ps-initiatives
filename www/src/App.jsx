import {
  BrowserRouter,
  Routes, // instead of "Switch"
  Route,
} from 'react-router-dom'
import Login from './components/views/Login'
import Initiatives from './components/views/Initiatives'
import NotFound from './components/views/NotFound'
import "./App.css"
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Login />} />
          <Route exact path='/initiatives' element={<Initiatives />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
