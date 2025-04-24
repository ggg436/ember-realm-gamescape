import { useState, useRef, useEffect } from 'react';
import { sendVideoMessage } from '@/utils/videoMessages';

export const useVideoPlayer = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const scriptInjectedRef = useRef(false);
  const controlsTimeoutRef = useRef<number | null>(null);

  const togglePlay = () => {
    if (iframeRef.current?.contentWindow) {
      const newIsPlaying = !isPlaying;
      console.log(`Sending ${newIsPlaying ? 'play' : 'pause'} command`);
      sendVideoMessage(iframeRef.current.contentWindow, newIsPlaying ? 'play' : 'pause');
      
      // Optimistically update state with a small delay
      setTimeout(() => {
        setIsPlaying(newIsPlaying);
      }, 300);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (iframeRef.current?.contentWindow) {
      console.log(`Setting volume to ${newVolume / 100}`);
      sendVideoMessage(iframeRef.current.contentWindow, 'setVolume', newVolume / 100);
      
      // Update our state immediately
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (iframeRef.current?.contentWindow) {
      const newMuted = !isMuted;
      console.log(`Setting muted to ${newMuted}`);
      
      if (newMuted) {
        sendVideoMessage(iframeRef.current.contentWindow, 'mute');
      } else {
        const newVolume = volume > 0 ? volume : 50;
        sendVideoMessage(iframeRef.current.contentWindow, 'unmute');
        sendVideoMessage(iframeRef.current.contentWindow, 'setVolume', newVolume / 100);
      }
      
      // Update our state immediately
      setIsMuted(newMuted);
      if (!newMuted && volume === 0) {
        setVolume(50);
      }
    }
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(err => console.log(`Error exiting fullscreen: ${err.message}`));
    } else {
      const container = iframeRef.current?.closest('.video-container') || iframeRef.current?.parentElement;
      if (container) {
        container.requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch(err => console.log(`Error entering fullscreen: ${err.message}`));
      }
    }
  };

  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      // Wait a bit for iframe to load
      setTimeout(() => {
        sendVideoMessage(iframeRef.current!.contentWindow, 'setVolume', volume / 100);
      }, 1500);
    }
  }, [volume]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (iframeRef.current?.contentWindow) {
        // Re-apply current settings periodically to maintain control
        if (isPlaying) {
          sendVideoMessage(iframeRef.current.contentWindow, 'play');
        } else {
          sendVideoMessage(iframeRef.current.contentWindow, 'pause');
        }
        sendVideoMessage(iframeRef.current.contentWindow, 'setVolume', isMuted ? 0 : volume / 100);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, volume, isMuted]);

  return {
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
  };
};
