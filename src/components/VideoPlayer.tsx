
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
  const controllerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const togglePlay = () => {
    if (iframeRef.current) {
      try {
        if (isPlaying) {
          iframeRef.current.contentWindow?.postMessage(JSON.stringify({ action: 'pause' }), '*');
        } else {
          iframeRef.current.contentWindow?.postMessage(JSON.stringify({ action: 'play' }), '*');
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
      iframeRef.current.contentWindow?.postMessage(JSON.stringify({ 
        action: 'setVolume', 
        value: newVolume / 100 
      }), '*');
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
        iframeRef.current.contentWindow?.postMessage(JSON.stringify({ 
          action: 'setVolume', 
          value: 0 
        }), '*');
      } else {
        setVolume(50);
        iframeRef.current.contentWindow?.postMessage(JSON.stringify({ 
          action: 'setVolume', 
          value: 0.5 
        }), '*');
      }
    }
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.log(`Error exiting fullscreen: ${err.message}`);
      });
    } else {
      const container = iframeRef.current?.parentElement;
      if (container) {
        container.requestFullscreen().then(() => {
          setIsFullscreen(true);
        }).catch(err => {
          console.log(`Error entering fullscreen: ${err.message}`);
        });
      }
    }
  };

  // Initialize the player and set up event listeners
  useEffect(() => {
    const setupPlayer = () => {
      if (iframeRef.current) {
        // Initial setup messages
        setTimeout(() => {
          iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ action: 'initialize' }), '*');
          iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ 
            action: 'setVolume', 
            value: volume / 100 
          }), '*');
        }, 1000);
      }
    };

    setupPlayer();

    // Add event listeners for fullscreen changes
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [volume]);

  // Listen for messages from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        // Try to parse the message if it's a string
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
            case 'fullscreenChange':
              setIsFullscreen(data.value);
              break;
          }
        }
      } catch (error) {
        // Silently ignore parsing errors
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Inject controller script into iframe
  useEffect(() => {
    const injectControllerScript = () => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        try {
          const iframe = iframeRef.current;
          iframe.onload = () => {
            setTimeout(() => {
              const script = `
                // Listen for messages from the parent window
                window.addEventListener('message', function(event) {
                  try {
                    let data = event.data;
                    if (typeof data === 'string') {
                      data = JSON.parse(data);
                    }
                    
                    if (data && data.action) {
                      const videos = document.querySelectorAll('video');
                      if (videos.length > 0) {
                        videos.forEach(function(video) {
                          switch(data.action) {
                            case 'play':
                              video.play();
                              break;
                            case 'pause':
                              video.pause();
                              break;
                            case 'setVolume':
                              video.volume = data.value;
                              break;
                          }
                        });
                      }
                    }
                  } catch (e) {
                    console.error('Error processing message:', e);
                  }
                });

                // Send video events back to the parent
                document.querySelectorAll('video').forEach(function(video) {
                  video.addEventListener('play', function() {
                    window.parent.postMessage(JSON.stringify({ action: 'playing' }), '*');
                  });
                  video.addEventListener('pause', function() {
                    window.parent.postMessage(JSON.stringify({ action: 'paused' }), '*');
                  });
                  video.addEventListener('volumechange', function() {
                    window.parent.postMessage(JSON.stringify({ 
                      action: 'volumeChange', 
                      value: video.volume 
                    }), '*');
                  });
                });
              `;

              iframe.contentWindow?.postMessage(
                JSON.stringify({ action: 'injectScript', script: script }),
                '*'
              );
            }, 1500);
          };
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
        ref={controllerRef}
        className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 p-2 flex flex-col z-50"
      >
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
      <style jsx>{`
        :global(.video-container:fullscreen .controls-container) {
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
