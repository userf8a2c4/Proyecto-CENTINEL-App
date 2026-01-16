
import React from 'react';
import { Language, ElectionData, Theme } from '../types';

type IntegrityStatus = 'nominal' | 'anomaly' | 'hash_broken' | 'connection_lost';

interface IntegrityMonitorProps {
  lang: Language;
  data: ElectionData | null;
  loading: boolean;
  theme: Theme;
  colorBlindMode?: boolean;
}

const IntegrityMonitor: React.FC<IntegrityMonitorProps> = ({ lang, data, loading, theme, colorBlindMode }) => {
  const getStatus = (): IntegrityStatus => {
    if (loading) return 'connection_lost';
    const hasHashError = data?.latestProtocols.some(p => !p.verified);
    if (hasHashError) return 'hash_broken';
    const hasAnomaly = data?.global.trend.toLowerCase().includes('volatilidad') || 
                      data?.benford.some(b => Math.abs(b.actual - b.expected) > 5);
    if (hasAnomaly) return 'anomaly';
    return 'nominal';
  };

  const status = getStatus();

  const config = {
    nominal: {
      label: { ES: "ÍNTEGRO", EN: "INTACT" },
      color: colorBlindMode ? "bg-white" : "bg-green-500",
      border: colorBlindMode ? "border-white border-2 shadow-[0_0_15px_rgba(255,255,255,0.4)]" : "border-green-500/20",
      text: colorBlindMode ? "text-white" : "text-green-600 dark:text-green-400",
      desc: { ES: "Hash de sesión verificado. Datos consistentes.", EN: "Session hash verified. Consistent data." }
    },
    anomaly: {
      label: { ES: "ATÍPICO", EN: "ATYPICAL" },
      color: colorBlindMode ? "bg-yellow-400" : "bg-yellow-500",
      border: colorBlindMode ? "border-yellow-400 border-2" : "border-yellow-500/20",
      text: colorBlindMode ? "text-yellow-400" : "text-yellow-700 dark:text-yellow-400",
      desc: { ES: "Detectada desviación estadística en Benford.", EN: "Benford statistical deviation detected." }
    },
    hash_broken: {
      label: { ES: "CRÍTICO", EN: "CRITICAL" },
      color: colorBlindMode ? "bg-red-600" : "bg-red-500",
      border: colorBlindMode ? "border-red-600 border-4 animate-pulse" : "border-red-500/30",
      text: colorBlindMode ? "text-red-500 font-black" : "text-red-600 dark:text-red-400",
      desc: { ES: "¡Alerta! Cadena de custodia digital rota.", EN: "Alert! Digital chain of custody broken." }
    },
    connection_lost: {
      label: { ES: "OFFLINE", EN: "OFFLINE" },
      color: colorBlindMode ? "bg-zinc-400" : "bg-zinc-500",
      border: colorBlindMode ? "border-zinc-400 border-2 border-dashed" : "border-zinc-500/20",
      text: colorBlindMode ? "text-zinc-200" : "text-zinc-600 dark:text-zinc-400",
      desc: { ES: "Error de comunicación con el endpoint CNE.", EN: "CNE endpoint communication failure." }
    }
  }[status];

  return (
    <div className={`group relative inline-flex items-center gap-3 px-4 py-2 rounded-full border transition-all mb-8 ${colorBlindMode ? 'bg-black' : 'bg-white/5 backdrop-blur-sm'} ${config.border}`}>
      <div className={`w-3 h-3 rounded-full ${config.color} ${status === 'hash_broken' ? 'animate-ping' : 'animate-pulse'}`}></div>
      <span className={`text-[11px] font-black uppercase tracking-widest ${config.text}`}>{config.label[lang]}</span>
      <div className={`w-px h-3 ${colorBlindMode ? 'bg-white' : 'bg-current'} opacity-20`}></div>
      <span className={`text-[10px] font-black uppercase tracking-tighter ${colorBlindMode ? 'text-white opacity-100' : 'opacity-40'}`}>Blockchain Proof v4</span>

      {/* Tooltip con posicionamiento inteligente */}
      <div className={`absolute bottom-full mb-3 left-0 w-72 p-5 rounded-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 z-[100] shadow-2xl scale-95 group-hover:scale-100 border ${colorBlindMode ? 'bg-white text-black border-4 border-black' : 'bg-black/95 text-white border-white/10'}`}>
        <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${colorBlindMode ? 'text-black underline decoration-2' : 'text-blue-400'}`}>Estado Sistémico</p>
        <p className="text-xs font-bold leading-relaxed">{config.desc[lang]}</p>
        <div className={`absolute top-full left-6 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] ${colorBlindMode ? 'border-t-white' : 'border-t-black/95'}`}></div>
      </div>
    </div>
  );
};

export default IntegrityMonitor;
