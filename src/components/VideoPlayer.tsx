
import React, { useEffect, useRef } from 'react';
import { useVideoPlayer } from '@/hooks/useVideoPlayer';
import VideoControls from './VideoControls';
import { getVideoControllerScript } from '@/utils/videoControl';

interface VideoPlayerProps {
  src: string;
  breakingNews?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, breakingNews }) => {
  const {
    iframeRef,
    isPlaying,
    volume,
    isMuted,
    isFullscreen,
    setIsPlaying,
    setVolume,
    setIsMuted,
    setIsFullscreen,
    togglePlay,
    handleVolumeChange,
    toggleMute,
    toggleFullscreen,
  } = useVideoPlayer();
  
  const scriptInjectedRef = useRef(false);

  useEffect(() => {
    const setupPlayer = () => {
      if (iframeRef.current) {
        // Initialize with a delay to ensure the iframe has loaded
        setTimeout(() => {
          try {
            iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ 
              action: 'initialize' 
            }), '*');
            
            iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ 
              action: 'setVolume', 
              value: volume / 100 
            }), '*');
          } catch (error) {
            console.error('Error initializing video player:', error);
          }
        }, 2000);
      }
    };

    setupPlayer();

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [volume, setIsFullscreen]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        let data = event.data;
        if (typeof data === 'string') {
          data = JSON.parse(data);
        }
        
        if (data && typeof data === 'object') {
          switch (data.action) {
            case 'playing':
              setIsPlaying(true);
              break;
            case 'paused':
              setIsPlaying(false);
              break;
            case 'volumeChange':
              setVolume(data.value * 100);
              setIsMuted(data.value === 0);
              break;
            case 'scriptLoaded':
              console.log('Video controller script loaded successfully');
              break;
          }
        }
      } catch (error) {
        console.error('Error handling message:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [setIsPlaying, setVolume, setIsMuted]);

  useEffect(() => {
    const injectControllerScript = () => {
      if (iframeRef.current && !scriptInjectedRef.current) {
        try {
          const iframe = iframeRef.current;
          
          // Function to inject script
          const injectScript = () => {
            iframe.contentWindow?.postMessage(
              JSON.stringify({ 
                action: 'injectScript', 
                script: getVideoControllerScript() 
              }),
              '*'
            );
            scriptInjectedRef.current = true;
          };
          
          if (iframe.contentWindow) {
            // Try immediate injection
            injectScript();
            
            // Also set it on load in case iframe reloads
            iframe.onload = () => {
              setTimeout(injectScript, 1500);
            };
            
            // Periodically try to inject the script to ensure it gets in
            const interval = setInterval(() => {
              if (!scriptInjectedRef.current) {
                injectScript();
              } else {
                clearInterval(interval);
              }
            }, 2000);
            
            // Clear interval after 20 seconds to avoid infinite attempts
            setTimeout(() => clearInterval(interval), 20000);
          }
        } catch (error) {
          console.error('Failed to inject controller script:', error);
        }
      }
    };

    injectControllerScript();
  }, []);

  return (
    <div className="relative w-full video-container">
      <div className="relative w-full aspect-video">
        <iframe 
          ref={iframeRef}
          src={src}
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen
          allow="encrypted-media; autoplay; fullscreen"
          sandbox="allow-same-origin allow-scripts allow-presentation allow-fullscreen"
        />
        {breakingNews && (
          <div className="absolute bottom-24 left-0 right-0 bg-red-800 text-white py-2 px-4">
            <h2 className="text-xl font-bold">{breakingNews}</h2>
          </div>
        )}
      </div>
      <div 
        className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 p-2 flex flex-col z-50"
      >
        <VideoControls
          isPlaying={isPlaying}
          volume={volume}
          isMuted={isMuted}
          isFullscreen={isFullscreen}
          onPlayToggle={togglePlay}
          onVolumeChange={handleVolumeChange}
          onMuteToggle={toggleMute}
          onFullscreenToggle={toggleFullscreen}
        />
      </div>
      <style>
        {`
        .video-container:fullscreen .controls-container {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 9999;
        }
      `}
      </style>
    </div>
  );
};

export default VideoPlayer;
