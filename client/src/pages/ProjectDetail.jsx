import React from 'react'
import { useParams } from 'react-router-dom'

const ProjectDetail = () => {
  const { id } = useParams()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Project Details</h1>
      <p className="text-gray-600">Project ID: {id}</p>
    </div>
  )
}

export default ProjectDetail