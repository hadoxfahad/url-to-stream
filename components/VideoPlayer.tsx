import React, { useState, useEffect, useRef, useCallback } from 'react';

declare global {
  interface Window {
    Hls: any;
  }
}

interface VideoPlayerProps {
  src: string;
}

const PlayIcon = () => (
  <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20"><path d="M4.018 15.132A1.25 1.25 0 006 14.188V5.812a1.25 1.25 0 00-1.982-.944l-7.258 4.188a1.25 1.25 0 000 1.888l7.258 4.188z" /></svg>
);
const PauseIcon = () => (
  <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20"><path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" /></svg>
);
const VolumeHighIcon = () => (
  <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20"><path d="M9.25 4.75a.75.75 0 00-1.5 0v10.5a.75.75 0 001.5 0V4.75zM6.25 7a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0V7zM12.25 2.25a.75.75 0 00-1.5 0v15.5a.75.75 0 001.5 0V2.25zM15.25 7a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0V7zM3.25 9.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z" /></svg>
);
const VolumeMutedIcon = () => (
  <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20"><path d="M16.72 6.72a.75.75 0 00-1.06-1.06L10 10.94 4.34 5.66a.75.75 0 00-1.06 1.06l5.66 5.66-5.66 5.66a.75.75 0 101.06 1.06L10 13.06l5.66 5.66a.75.75 0 001.06-1.06L11.06 12l5.66-5.28z" /></svg>
);
const FullscreenEnterIcon = () => (
  <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20"><path d="M9.25 2.75a.75.75 0 00-1.5 0V6h-3.25a.75.75 0 000 1.5H8v3.25a.75.75 0 001.5 0V7.5h3.25a.75.75 0 000-1.5H9.5V2.75zM6 11.75a.75.75 0 00-1.5 0V15h-2.75a.75.75 0 000 1.5H4.5v2.75a.75.75 0 001.5 0V16.5h2.75a.75.75 0 000-1.5H6v-3.25zm7.5 4a.75.75 0 000-1.5H12v-3.25a.75.75 0 00-1.5 0V15h-3.25a.75.75 0 000 1.5H12v2.75a.75.75 0 001.5 0V16.5h2.75z" /></svg>
);
const FullscreenExitIcon = () => (
  <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20"><path d="M2.75 6.5a.75.75 0 000-1.5H6V1.75a.75.75 0 00-1.5 0V5H1.75a.75.75 0 00-1.5 0V8.25c0 .414.336.75.75.75h3.25a.75.75 0 000-1.5H2.75V6.5zm14.5 0a.75.75 0 00-1.5 0V8h-2.75a.75.75 0 000 1.5H15v2.75a.75.75 0 001.5 0V9.5h2.75a.75.75 0 000-1.5H16.5V6.5zm-1.5 9.25a.75.75 0 001.5 0V13h2.75a.75.75 0 000-1.5H17v-2.75a.75.75 0 00-1.5 0V12h-2.75a.75.75 0 000 1.5H16.5v2.75zM4.25 12a.75.75 0 000 1.5H7.5v2.75a.75.75 0 001.5 0V13.5H12a.75.75 0 000-1.5H8.75V9.25a.75.75 0 00-1.5 0V12H4.25z" /></svg>
);
const DownloadIcon = () => (
    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
);
const EnterPiPIcon = () => (
    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z"/>
    </svg>
);
const ExitPiPIcon = () => (
    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z"/>
    </svg>
);
const ForwardIcon = () => (
  <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20"><path d="M4.5 5.5a.5.5 0 00-.5.5v8a.5.5 0 00.75.433l6-4a.5.5 0 000-.866l-6-4a.5.5 0 00-.25-.067zM10.5 5.5a.5.5 0 00-.5.5v8a.5.5 0 00.75.433l6-4a.5.5 0 000-.866l-6-4a.5.5 0 00-.25-.067z" /></svg>
);
const BackwardIcon = () => (
  <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20"><path d="M15.5 5.5a.5.5 0 01.5.5v8a.5.5 0 01-.75.433l-6-4a.5.5 0 010-.866l6-4a.5.5 0 01.25-.067zM9.5 5.5a.5.5 0 01.5.5v8a.5.5 0 01-.75.433l-6-4a.5.5 0 010-.866l6-4a.5.5 0 01.25-.067z" /></svg>
);

