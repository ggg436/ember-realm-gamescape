
import { useState, useRef, useEffect } from 'react';
import { sendVideoMessage } from '@/utils/videoControl';

export const useVideoPlayer = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const togglePlay = () => {
    if (iframeRef.current?.contentWindow) {
      sendVideoMessage(iframeRef.current.contentWindow, isPlaying ? 'pause' : 'play');
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (iframeRef.current?.contentWindow) {
      sendVideoMessage(iframeRef.current.contentWindow, 'setVolume', newVolume / 100);
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (iframeRef.current?.contentWindow) {
      const newVolume = newMuted ? 0 : 50;
      setVolume(newVolume);
      sendVideoMessage(iframeRef.current.contentWindow, 'setVolume', newVolume / 100);
    }
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(err => console.log(`Error exiting fullscreen: ${err.message}`));
    } else {
      const container = iframeRef.current?.parentElement;
      if (container) {
        container.requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch(err => console.log(`Error entering fullscreen: ${err.message}`));
      }
    }
  };

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
