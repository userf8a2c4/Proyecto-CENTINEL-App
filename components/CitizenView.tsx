
import React, { useMemo } from 'react';
import { Language, ElectionData, Theme } from '../types';

interface CitizenViewProps {
  lang: Language;
  data: ElectionData | null;
  selectedDept: string;
  setSelectedDept: (dept: string) => void;
  theme: Theme;
  colorBlindMode: boolean;
}

const HONDURAS_PATHS = [
  { id: "atlantida", name: "Atlántida", d: "M368,131 L411,146 L435,148 L460,165 L448,187 L401,176 L361,164 Z" },
  { id: "choluteca", name: "Choluteca", d: "M379,355 L411,351 L433,374 L422,410 L391,418 L368,397 L366,375 Z" },
  { id: "colon", name: "Colón", d: "M435,148 L538,162 L583,212 L561,248 L463,241 L451,213 L458,165 Z" },
  { id: "comayagua", name: "Comayagua", d: "M267,238 L321,226 L342,289 L273,311 L252,284 Z" },
  { id: "copan", name: "Copán", d: "M103,205 L156,211 L168,264 L131,288 L98,272 L92,231 Z" },
  { id: "cortes", name: "Cortés", d: "M221,141 L303,136 L311,171 L282,216 L226,204 L212,168 Z" },
  { id: "el_paraiso", name: "El Paraíso", d: "M416,293 L511,316 L498,364 L443,356 L411,351 L398,321 Z" },
  { id: "francisco_morazan", name: "Francisco Morazán", d: "M321,226 L403,284 L411,351 L379,355 L328,349 L314,286 Z" },
  { id: "gracias_a_dios", name: "Gracias a Dios", d: "M538,162 L742,198 L681,352 L561,316 L583,212 Z" },
  { id: "intibuca", name: "Intibucá", d: "M176,268 L241,259 L251,311 L198,324 L181,296 Z" },
  { id: "islas_bahia", name: "Islas de la Bahía", d: "M421,72 L458,78 L462,86 L425,81 Z M510,88 L542,101 L548,112 L515,103 Z" },
  { id: "la_paz", name: "La Paz", d: "M241,259 L283,251 L294,306 L248,319 L241,281 Z" },
  { id: "lempira", name: "Lempira", d: "M156,211 L212,204 L221,294 L171,306 L168,264 Z" },
  { id: "ocotepeque", name: "Ocotepeque", d: "M72,271 L108,268 L114,316 L78,322 L72,291 Z" },
  { id: "olancho", name: "Olancho", d: "M403,224 L521,232 L561,316 L416,293 L321,226 Z" },
  { id: "santa_barbara", name: "Santa Bárbara", d: "M166,161 L221,154 L241,259 L176,268 L166,211 Z" },
  { id: "valle", name: "Valle", d: "M294,306 L328,349 L379,355 L366,375 L301,388 L282,371 Z" },
  { id: "yoro", name: "Yoro", d: "M303,136 L368,131 L451,213 L403,224 L321,226 L311,171 Z" }
];

