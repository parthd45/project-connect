import { Link, useNavigate } from 'react-router-dom'

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-blue-600">
            Project Connect
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/projects" className="text-gray-600 hover:text-blue-600">
              Projects
            </Link>
            <Link to="/find-partner" className="text-gray-600 hover:text-blue-600">
              Find Partners
            </Link>

            {user ? (
              <>
                <Link to="/messages" className="text-gray-600 hover:text-blue-600">
                  Messages
                </Link>
                <Link to="/profile" className="text-gray-600 hover:text-blue-600">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar