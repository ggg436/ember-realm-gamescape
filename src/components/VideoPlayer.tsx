
import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

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
      if (isPlaying) {
        iframeRef.current.contentWindow?.postMessage('pause', '*');
      } else {
        iframeRef.current.contentWindow?.postMessage('play', '*');
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage({ type: 'volume', value: newVolume / 100 }, '*');
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
        iframeRef.current.contentWindow?.postMessage({ type: 'volume', value: 0 }, '*');
      } else {
        setVolume(50);
        iframeRef.current.contentWindow?.postMessage({ type: 'volume', value: 0.5 }, '*');
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
          sandbox="allow-same-origin allow-scripts allow-presentation"
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
              className="text-white !rounded-button whitespace-nowrap"
            >
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={toggleMute}
              variant="ghost"
              size="sm"
              className="text-white !rounded-button whitespace-nowrap"
            >
              <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>
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
              className="text-white !rounded-button whitespace-nowrap"
            >
              <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
