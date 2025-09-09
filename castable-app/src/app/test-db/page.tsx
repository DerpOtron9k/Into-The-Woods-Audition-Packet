'use client'

import { useState } from 'react'

export default function TestDatabase() {
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setStatus('Testing database connection...')
    
    try {
      const response = await fetch('/api/health')
      const data = await response.json()
      
      if (data.status === 'ok') {
        setStatus(`✅ Database Status: ${data.database.status}`)
      } else {
        setStatus(`❌ Database Error: ${data.error}`)
      }
    } catch (error) {
      setStatus(`❌ Connection Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Database Connection Test</h1>
      
      <div className="space-y-4">
        <button
          onClick={testConnection}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
        >
          {loading ? 'Testing...' : 'Test Database Connection'}
        </button>
        
        {status && (
          <div className="p-4 bg-gray-100 rounded">
            <pre className="whitespace-pre-wrap">{status}</pre>
          </div>
        )}
        
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Setup Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Ensure your database is running and accessible</li>
            <li>Check that DATABASE_URL in .env is correct</li>
            <li>Run <code className="bg-gray-200 px-1 rounded">npm run db:setup</code> to create tables</li>
            <li>If using Supabase, verify your project is active</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
