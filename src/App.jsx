import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import NotFoundPage from './pages/NotFoundPage'
import Header from './components/Header'
function App() {

  const isLoginPage = window.location.pathname === '/'

  return (
    <>
      {!isLoginPage && <Header />}
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/users' element={<Users />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
