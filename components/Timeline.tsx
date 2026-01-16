
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
      }, 300);
    } else if (playRef.current) {
      clearInterval(playRef.current);
    }
    return () => {
      if (playRef.current) clearInterval(playRef.current);
    };
  }, [isPlaying, onChange]);

  const currentTime = history[Math.floor((value / 100) * (history.length - 1))]?.time || '00:00';

  return (
    <div className={`bento-card p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 md:gap-10 transition-all shadow-2xl glass border-t border-slate-700/50 ${colorBlindMode ? 'border-2 border-slate-100' : ''}`}>
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg touch-manipulation active:scale-90 ${colorBlindMode ? 'bg-white text-black' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'}`}
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
          ) : (
            <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-1">Status</span>
          <span className={`text-xs font-black mono ${isPlaying ? 'text-emerald-500' : 'text-slate-400'}`}>
            {isPlaying ? 'PLAYING_EVOLUTION' : 'STATIC_VIEW'}
          </span>
        </div>
      </div>

      <div className="flex-grow w-full flex flex-col gap-3">
        <div className="flex justify-between items-center px-1">
           <div className="flex items-center gap-2">
             <div className="w-1 h-3 bg-blue-600 rounded-full"></div>
             <span className="font-extrabold text-[11px] uppercase tracking-widest text-slate-300">Time Walker</span>
           </div>
           <div className="bg-slate-800/80 px-4 py-1.5 rounded-lg border border-slate-700">
             <span className="text-sm font-black mono text-blue-500">{currentTime}</span>
           </div>
        </div>
        
        <div className="relative group h-6 flex items-center">
          <div className="absolute inset-0 h-1.5 top-1/2 -translate-y-1/2 bg-slate-800 rounded-full overflow-hidden">
             <div 
               className={`h-full transition-all duration-300 ${colorBlindMode ? 'bg-white' : 'bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.6)]'}`}
               style={{ width: `${value}%` }}
             ></div>
          </div>
          <input 
            type="range" min="0" max="100" value={value} 
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 touch-pan-x"
          />
          {/* Custom Thumb */}
          <div 
            className="absolute w-4 h-4 bg-white border-4 border-blue-600 rounded-full pointer-events-none transition-all shadow-xl"
            style={{ left: `calc(${value}% - 8px)` }}
          ></div>
        </div>
      </div>

      <div className="hidden lg:flex flex-col items-end">
        <span className="mono text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Revision V4</span>
        <div className="flex gap-1">
          {[1,2,3,4,5].map(i => <div key={i} className={`w-1 h-3 rounded-full ${i <= (value/20) ? 'bg-blue-600' : 'bg-slate-800'}`}></div>)}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
