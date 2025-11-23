import React, { useState } from 'react'

const Auth = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    // TODO: Implement login logic
  }

  const handleGithubLogin = () => {
    window.location.href = 'https://projectconnect-backend.azurewebsites.net/api/auth/github'
  }

  return (
    <div className="max-w-md mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Sign In</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Login
        </button>
      </form>
      <div className="mt-6 text-center">
        <button
          onClick={handleGithubLogin}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          Sign in with GitHub
        </button>
      </div>
    </div>
  )
}

export default Auth