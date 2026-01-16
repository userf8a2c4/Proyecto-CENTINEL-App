
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
      mapTitle: "Mapa Territorial",
      statsTitle: "Métricas // " + selectedDept.toUpperCase(),
      national: "Vista Nacional",
      processed: "Actas Procesadas",
      participation: "Participación Ciudadana",
      status: "Estado de Integridad",
      critical: "ALERTA DETECTADA",
      clean: "VERIFICADO"
    },
    EN: {
      mapTitle: "Territorial Map",
      statsTitle: "Metrics // " + selectedDept.toUpperCase(),
      national: "National View",
      processed: "Processed Records",
      participation: "Citizen Participation",
      status: "Integrity Status",
      critical: "ALERT DETECTED",
      clean: "VERIFIED"
    }
  }[lang];

  return (
    <div className="space-y-10">
      {/* CANDIDATOS - GRID MODERNIZADO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {data?.candidates.map((c) => (
          <div key={c.id} className="bento-card p-6 flex flex-col justify-between overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <span className="font-black text-6xl mono">{c.id.toUpperCase().slice(0,2)}</span>
            </div>
            <div className="mb-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">{c.party}</span>
              <h4 className="text-sm font-extrabold uppercase tracking-tight text-slate-100 mb-1">{c.name}</h4>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black tracking-tighter mono">{c.votes.toLocaleString()}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">votos</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
                <span>Porcentaje</span>
                <span>{(c.votes / totalVotes * 100).toFixed(1)}%</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-1000 ease-out rounded-full" 
                  style={{ 
                    width: `${(c.votes / totalVotes * 100).toFixed(1)}%`, 
                    backgroundColor: colorBlindMode ? '#fff' : c.color,
                    boxShadow: colorBlindMode ? 'none' : `0 0 10px ${c.color}44`
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* MAPA GEOGRÁFICO */}
        <div className="lg:col-span-8 bento-card p-6 flex flex-col min-h-[500px]">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
              <h3 className="text-sm font-extrabold uppercase tracking-[0.2em] text-slate-400">{t.mapTitle}</h3>
            </div>
            <button 
              onClick={() => setSelectedDept("Nivel Nacional")} 
              className="text-xs font-bold px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500 hover:text-white transition-all shadow-lg"
            >
              {t.national}
            </button>
          </div>

          <div className="flex-grow relative flex items-center justify-center bg-slate-900/40 rounded-2xl overflow-hidden border border-slate-800">
            <svg viewBox="0 0 800 500" className="w-full h-full max-h-[450px] object-contain">
              {HONDURAS_PATHS.map((path) => {
                const dData = data?.departments.find(d => d.name === path.name);
                const isActive = selectedDept === path.name;
                
                let fill = theme === 'dark' ? '#0f172a' : '#f1f5f9';
                if (isActive) fill = colorBlindMode ? '#FFF' : '#3b82f6';
                else if (dData?.status === 'critical') fill = colorBlindMode ? '#888' : '#450a0a';

                return (
                  <path
                    key={path.id}
                    d={path.d}
                    onClick={() => setSelectedDept(path.name)}
                    className="cursor-pointer transition-all duration-300 hover:opacity-80 stroke-[0.8] touch-manipulation"
                    style={{ 
                      fill: fill, 
                      stroke: isActive ? (theme === 'dark' ? '#FFF' : '#000') : (theme === 'dark' ? '#1e293b' : '#cbd5e1'),
                      strokeWidth: isActive ? 2.5 : 1,
                      filter: isActive ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' : 'none'
                    }}
                  />
                );
              })}
            </svg>
            
            <div className="absolute bottom-6 right-6 mono text-[10px] font-bold text-slate-600 flex flex-col items-center">
              <span className="mb-2">NORTH</span>
              <div className="w-px h-10 bg-slate-800"></div>
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse mt-2"></div>
            </div>
          </div>
        </div>

        {/* MÉTRICAS DEPARTAMENTALES */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bento-card p-8">
             <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-10">{t.statsTitle}</h4>
             
             <div className="space-y-10">
                <div className="relative">
                  <span className="text-[10px] font-bold uppercase block mb-2 text-slate-500 tracking-widest mono">{t.processed}</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-black tracking-tighter text-slate-100 mono">
                      {currentDept ? currentDept.processed : data?.global.processedPercent}%
                    </span>
                    <div className={`w-3 h-3 rounded-full ${currentDept?.status === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                  </div>
                </div>

                <div className="relative">
                  <span className="text-[10px] font-bold uppercase block mb-2 text-slate-500 tracking-widest mono">{t.participation}</span>
                  <span className="text-4xl font-black tracking-tighter text-slate-100 mono">
                    {currentDept ? currentDept.participation : data?.global.participationPercent}%
                  </span>
                </div>

                <div className={`p-6 rounded-2xl border-2 transition-all ${currentDept?.status === 'critical' ? 'bg-red-950/20 border-red-600/30' : 'bg-slate-900/50 border-slate-700'}`}>
                  <span className="text-[10px] font-bold uppercase block mb-3 text-slate-500 tracking-widest mono">{t.status}</span>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${currentDept?.status === 'critical' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}>
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {currentDept?.status === 'critical' ? 
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /> :
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          }
                       </svg>
                    </div>
                    <span className={`text-sm font-black uppercase tracking-tight ${currentDept?.status === 'critical' ? 'text-red-500' : 'text-emerald-500'}`}>
                      {currentDept?.status === 'critical' ? t.critical : t.clean}
                    </span>
                  </div>
                </div>
             </div>
          </div>

          <div className="bento-card p-6 bg-slate-900/20 border-dashed">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <h4 className="text-[10px] font-black uppercase text-slate-500 mono tracking-widest">Metadata Secure Link</h4>
             </div>
             <div className="mono text-[10px] text-slate-500 space-y-1">
               <p>&gt; DEPT_URI: {selectedDept.toUpperCase().replace(' ', '_')}</p>
               <p>&gt; TRACE_HASH: {Math.random().toString(16).slice(2, 10).toUpperCase()}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenView;
