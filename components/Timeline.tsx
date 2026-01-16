
import React, { useState, useEffect, useRef } from 'react';
import { Theme, TimeSeriesPoint } from '../types';

interface TimelineProps {
  value: number;
  onChange: (val: number | ((prev: number) => number)) => void;
  history: TimeSeriesPoint[];
  theme: Theme;
  colorBlindMode?: boolean;
}

const Timeline: React.FC<TimelineProps> = ({ value, onChange, history, theme, colorBlindMode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const playRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      playRef.current = window.setInterval(() => {
        onChange((prev: number) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 1;
        });
      }, 200);
    } else if (playRef.current) {
      clearInterval(playRef.current);
    }
    return () => {
      if (playRef.current) clearInterval(playRef.current);
    };
  }, [isPlaying, onChange]);

  const currentTime = history[Math.floor((value / 100) * (history.length - 1))]?.time || '00:00';

  return (
    <div className={`bento-card p-2 md:p-4 flex items-center gap-3 md:gap-8 transition-all shadow-2xl ${colorBlindMode ? 'border-2 border-[var(--text-color)]' : 'border-[var(--card-border)]'}`}>
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center transition-all border-2 flex-shrink-0 touch-manipulation ${colorBlindMode ? 'bg-white text-black border-black' : (theme === 'dark' ? 'bg-zinc-100 text-black border-zinc-100' : 'bg-zinc-900 text-white border-zinc-900')}`}
      >
        {isPlaying ? (
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
        ) : (
          <svg className="w-5 h-5 md:w-6 md:h-6 ml-0.5 md:ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
        )}
      </button>

      <div className="flex-grow flex flex-col gap-1 md:gap-3">
        <div className="flex justify-between items-center mono text-[7px] md:text-[10px] font-black uppercase tracking-widest opacity-60">
           <span className="flex items-center gap-1.5">
             <span className={`w-0.5 h-2 md:w-1 md:h-3 ${colorBlindMode ? 'bg-black' : 'bg-blue-600'}`}></span>
             WALKER
           </span>
           <span className="text-[9px] md:text-sm tracking-tighter">SYNC: {currentTime}</span>
        </div>
        <div className="relative h-4 md:h-3 bg-zinc-800/30 border border-zinc-700/20 overflow-hidden rounded-sm">
          <input 
            type="range" min="0" max="100" value={value} 
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 touch-pan-x"
          />
          <div 
            className={`h-full transition-all duration-300 ${colorBlindMode ? 'bg-white' : 'bg-blue-600'}`}
            style={{ width: `${value}%` }}
          ></div>
        </div>
      </div>

      <div className="hidden sm:flex flex-col items-end gap-0.5">
        <span className="mono text-[8px] font-black opacity-30 uppercase">CT-26</span>
      </div>
    </div>
  );
};

export default Timeline;
