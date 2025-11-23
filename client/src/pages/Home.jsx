import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { testConnection } from '../api/client'

const Home = () => {
  const [backendStatus, setBackendStatus] = useState('Checking...')
  const [backendData, setBackendData] = useState(null)

  useEffect(() => {
    // Test backend connection when component mounts
    const checkBackend = async () => {
      try {
        const data = await testConnection()
        setBackendStatus('✅ Connected')
        setBackendData(data)
      } catch (error) {
        setBackendStatus('❌ Connection Failed')
        console.error('Backend test failed:', error)
      }
    }

    checkBackend()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            ProjectConnect
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Find your next project partner! Connect, collaborate, and build your portfolio.
          </p>
          
          {/* Backend Status */}
          <div className="bg-white rounded-lg shadow p-4 mb-8 max-w-md mx-auto">
            <h3 className="font-semibold mb-2">Backend Status</h3>
            <p className={`font-mono text-sm ${backendStatus.includes('✅') ? 'text-green-600' : backendStatus.includes('❌') ? 'text-red-600' : 'text-yellow-600'}`}>
              {backendStatus}
            </p>
            {backendData && (
              <p className="text-xs text-gray-500 mt-1">
                {backendData.message} - {new Date(backendData.timestamp).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🤝</div>
            <h2 className="text-xl font-bold mb-2">Find Partners</h2>
            <p className="text-gray-600 mb-4">
              Connect with developers, designers, and creators with complementary skills.
            </p>
            <Link 
              to="/find-partner" 
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Find a Partner
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">💡</div>
            <h2 className="text-xl font-bold mb-2">Project Ideas</h2>
            <p className="text-gray-600 mb-4">
              Browse exciting project ideas or post your own to find collaborators.
            </p>
            <Link 
              to="/projects" 
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Browse Projects
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">👤</div>
            <h2 className="text-xl font-bold mb-2">Your Profile</h2>
            <p className="text-gray-600 mb-4">
              Showcase your skills, projects, and GitHub activity to potential partners.
            </p>
            <Link 
              to="/profile/me" 
              className="inline-block bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              View Profile
            </Link>
          </div>
        </div>

        {/* Features List */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Why ProjectConnect?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-2xl mr-3">🚀</span>
                <div>
                  <h3 className="font-semibold">Boost Your Portfolio</h3>
                  <p className="text-gray-600">Build projects outside your curriculum that employers love to see.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">🤝</span>
                <div>
                  <h3 className="font-semibold">Foster Collaboration</h3>
                  <p className="text-gray-600">Connect programmers with designers, writers with developers.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-2xl mr-3">📈</span>
                <div>
                  <h3 className="font-semibold">Skill Development</h3>
                  <p className="text-gray-600">Working in a team on real projects is the best way to learn.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">🔗</span>
                <div>
                  <h3 className="font-semibold">GitHub Integration</h3>
                  <p className="text-gray-600">Showcase your projects directly from your GitHub profile.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home