const formatTime = (timeInSeconds: number): string => {
    const date = new Date(0);
    date.setSeconds(timeInSeconds || 0);
    return date.toISOString().substr(11, 8);
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [areControlsVisible, setAreControlsVisible] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isInPiP, setIsInPiP] = useState(false);
  const [isPiPSupported, setIsPiPSupported] = useState(false);
  const [feedback, setFeedback] = useState<{ icon: React.ReactElement; text: string; key: number } | null>(null);

  const controlsTimeout = useRef<number | null>(null);
  const feedbackTimeout = useRef<number | null>(null);
  const lastSaveTime = useRef(0);

  const showFeedback = useCallback((icon: React.ReactElement, text: string = '') => {
    if (feedbackTimeout.current) {
        clearTimeout(feedbackTimeout.current);
    }
    setFeedback({ icon, text, key: Date.now() });
    feedbackTimeout.current = window.setTimeout(() => {
        setFeedback(null);
    }, 800);
  }, []);

  const saveProgress = useCallback((time: number) => {
    if (!src) return;
    try {
        const progresses = JSON.parse(localStorage.getItem('videoProgress') || '{}');
        progresses[src] = time;
        localStorage.setItem('videoProgress', JSON.stringify(progresses));
    } catch (e) {
        console.error("Failed to save progress", e);
    }
  }, [src]);

  useEffect(() => {
    const handleBeforeUnload = () => {
        if (videoRef.current && src) {
            saveProgress(videoRef.current.currentTime);
        }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        handleBeforeUnload();
    };
  }, [src, saveProgress]);

  useEffect(() => {
    if ('pictureInPictureEnabled' in document) {
        setIsPiPSupported(true);
    }
  }, []);

  const hideControls = useCallback(() => {
    if (isPlaying) {
      setAreControlsVisible(false);
    }
  }, [isPlaying]);

  const showControls = useCallback(() => {
    setAreControlsVisible(true);
    if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
    }
    controlsTimeout.current = window.setTimeout(hideControls, 3000);
  }, [hideControls]);

  useEffect(() => {
      const container = containerRef.current;
      if (container) {
          container.addEventListener('mousemove', showControls);
          container.addEventListener('mouseleave', hideControls);
      }
      return () => {
          if (container) {
              container.removeEventListener('mousemove', showControls);
              container.removeEventListener('mouseleave', hideControls);
          }
           if (controlsTimeout.current) {
                clearTimeout(controlsTimeout.current);
            }
      }
  }, [showControls, hideControls])


  useEffect(() => {
    if (!src) return;
    setIsLoading(true);
    const video = videoRef.current;
    if (!video) return;
    setProgress(0);
    let hls: any;
    if (src.endsWith('.m3u8') && window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
      video.src = src;
    }
    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const handlePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      showFeedback(video.paused ? <PlayIcon /> : <PauseIcon />, '');
      if (video.paused) {
        video.play().catch(console.error);
      } else {
        video.pause();
      }
    }
  }, [showFeedback]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (video) {
      const newVolume = parseFloat(e.target.value);
      setVolume(newVolume);
      video.volume = newVolume;
      if (newVolume > 0 && isMuted) {
        setIsMuted(false);
        video.muted = false;
      }
    }
  };

  const handleMuteToggle = useCallback(() => {
    const video = videoRef.current;
    if (video) {
        const newMuted = !video.muted;
        showFeedback(newMuted ? <VolumeMutedIcon /> : <VolumeHighIcon />, '');
        setIsMuted(newMuted);
        video.muted = newMuted;
    }
  }, [showFeedback]);

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (video) {
      const newTime = parseFloat(e.target.value);
      video.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
        setProgress(video.currentTime);
        const now = Date.now();
        if (now - lastSaveTime.current > 5000) {
            saveProgress(video.currentTime);
            lastSaveTime.current = now;
        }
    }
  };
  
  const handleLoadedMetadata = () => {
      const video = videoRef.current;
      if (video) {
        setDuration(video.duration);
        try {
            const progresses = JSON.parse(localStorage.getItem('videoProgress') || '{}');
            const savedTime = progresses[src];
            if (savedTime && savedTime > 0 && savedTime < video.duration) {
                video.currentTime = savedTime;
                setProgress(savedTime);
            }
        } catch (e) {
            console.error("Failed to load progress", e);
        }
      }
  }

  const toggleFullScreen = useCallback(() => {
    const container = containerRef.current;
    showFeedback(!document.fullscreenElement ? <FullscreenEnterIcon /> : <FullscreenExitIcon />, '');
    if (!document.fullscreenElement) {
        container?.requestFullscreen().catch(err => {
          alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        document.exitFullscreen();
    }
  }, [showFeedback]);

    const handlePlaybackRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPlaybackRate(parseFloat(e.target.value));
    };

    const handleDownload = useCallback(() => {
        if (!src) return;
        showFeedback(<DownloadIcon />, '');
        try {
            const link = document.createElement('a');
            link.href = src;
            const filename = src.split('/').pop()?.split('?')[0] || 'video';
            link.setAttribute('download', filename);
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Download failed:", error);
            window.open(src, '_blank');
        }
    }, [src, showFeedback]);

    const handleTogglePiP = useCallback(() => {
      if (!isPiPSupported || !videoRef.current) return;
      
      const videoElement = videoRef.current;
      
      if (document.pictureInPictureElement === videoElement) {
          document.exitPictureInPicture().catch(err => {
              console.error("Failed to exit PiP mode:", err);
          });
      } else {
          videoElement.requestPictureInPicture().catch(err => {
              console.error("Failed to enter PiP mode:", err);
          });
      }
    }, [isPiPSupported]);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if ((event.target as HTMLElement).tagName === 'INPUT') return;

        const video = videoRef.current;
        if (!video) return;

        switch (event.key) {
            case ' ':
                event.preventDefault();
                handlePlayPause();
                break;
            case 'ArrowRight':
                video.currentTime = Math.min(video.duration, video.currentTime + 5);
                showFeedback(<ForwardIcon />, "+5s");
                break;
            case 'ArrowLeft':
                video.currentTime = Math.max(0, video.currentTime - 5);
                showFeedback(<BackwardIcon />, "-5s");
                break;
            case 'ArrowUp':
                event.preventDefault();
                const newVolumeUp = Math.min(1, video.volume + 0.1);
                video.volume = newVolumeUp;
                setVolume(newVolumeUp);
                showFeedback(<VolumeHighIcon />, `${Math.round(newVolumeUp * 100)}%`);
                if (newVolumeUp > 0) {
                    setIsMuted(false);
                    video.muted = false;
                }
                break;
            case 'ArrowDown':
                event.preventDefault();
                const newVolumeDown = Math.max(0, video.volume - 0.1);
                video.volume = newVolumeDown;
                setVolume(newVolumeDown);
                showFeedback(<VolumeHighIcon />, `${Math.round(newVolumeDown * 100)}%`);
                break;
            case 'm':
            case 'M':
                handleMuteToggle();
                break;
            case 'f':
            case 'F':
                toggleFullScreen();
                break;
        }
    }, [handlePlayPause, handleMuteToggle, toggleFullScreen, showFeedback]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    const handleFullscreenChange = () => {
        setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }
  }, [handleKeyDown]);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isPiPSupported) return;

    const onEnterPiP = () => setIsInPiP(true);
    const onLeavePiP = () => setIsInPiP(false);
    
    video.addEventListener('enterpictureinpicture', onEnterPiP);
    video.addEventListener('leavepictureinpicture', onLeavePiP);
    
    return () => {
        video.removeEventListener('enterpictureinpicture', onEnterPiP);
        video.removeEventListener('leavepictureinpicture', onLeavePiP);
    };
}, [isPiPSupported]);


  if (!src) {
    return (
      <div className="w-full max-w-4xl mt-8 bg-gray-800 rounded-lg shadow-lg flex items-center justify-center aspect-video">
        <p className="text-gray-400">Enter a video URL to start streaming</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-4xl mt-8 bg-black rounded-lg shadow-2xl overflow-hidden aspect-video group" tabIndex={0}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20" aria-label="Loading video">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
        </div>
      )}
      {feedback && (
        <div key={feedback.key} className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div className="bg-black bg-opacity-60 rounded-full p-4 md:p-5 flex flex-col items-center justify-center gap-2 animate-fade-in-out">
                <div className="w-8 h-8 md:w-10 md:h-10 text-white">{feedback.icon}</div>
                {feedback.text && <span className="text-white text-base md:text-lg font-bold select-none">{feedback.text}</span>}
            </div>
        </div>
      )}
      <video
        ref={videoRef}
        className="w-full h-full"
        autoPlay
        preload="auto"
        onPlaying={() => { setIsLoading(false); setIsPlaying(true); showControls(); }}
        onPause={() => {
            setIsPlaying(false);
            setAreControlsVisible(true);
            if (controlsTimeout.current) {
                clearTimeout(controlsTimeout.current);
            }
        }}
        onWaiting={() => setIsLoading(true)}
        onError={() => setIsLoading(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onVolumeChange={() => {
            if(videoRef.current){
                setVolume(videoRef.current.volume);
                setIsMuted(videoRef.current.muted);
            }
        }}
        onClick={handlePlayPause}
        onDoubleClick={toggleFullScreen}
      >
        Your browser does not support the video tag.
      </video>
      <div className={`absolute bottom-0 left-0 right-0 p-2 md:p-4 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 z-20 ${areControlsVisible ? 'opacity-100' : 'opacity-0'}`}>
         <div className="flex items-center gap-2 text-white">
            <span className="text-sm font-mono">{formatTime(progress)}</span>
            <input
                type="range"
                min="0"
                max={duration}
                value={progress}
                onChange={handleProgressChange}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm"
                style={{backgroundSize: `${(progress / duration) * 100}% 100%`}}
            />
            <span className="text-sm font-mono">{formatTime(duration)}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 md:gap-4">
                 <button onClick={handlePlayPause} className="text-white hover:text-purple-400 transition w-5 h-5" aria-label={isPlaying ? 'Pause' : 'Play'}>
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>
                 <div className="flex items-center gap-2">
                    <button onClick={handleMuteToggle} className="text-white hover:text-purple-400 transition w-5 h-5" aria-label={isMuted ? 'Unmute' : 'Mute'}>
                        {isMuted || volume === 0 ? <VolumeMutedIcon /> : <VolumeHighIcon />}
                    </button>
                    <input
                        type="range"
                        aria-label="Volume"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-16 md:w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm"
                         style={{backgroundSize: `${isMuted ? 0 : volume * 100}% 100%`}}
                    />
                 </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
                 <select
                    onChange={handlePlaybackRateChange}
                    value={playbackRate}
                    aria-label="Playback speed"
                    className="bg-transparent text-white font-mono text-sm rounded focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                    <option className="bg-gray-800" value="0.5">0.5x</option>
                    <option className="bg-gray-800" value="1">1x</option>
                    <option className="bg-gray-800" value="1.5">1.5x</option>
                    <option className="bg-gray-800" value="2">2x</option>
                </select>
                <button onClick={handleDownload} className="text-white hover:text-purple-400 transition w-5 h-5" aria-label="Download Video">
                    <DownloadIcon />
                </button>
                {isPiPSupported && (
                    <button onClick={handleTogglePiP} className="text-white hover:text-purple-400 transition w-5 h-5" aria-label={isInPiP ? 'Exit Picture-in-Picture' : 'Enter Picture-in-Picture'}>
                        {isInPiP ? <ExitPiPIcon /> : <EnterPiPIcon />}
                    </button>
                )}
                <button onClick={toggleFullScreen} className="text-white hover:text-purple-400 transition w-5 h-5" aria-label={isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}>
                    {isFullScreen ? <FullscreenExitIcon /> : <FullscreenEnterIcon />}
                </button>
            </div>
        </div>
      </div>
       <style>{`
          @keyframes fadeInOut {
            0%, 100% { opacity: 0; transform: scale(0.8); }
            15%, 85% { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in-out {
              animation: fadeInOut 0.8s ease-in-out forwards;
          }
          input[type=range] {
            -webkit-appearance: none;
            width: 100%;
            background: transparent;
          }

          input[type=range]::-webkit-slider-runnable-track {
            width: 100%;
            height: 4px;
            cursor: pointer;
            background: rgba(255,255,255,0.3);
            border-radius: 5px;
          }

          input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #a855f7;
            cursor: pointer;
            margin-top: -6px;
          }
           input[type=range].range-sm::-webkit-slider-thumb {
             height: 12px;
             width: 12px;
             margin-top: -4px;
           }

          input[type=range]:focus::-webkit-slider-runnable-track {
            background: rgba(255,255,255,0.5);
          }
          
          input[type=range] {
              background-image: linear-gradient(to right, #a855f7, #a855f7);
              background-repeat: no-repeat;
          }

          select {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            padding: 2px 6px;
          }
        `}</style>
    </div>
  );
};

export default VideoPlayer;