
import React, { useEffect } from 'react';
import { useVideoPlayer } from '@/hooks/useVideoPlayer';
import { useScriptInjection } from '@/hooks/useScriptInjection';
import { useVideoMessageHandler } from '@/hooks/useVideoMessageHandler';
import VideoControls from './VideoControls';
import BreakingNews from './BreakingNews';
import { sendVideoMessage } from '@/utils/videoControl';

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

  const { injectionAttemptCountRef } = useScriptInjection(iframeRef, scriptInjectedRef);

  useVideoMessageHandler({
    setIsPlaying,
    setVolume,
    setIsMuted,
    scriptInjectedRef,
  });

  useEffect(() => {
    const setupPlayer = () => {
      if (iframeRef.current) {
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
  }, [volume, setIsFullscreen, iframeRef]);

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
    
    const timeout = setTimeout(checkControlsWorking, 15000);
    return () => clearTimeout(timeout);
  }, [injectionAttemptCountRef, scriptInjectedRef]);

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
        {breakingNews && <BreakingNews text={breakingNews} />}
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 p-2 flex flex-col z-50">
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
      <style>{`
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
