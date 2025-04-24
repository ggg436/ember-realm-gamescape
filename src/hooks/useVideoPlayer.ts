
import { useState, useRef, useEffect } from 'react';
import { sendVideoMessage } from '@/utils/videoControl';

export const useVideoPlayer = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const controlsTimeoutRef = useRef<number | null>(null);

  const togglePlay = () => {
    if (iframeRef.current?.contentWindow) {
      const newIsPlaying = !isPlaying;
      sendVideoMessage(iframeRef.current.contentWindow, newIsPlaying ? 'play' : 'pause');
      // We'll let the video element's event listeners confirm the state change
      // rather than setting it here, for more reliable state management
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (iframeRef.current?.contentWindow) {
      sendVideoMessage(iframeRef.current.contentWindow, 'setVolume', newVolume / 100);
      // State will be updated via the volumechange event from the video
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    if (iframeRef.current?.contentWindow) {
      const newVolume = newMuted ? 0 : (volume > 0 ? volume : 50);
      setVolume(newVolume);
      sendVideoMessage(iframeRef.current.contentWindow, 'setVolume', newMuted ? 0 : newVolume / 100);
      // State will be updated via the volumechange event
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

  // Synchronize the volume state with the video element when the component mounts
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      sendVideoMessage(iframeRef.current.contentWindow, 'setVolume', volume / 100);
    }
  }, []);

  return {
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
  };
};
