'use client';

import { useState } from 'react';
import axios from 'axios';

interface SearchResult {
  image?: string;
  url?: string;
  score?: number;
}

export default function Home() {

  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const [results, setResults] = useState<SearchResult[]>([]);

  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    if (e.target.files && e.target.files[0]) {

      setFile(e.target.files[0]);

      setError(null);
    }
  };

  const handleUpload = async () => {

    if (!file) {

      setError('Please select an image');

      return;
    }

    setLoading(true);

    setError(null);

    const formData = new FormData();

    formData.append('file', file);

    try {

      const response = await axios.post(
        'http://127.0.0.1:8000/search',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {

        setResults(response.data.results);

      } else {

        setError(response.data.error || 'Search failed');
      }

    } catch (err) {

      console.log(err);

      setError('Server connection failed');

    } finally {

      setLoading(false);
    }
  };

  return (

    <main className="min-h-screen bg-slate-900 text-white p-10 flex flex-col items-center">

      <h1 className="text-4xl font-bold mb-10 text-center tracking-tight">
        PimEyes Automation Dashboard
      </h1>

      <div
        className="
          bg-slate-800
          p-8
          rounded-xl
          w-full
          max-w-xl
          space-y-6
          shadow-2xl
          border
          border-slate-700
        "
      >

        <div
          className="
            border-2
            border-dashed
            border-slate-600
            p-10
            rounded-xl
            flex
            flex-col
            items-center
            justify-center
            hover:border-blue-500
            transition
            cursor-pointer
            relative
          "
        >

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="
              absolute
              inset-0
              opacity-0
              cursor-pointer
              w-full
              h-full
            "
          />

          <div className="text-center space-y-2 pointer-events-none">

            <p className="font-medium text-slate-300">

              {file
                ? `Selected: ${file.name}`
                : 'Click or Drag & Drop face image here'}

            </p>

            <p className="text-xs text-slate-500">
              Supports PNG, JPG, JPEG
            </p>

          </div>

        </div>

        {error && (

          <div
            className="
              bg-red-500/10
              border
              border-red-500/50
              text-red-400
              p-3
              rounded-lg
              text-sm
              text-center
            "
          >

            {error}

          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          className="
            w-full
            bg-blue-600
            hover:bg-blue-700
            disabled:bg-blue-800
            disabled:opacity-50
            text-white
            font-semibold
            py-3
            px-6
            rounded-lg
            transition
            shadow-lg
          "
        >

          {loading ? (

            <span className="animate-pulse">
              Searching face match...
            </span>

          ) : (

            'Start Automation Search'

          )}

        </button>

      </div>

      {results.length > 0 && (

        <div className="w-full max-w-6xl mt-12">

          <h2 className="text-2xl font-bold mb-6 text-slate-200">

            Search Results ({results.length})

          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

            {results.map((item, index) => (

              <div
                key={index}
                className="
                  bg-slate-800
                  border
                  border-slate-700
                  rounded-xl
                  overflow-hidden
                  shadow-xl
                  hover:scale-[1.02]
                  transition
                  duration-200
                  group
                "
              >

                <div className="h-60 bg-slate-950 overflow-hidden">

                  <img
                    src={
                      item.image ||
                      item.url ||
                      'https://via.placeholder.com/300'
                    }
                    alt={`Result ${index + 1}`}
                    className="
                      w-full
                      h-full
                      object-cover
                      group-hover:scale-105
                      transition
                      duration-300
                    "
                  />

                </div>

                <div className="p-4">

                  <div className="flex justify-between items-center">

                    <p className="text-slate-300">
                      Face Match
                    </p>

                    <p className="text-green-400 font-semibold">

                      {item.score || 0}%

                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      )}

    </main>
  );
}