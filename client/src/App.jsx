import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import FindPartner from './pages/FindPartner'
import Messages from './pages/Messages'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Decode token and set user
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUser(payload)
      } catch (error) {
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} setUser={setUser} />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth setUser={setUser} />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="/projects" element={<Projects user={user} />} />
            <Route path="/projects/:id" element={<ProjectDetail user={user} />} />
            <Route path="/find-partner" element={<FindPartner user={user} />} />
            <Route path="/messages" element={<Messages user={user} />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App