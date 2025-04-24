
import React from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";

interface VideoControlsProps {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  onPlayToggle: () => void;
  onVolumeChange: (value: number[]) => void;
  onMuteToggle: () => void;
  onFullscreenToggle: () => void;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  isPlaying,
  volume,
  isMuted,
  isFullscreen,
  onPlayToggle,
  onVolumeChange,
  onMuteToggle,
  onFullscreenToggle,
}) => {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center">
        <Button
          onClick={onPlayToggle}
          variant="ghost"
          size="sm"
          className="text-white hover:text-red-500 transition-colors"
        >
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          onClick={onMuteToggle}
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
            onValueChange={onVolumeChange}
            className="w-full"
          />
        </div>
        <Button
          onClick={onFullscreenToggle}
          variant="ghost"
          size="sm"
          className="text-white hover:text-red-500 transition-colors"
        >
          {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
        </Button>
      </div>
    </div>
  );
};

export default VideoControls;
