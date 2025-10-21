import React, { useState, useCallback, useEffect } from 'react';
import VideoPlayer from './components/VideoPlayer';

// A simple SVG icon for the play button, defined outside the main component to prevent re-creation on re-renders.
const PlayIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const App: React.FC = () => {
  const [inputUrl, setInputUrl] = useState<string>('');
  const [streamUrl, setStreamUrl] = useState<string>('');
  const [playerKey, setPlayerKey] = useState<number>(Date.now());

  useEffect(() => {
    // On initial load, try to get the last streamed URL from localStorage
    const savedUrl = localStorage.getItem('lastStreamUrl');
    if (savedUrl) {
      setInputUrl(savedUrl);
      setStreamUrl(savedUrl);
    }
  }, []);

  const handleStream = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      setStreamUrl(inputUrl);
      // Save the new URL to localStorage
      localStorage.setItem('lastStreamUrl', inputUrl);
      // Change the key to force re-mount of the VideoPlayer, ensuring it reloads progress
      setPlayerKey(Date.now());
    }
  }, [inputUrl]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans relative">
      <div className="w-full max-w-4xl flex flex-col items-center">
        
        <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Universal Video Streamer
            </h1>
            <p className="text-gray-400 mt-2 text-lg">
                Paste any direct video link and start watching instantly.
            </p>
        </header>

        <main className="w-full p-6 bg-gray-800 bg-opacity-50 rounded-xl shadow-lg backdrop-blur-md border border-gray-700">
            <form onSubmit={handleStream} className="flex flex-col sm:flex-row gap-4">
                <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://example.com/video.mkv"
                    className="flex-grow bg-gray-700 text-white placeholder-gray-500 px-4 py-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                />
                <button
                    type="submit"
                    className="flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={!inputUrl.trim()}
                >
                    <PlayIcon />
                    Stream
                </button>
            </form>
        </main>
        
        <VideoPlayer key={playerKey} src={streamUrl} />
        
      </div>
       <footer className="absolute bottom-4 text-gray-500 text-sm">
        created by skillneast
      </footer>
    </div>
  );
};

export default App;