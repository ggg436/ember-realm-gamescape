
import { useEffect } from 'react';

interface MessageHandlerProps {
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setIsMuted: (isMuted: boolean) => void;
  scriptInjectedRef: { current: boolean };
}

export const useVideoMessageHandler = ({
  setIsPlaying,
  setVolume,
  setIsMuted,
  scriptInjectedRef,
}: MessageHandlerProps) => {
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
  }, [setIsPlaying, setVolume, setIsMuted, scriptInjectedRef]);
};
