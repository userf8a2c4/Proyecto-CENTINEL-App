
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Theme, TimeSeriesPoint, Language, Candidate, Protocol } from '../types';

interface TimelineEvent {
  timestamp: string;
  label: string;
  type: "warning" | "critical";
  position: number; // Posición porcentual en el timeline (0-100)
}

interface TimelineProps {
  value: number;
  onChange: (val: number | ((prev: number) => number)) => void;
  history: TimeSeriesPoint[];
  theme: Theme;
  lang: Language;
  candidates?: Candidate[];
  protocols?: Protocol[];
  onAlertClick?: (protocol: Protocol) => void;
}

const Timeline: React.FC<TimelineProps> = ({ 
  value, onChange, history, theme, lang, candidates = [], protocols = []
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [snapshotA, setSnapshotA] = useState<number | null>(null);
  const [snapshotB, setSnapshotB] = useState<number | null>(null);
  
  const playRef = useRef<number | null>(null);
  const isDark = theme === 'dark';

  const events: TimelineEvent[] = [
    { timestamp: "19:30", label: "Spike", type: "critical", position: 35 },
    { timestamp: "23:00", label: "Freeze", type: "warning", position: 72 }
  ];

  useEffect(() => {
    if (isPlaying) {
      playRef.current = window.setInterval(() => {
        onChange((prev: number) => {
          const limit = snapshotB !== null && snapshotB > prev ? snapshotB : 100;
          if (prev >= limit) {
            setIsPlaying(false);
            return snapshotA !== null ? snapshotA : 0;
          }
          return Math.min(limit, prev + (0.15 * playSpeed));
        });
      }, 30);
    } else if (playRef.current) {
      clearInterval(playRef.current);
    }
    return () => { if (playRef.current) clearInterval(playRef.current); };
  }, [isPlaying, playSpeed, snapshotA, snapshotB, onChange]);

  const currentIndex = Math.min(Math.floor((value / 100) * (history.length || 1)), history.length - 1);
  const currentTime = history[currentIndex]?.time || '00:00';

  const analysis = useMemo(() => {
    if (snapshotA === null || snapshotB === null) return null;
    const timeStart = Math.min(snapshotA, snapshotB);
    const timeEnd = Math.max(snapshotA, snapshotB);
    const idxA = Math.min(Math.floor((timeStart / 100) * history.length), history.length - 1);
    const idxB = Math.min(Math.floor((timeEnd / 100) * history.length), history.length - 1);
    const dataA = history[idxA];
    const dataB = history[idxB];
    if (!dataA || !dataB) return null;

    return {
      startTime: dataA.time,
      endTime: dataB.time,
      deltas: candidates.map(c => {
        const vA = Number(dataA[c.id]) || 0;
        const vB = Number(dataB[c.id]) || 0;
        const diff = vB - vA;
        const pChange = vA > 0 ? (diff / vA) * 100 : 0;
        return { ...c, vA, vB, diff, pChange };
      }).sort((a, b) => b.diff - a.diff)
    };
  }, [snapshotA, snapshotB, history, candidates]);

  const resetSnapshots = () => {
    setSnapshotA(null);
    setSnapshotB(null);
  };

  return (
    <div className="fixed bottom-6 left-0 right-0 z-[300] px-4 md:px-8 pointer-events-none">
      
      <style>{`
        .minimal-slider {
          -webkit-appearance: none;
          width: 100%;
          background: transparent;
          cursor: pointer;
          height: 44px;
        }
        .minimal-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 22px;
          width: 22px;
          border-radius: 50%;
          background: #0071e3;
          border: 3px solid ${isDark ? '#1c1c1e' : '#ffffff'};
          box-shadow: 0 4px 12px rgba(0, 113, 227, 0.4);
          transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1);
          margin-top: -9px;
        }
        .minimal-slider::-webkit-slider-thumb:active { transform: scale(1.4); }
        .minimal-slider::-webkit-slider-runnable-track {
          width: 100%;
          height: 4px;
          background: ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'};
          border-radius: 2px;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* VENTANA DELTA */}
      <div className={`mx-auto max-w-2xl mb-6 transition-all duration-700 transform ${analysis ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95 pointer-events-none'}`}>
        <div className={`p-6 md:p-8 rounded-[32px] border backdrop-blur-3xl shadow-[0_32px_64px_rgba(0,0,0,0.2)] ${isDark ? 'bg-zinc-950/95 border-white/10' : 'bg-white/95 border-black/5'}`}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">ANÁLISIS DE FLUJO (DELTA Tn)</h4>
              <p className="text-lg md:text-xl font-black tracking-tight mono">{analysis?.startTime} ➔ {analysis?.endTime}</p>
            </div>
            <button 
              onClick={resetSnapshots} 
              className="w-8 h-8 rounded-full bg-zinc-500/10 flex items-center justify-center hover:scale-110 active:scale-90 transition-all pointer-events-auto"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 overflow-y-auto max-h-[30vh] md:max-h-none no-scrollbar">
            {analysis?.deltas.map(d => (
              <div key={d.id} className="p-4 rounded-2xl bg-zinc-500/5 border border-zinc-500/5 flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 rounded-full" style={{ backgroundColor: d.color }}></div>
                  <div>
                    <p className="text-[9px] font-black opacity-40 uppercase tracking-widest">{d.party}</p>
                    <p className="text-[11px] font-black truncate max-w-[120px] uppercase">{d.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-[13px] font-black mono ${d.pChange > 35 ? 'text-red-500' : (isDark ? 'text-white' : 'text-black')}`}>
                    +{d.diff.toLocaleString()}
                  </p>
                  <p className={`text-[9px] font-bold mono ${d.pChange > 35 ? 'text-red-500/60' : 'opacity-40'}`}>
                    ({d.pChange.toFixed(2)}%)
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-zinc-500/10 flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full animate-pulse ${isDark ? 'bg-blue-400' : 'bg-blue-600'}`}></div>
            <p className="text-[10px] font-bold opacity-60 leading-tight">
              {lang === 'ES' 
                ? "El diferencial muestra la velocidad de carga por candidato entre los dos puntos de control seleccionados." 
                : "The differential shows the upload speed per candidate between the two selected checkpoints."}
            </p>
          </div>
        </div>
      </div>

      {/* BARRA TIMELINE DINÁMICA */}
      <div className={`mx-auto max-w-3xl pointer-events-auto transition-all duration-500 ${isExpanded ? 'mb-4' : 'mb-0'}`}>
        <div className={`rounded-[30px] border backdrop-blur-3xl shadow-2xl transition-all duration-500 ${isDark ? 'bg-zinc-900/90 border-white/5' : 'bg-white/90 border-black/5'} ${isExpanded ? 'p-6' : 'p-2.5 px-6'}`}>
          
          {/* Fila Principal */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsPlaying(!isPlaying)} 
              className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-all active:scale-90 ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}
            >
              {isPlaying ? <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="3" height="16"/><rect x="15" y="4" width="3" height="16"/></svg> : <svg className="w-3.5 h-3.5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
            </button>

            <div className="relative flex-grow h-8 flex items-center px-1">
              <div className="absolute left-1 right-1 h-1 bg-zinc-500/10 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 transition-all duration-100" style={{ width: `${value}%` }}></div>
              </div>

              {/* Eventos */}
              {events.map((ev, i) => (
                <div 
                  key={`ev-${i}`} 
                  className={`absolute w-1.5 h-1.5 rounded-full top-1/2 -translate-y-1/2 shadow-sm z-20 ${ev.type === 'critical' ? 'bg-red-500' : 'bg-amber-500'}`}
                  style={{ left: `calc(${ev.position}% + 4px)` }}
                />
              ))}

              {/* Marcadores A y B en el track */}
              {snapshotA !== null && (
                <div className="absolute w-0.5 h-4 bg-blue-500 top-1/2 -translate-y-1/2 z-20" style={{ left: `calc(${snapshotA}% + 4px)` }}>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-black text-blue-500">A</div>
                </div>
              )}
              {snapshotB !== null && (
                <div className="absolute w-0.5 h-4 bg-red-500 top-1/2 -translate-y-1/2 z-20" style={{ left: `calc(${snapshotB}% + 4px)` }}>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-black text-red-500">B</div>
                </div>
              )}

              <input 
                type="range" min="0" max="100" step="0.01" value={value} 
                onChange={(e) => onChange(parseFloat(e.target.value))} 
                className="minimal-slider relative z-30" 
              />
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[13px] font-black mono tabular-nums opacity-80 tracking-tighter">{currentTime}</span>
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${isExpanded ? 'rotate-180 bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' : 'opacity-30 border-current hover:opacity-100'}`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M5 15l7-7 7 7"/></svg>
              </button>
            </div>
          </div>

          {/* Fila de Controles Unificada (Marcación + Velocidad en 1 fila) */}
          <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-20 mt-5 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-zinc-500/10">
              
              {/* Grupo Marcación */}
              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={() => setSnapshotA(value)} 
                  className={`px-3 py-1.5 rounded-lg border text-[8px] font-black tracking-widest transition-all active:scale-95 ${snapshotA !== null ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'opacity-40 border-current hover:opacity-100'}`}
                >
                  MARCAR A
                </button>
                <button 
                  onClick={() => setSnapshotB(value)} 
                  className={`px-3 py-1.5 rounded-lg border text-[8px] font-black tracking-widest transition-all active:scale-95 ${snapshotB !== null ? 'bg-red-600 text-white border-red-600 shadow-md' : 'opacity-40 border-current hover:opacity-100'}`}
                >
                  MARCAR B
                </button>
              </div>

              {/* Divisor Visual */}
              <div className="w-px h-4 bg-zinc-500/10 hidden sm:block"></div>

              {/* Grupo Velocidad */}
              <div className="flex items-center gap-1.5 bg-zinc-500/5 p-1 rounded-xl border border-zinc-500/5">
                <span className="text-[7px] font-black opacity-30 px-2 uppercase tracking-tighter hidden xs:block">SPEED</span>
                {[0.25, 0.5, 1, 2, 4].map(s => (
                  <button 
                    key={s} 
                    onClick={() => setPlaySpeed(s)}
                    className={`px-2 py-1 rounded-md text-[8px] font-black transition-all ${playSpeed === s ? (isDark ? 'bg-white text-black' : 'bg-black text-white') : 'opacity-40 hover:opacity-100'}`}
                  >
                    {s}X
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