const CitizenView: React.FC<CitizenViewProps> = ({ lang, data, selectedDept, setSelectedDept, theme, colorBlindMode }) => {
  const currentDept = useMemo(() => 
    data?.departments.find(d => d.name === selectedDept) || null
  , [data, selectedDept]);

  const totalVotes = useMemo(() => 
    data?.candidates.reduce((sum, c) => sum + c.votes, 0) || 1
  , [data]);

  const t = {
    ES: {
      mapTitle: "MAPA TERRITORIAL",
      statsTitle: "MÉTRICAS // " + selectedDept.toUpperCase(),
      national: "VISTA NACIONAL",
      processed: "ACTAS PROCESADAS",
      participation: "PARTICIPACIÓN",
      status: "ESTADO",
      critical: "ALERTA",
      clean: "VERIFICADO"
    },
    EN: {
      mapTitle: "TERRITORIAL MAP",
      statsTitle: "METRICS // " + selectedDept.toUpperCase(),
      national: "NATIONAL VIEW",
      processed: "PROCESSED",
      participation: "PARTICIPATION",
      status: "STATUS",
      critical: "ALERT",
      clean: "VERIFIED"
    }
  }[lang];

  return (
    <div className={`space-y-4 md:space-y-6 ${colorBlindMode ? 'color-blind-active' : ''}`}>
      {/* CANDIDATOS - GRID DINÁMICO */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 no-print">
        {data?.candidates.map((c) => (
          <div key={c.id} className="bento-card p-2 md:p-4 flex flex-col justify-between border-t-2" style={{ borderTopColor: colorBlindMode ? 'currentColor' : c.color }}>
            <div className="flex justify-between items-start mb-1">
              <span className="mono text-[7px] md:text-[9px] font-black opacity-40">{c.party}</span>
              <span className="text-[7px] font-bold px-1 bg-zinc-800 text-zinc-400 mono">ID:{c.id.toUpperCase().slice(0,3)}</span>
            </div>
            <div>
              <h4 className="text-[9px] md:text-[11px] font-black uppercase tracking-tight mb-0.5 truncate">{c.name}</h4>
              <p className="text-sm md:text-xl font-black tracking-tighter mono">{c.votes.toLocaleString()}</p>
              <div className="mt-1 h-0.5 md:h-1 w-full bg-zinc-800/30">
                <div className="h-full transition-all duration-700" style={{ width: `${(c.votes / totalVotes * 100).toFixed(1)}%`, backgroundColor: colorBlindMode ? '#fff' : c.color }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        {/* MAPA GEOGRÁFICO - RESPONSIVO */}
        <div className="lg:col-span-7 xl:col-span-8 bento-card p-3 md:p-6 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center gap-2 mb-4">
            <h3 className="text-[9px] md:text-[10px] font-black tracking-[0.1em] md:tracking-[0.2em] opacity-50 uppercase">{t.mapTitle}</h3>
            <button 
              onClick={() => setSelectedDept("Nivel Nacional")} 
              className={`text-[8px] md:text-[9px] font-black px-3 py-1.5 border transition-all ${theme === 'light' ? 'bg-zinc-100 border-zinc-300' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-500 hover:bg-zinc-800'}`}
            >
              {t.national}
            </button>
          </div>

          <div className="flex-grow relative flex items-center justify-center bg-black/5 rounded-sm overflow-hidden border border-[var(--card-border)]">
            <svg viewBox="0 0 800 500" className="w-full h-full object-contain drop-shadow-2xl">
              {HONDURAS_PATHS.map((path) => {
                const dData = data?.departments.find(d => d.name === path.name);
                const isActive = selectedDept === path.name;
                
                let fill = theme === 'dark' ? '#141414' : '#F0F0F0';
                if (isActive) fill = colorBlindMode ? '#FFF' : '#007BFF';
                else if (dData?.status === 'critical') fill = colorBlindMode ? '#888' : '#3F0C0C';

                return (
                  <path
                    key={path.id}
                    d={path.d}
                    onClick={() => setSelectedDept(path.name)}
                    className="cursor-pointer transition-all duration-300 hover:opacity-80 stroke-[0.5] touch-manipulation"
                    style={{ 
                      fill: fill, 
                      stroke: isActive ? (theme === 'dark' ? '#FFF' : '#000') : (theme === 'dark' ? '#2A2A2A' : '#CCC'),
                      strokeWidth: isActive ? 2 : 0.8,
                    }}
                  />
                );
              })}
            </svg>
            
            <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 mono text-[7px] md:text-[8px] opacity-20 flex flex-col items-center">
              <span>N</span>
              <div className="w-px h-4 md:h-6 bg-current my-1"></div>
              <span>HND_GEO</span>
            </div>
          </div>
        </div>

        {/* MÉTRICAS - LAYOUT ADAPTATIVO */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          <div className="bento-card p-4 md:p-6">
             <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4 md:mb-6">{t.statsTitle}</h4>
             <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
                <div className="col-span-1">
                  <span className="text-[8px] md:text-[9px] font-bold uppercase block mb-1 opacity-40 mono">{t.processed}</span>
                  <div className="flex items-baseline gap-1 md:gap-2">
                    <span className="text-2xl md:text-5xl font-black tracking-tighter mono">
                      {currentDept ? currentDept.processed : data?.global.processedPercent}%
                    </span>
                    <span className={`w-1.5 h-1.5 md:w-2 md:h-2 ${currentDept?.status === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
                  </div>
                </div>

                <div className="col-span-1">
                  <span className="text-[8px] md:text-[9px] font-bold uppercase block mb-1 opacity-40 mono">{t.participation}</span>
                  <span className="text-xl md:text-4xl font-black tracking-tighter mono">
                    {currentDept ? currentDept.participation : data?.global.participationPercent}%
                  </span>
                </div>

                <div className={`col-span-2 p-3 md:p-4 border ${currentDept?.status === 'critical' ? 'bg-red-950/20 border-red-900/50' : 'bg-zinc-900/10 border-zinc-800'}`}>
                  <span className="text-[8px] md:text-[9px] font-bold uppercase block mb-1 opacity-40 mono">{t.status}</span>
                  <span className={`text-[10px] md:text-xs font-black uppercase ${currentDept?.status === 'critical' ? 'text-red-500' : 'text-green-500'}`}>
                    {currentDept?.status === 'critical' ? t.critical : t.clean}
                  </span>
                </div>
             </div>
          </div>

          <div className="bento-card p-4 opacity-30">
             <h4 className="text-[8px] md:text-[9px] font-black uppercase mb-1 mono">_GEO_LINK</h4>
             <p className="text-[8px] md:text-[9px] mono leading-tight truncate">
               &gt; {selectedDept.toUpperCase().replace(' ', '_')}<br/>
               &gt; HASH: {Math.random().toString(16).slice(2, 8).toUpperCase()}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenView;
