'use client'

import { useState } from 'react'
import axios from 'axios'

export default function Home() {

  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const handleUpload = async () => {

    if (!file) return

    setLoading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {

      const response = await axios.post(
        'http://127.0.0.1:8000/search',
        formData
      )

      setResults(response.data.results)

    } catch (error) {
      console.log(error)
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white p-10">

      <h1 className="text-5xl font-bold mb-10">
        PimEyes Automation System
      </h1>

      <div className="bg-slate-800 p-8 rounded-xl max-w-xl">

        <input
          type="file"
          className="mb-5"
          onChange={(e) => {
            if (e.target.files) {
              setFile(e.target.files[0])
            }
          }}
        />

        <button
          onClick={handleUpload}
          className="bg-blue-600 px-6 py-3 rounded-lg"
        >
          {loading ? 'Searching...' : 'Start Search'}
        </button>

      </div>

      <div className="grid grid-cols-3 gap-5 mt-10">

        {results.map((item, index) => (
          <div
            key={index}
            className="bg-slate-800 p-4 rounded-xl"
          >

            <img
              src={item.image}
              alt="result"
              className="rounded-lg mb-3"
            />

            <p>
              Match Score: {item.score}%
            </p>

          </div>
        ))}

      </div>

    </main>
  )
}