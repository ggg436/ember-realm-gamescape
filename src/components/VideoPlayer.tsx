
import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  breakingNews?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, breakingNews }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const togglePlay = () => {
    if (iframeRef.current) {
      try {
        if (isPlaying) {
          iframeRef.current.contentWindow?.postMessage({ action: 'pause' }, '*');
        } else {
          iframeRef.current.contentWindow?.postMessage({ action: 'play' }, '*');
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error('Error toggling play state:', error);
      }
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage({ action: 'setVolume', value: newVolume / 100 }, '*');
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (iframeRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      if (newMuted) {
        setVolume(0);
        iframeRef.current.contentWindow?.postMessage({ action: 'setVolume', value: 0 }, '*');
      } else {
        setVolume(50);
        iframeRef.current.contentWindow?.postMessage({ action: 'setVolume', value: 0.5 }, '*');
      }
    }
  };

  const toggleFullscreen = () => {
    if (iframeRef.current) {
      if (!document.fullscreenElement) {
        iframeRef.current.requestFullscreen().catch(err => {
          console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Listen for messages from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Make sure the message is from our iframe
      if (event.source === iframeRef.current?.contentWindow) {
        const data = event.data;
        
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
            case 'fullscreenChange':
              setIsFullscreen(data.value);
              break;
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className="relative w-full">
      <div className="relative w-full aspect-video">
        <iframe 
          ref={iframeRef}
          src={src}
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen
          allow="encrypted-media"
          sandbox="allow-same-origin allow-scripts allow-presentation allow-fullscreen"
        />
        {breakingNews && (
          <div className="absolute bottom-24 left-0 right-0 bg-red-800 text-white py-2 px-4">
            <h2 className="text-xl font-bold">{breakingNews}</h2>
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 p-2 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Button
              onClick={togglePlay}
              variant="ghost"
              size="sm"
              className="text-white hover:text-red-500 transition-colors"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={toggleMute}
              variant="ghost"
              size="sm"
              className="text-white hover:text-red-500 transition-colors"
            >
              {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
            </Button>
            <div className="w-24">
              <Slider
                value={[volume]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="w-full"
              />
            </div>
            <Button
              onClick={toggleFullscreen}
              variant="ghost"
              size="sm"
              className="text-white hover:text-red-500 transition-colors"
            >
              {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
