// src/components/common/AudioButton.tsx
// High-quality Japanese speech playback button with speed control
import React, { useState } from 'react';
import { Volume2, VolumeX, Gauge } from 'lucide-react';
import { audioService } from '../../services/audioService';

interface AudioButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  showSpeedControl?: boolean;
  className?: string;
  label?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  text,
  size = 'md',
  showSpeedControl = false,
  className = '',
  label
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(0.95); // 0.72 = slow, 0.95 = normal

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-2.5 text-base'
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22
  };

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      audioService.stop();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    await audioService.speak(text, {
      rate: speed,
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false)
    });
  };

  const toggleSpeed = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSpeed((prev) => (prev > 0.8 ? 0.72 : 0.95));
  };

  const isSupported = audioService.isSupported();

  if (!isSupported) {
    return (
      <span className="text-kai-faint inline-flex items-center gap-1 text-xs" title="Audio unsupported in this environment">
        <VolumeX size={iconSizes[size]} />
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <button
        type="button"
        onClick={handlePlay}
        aria-label={label || `Play Japanese pronunciation for ${text}`}
        className={`relative inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 ${
          sizeClasses[size]
        } ${
          isPlaying
            ? 'bg-kai-vermilion text-white shadow-vermilion scale-105'
            : 'bg-kai-indigo-bg dark:bg-kai-dark-card text-kai-indigo dark:text-kai-vermilion-light hover:bg-kai-vermilion-bg hover:text-kai-vermilion'
        } border border-kai-border/60 dark:border-kai-dark-border focus:outline-none focus:ring-2 focus:ring-kai-vermilion/50`}
      >
        <Volume2 size={iconSizes[size]} className={isPlaying ? 'animate-pulse' : ''} />
        {label && <span className="ml-1.5 font-sans text-xs">{label}</span>}
      </button>

      {showSpeedControl && (
        <button
          type="button"
          onClick={toggleSpeed}
          title={`Audio Speed: ${speed < 0.8 ? 'Slow (0.7x)' : 'Normal (1.0x)'}`}
          className="text-2xs px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 font-mono flex items-center gap-1 border border-stone-200 dark:border-stone-700"
        >
          <Gauge size={10} />
          {speed < 0.8 ? '0.7x' : '1.0x'}
        </button>
      )}
    </div>
  );
};
