import React, { useState, useEffect } from 'react';

interface VideoPlayerProps {
  src: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (src) {
      setIsLoading(true);
    }
  }, [src]);

  if (!src) {
    return (
      <div className="w-full max-w-4xl mt-8 bg-gray-800 rounded-lg shadow-lg flex items-center justify-center aspect-video">
        <p className="text-gray-400">Enter a video URL to start streaming</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-4xl mt-8 bg-black rounded-lg shadow-2xl overflow-hidden aspect-video">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10" aria-label="Loading video">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
        </div>
      )}
      <video
        key={src} // Using key to force re-mount on src change, ensuring new video loads correctly
        className="w-full h-full"
        controls
        autoPlay
        preload="auto"
        src={src}
        onPlaying={() => setIsLoading(false)}
        onWaiting={() => setIsLoading(true)}
        onError={() => setIsLoading(false)}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;