
import React, { useEffect, useRef } from 'react';
import { useVideoPlayer } from '@/hooks/useVideoPlayer';
import VideoControls from './VideoControls';
import { getVideoControllerScript, sendVideoMessage } from '@/utils/videoControl';

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
    scriptInjectedRef,
    setIsPlaying,
    setVolume,
    setIsMuted,
    setIsFullscreen,
    togglePlay,
    handleVolumeChange,
    toggleMute,
    toggleFullscreen,
  } = useVideoPlayer();
  
  const injectionAttemptCountRef = useRef(0);

  useEffect(() => {
    const setupPlayer = () => {
      if (iframeRef.current) {
        // Initialize with a delay to ensure the iframe has loaded
        setTimeout(() => {
          try {
            console.log('Initializing video player...');
            if (iframeRef.current?.contentWindow) {
              sendVideoMessage(iframeRef.current.contentWindow, 'initialize');
              sendVideoMessage(iframeRef.current.contentWindow, 'setVolume', volume / 100);
            }
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
          console.log('Received message from iframe:', data.action);
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
              scriptInjectedRef.current = true;
              break;
            case 'statusUpdate':
              if (data.playing !== undefined) setIsPlaying(data.playing);
              if (data.volume !== undefined) setVolume(data.volume * 100);
              if (data.muted !== undefined) setIsMuted(data.muted);
              break;
          }
        }
      } catch (error) {
        // Ignore parsing errors from other messages
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [setIsPlaying, setVolume, setIsMuted]);

  // Improved script injection
  const injectScript = () => {
    if (iframeRef.current && !scriptInjectedRef.current) {
      try {
        console.log('Attempting to inject control script...');
        const iframe = iframeRef.current;
        
        // The script we want to inject
        const scriptContent = getVideoControllerScript();
        
        // Method 1: Try direct script injection
        try {
          if (iframe.contentWindow && iframe.contentDocument) {
            const script = iframe.contentDocument.createElement('script');
            script.textContent = scriptContent;
            iframe.contentDocument.head.appendChild(script);
            scriptInjectedRef.current = true;
            console.log('Direct script injection successful');
          }
        } catch (e) {
          console.log('Direct injection failed:', e);
        }
        
        // Method 2: Try postMessage to have iframe eval script
        if (!scriptInjectedRef.current) {
          iframe.contentWindow?.postMessage(
            JSON.stringify({ 
              action: 'injectScript', 
              script: scriptContent 
            }),
            '*'
          );
          injectionAttemptCountRef.current++;
          console.log('Attempted postMessage script injection');
        }
        
      } catch (error) {
        console.error('Failed to inject controller script:', error);
      }
    }
  };
  
  // Attempt script injection on load and periodically
  useEffect(() => {
    // On iframe load
    const onLoad = () => {
      console.log('Iframe loaded, injecting script...');
      setTimeout(injectScript, 1000);
    };
    
    if (iframeRef.current) {
      iframeRef.current.addEventListener('load', onLoad);
      
      // Also try immediately
      setTimeout(injectScript, 1000);
      
      // And periodically for reliability
      const interval = setInterval(() => {
        if (!scriptInjectedRef.current && injectionAttemptCountRef.current < 10) {
          injectScript();
        } else {
          clearInterval(interval);
        }
      }, 2000);
      
      return () => {
        iframeRef.current?.removeEventListener('load', onLoad);
        clearInterval(interval);
      };
    }
  }, []);
  
  // Force the iframe to reload if controls are not working after multiple attempts
  useEffect(() => {
    const checkControlsWorking = () => {
      if (injectionAttemptCountRef.current >= 8 && !scriptInjectedRef.current) {
        console.log('Controls not working, reloading iframe...');
        if (iframeRef.current) {
          const currentSrc = iframeRef.current.src;
          iframeRef.current.src = '';
          setTimeout(() => {
            if (iframeRef.current) iframeRef.current.src = currentSrc;
            injectionAttemptCountRef.current = 0;
          }, 500);
        }
      }
    };
    
    // Check after 15 seconds
    const timeout = setTimeout(checkControlsWorking, 15000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative w-full video-container">
      <div className="relative w-full aspect-video">
        <iframe 
          ref={iframeRef}
          src={src}
          className="w-full h-full bg-black"
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
      <style jsx>{`
        .video-container:fullscreen .controls-container {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 9999;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;
