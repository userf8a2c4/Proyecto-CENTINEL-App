
import React, { useState, useMemo } from 'react';
import { Language, ElectionData, Theme } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, ReferenceLine, ScatterChart, Scatter
} from 'recharts';

interface SpecialViewProps {
  lang: Language;
  data: ElectionData | null;
  theme: Theme;
  colorBlindMode: boolean;
}

const SpecialView: React.FC<SpecialViewProps> = ({ lang, data, theme, colorBlindMode }) => {
  const [inspectingId, setInspectingId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'original' | 'actual'>('actual');
  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  
  const quarantineRecords = useMemo(() => [
    { id: "AI-2407-FM", time: "03:14", loc: "Tegucigalpa", type: "HASH_FAIL", votesOriginal: { PN: 150, PL: 120, LIBRE: 40 }, votesModified: { PN: 280, PL: 30, LIBRE: 40 }, hashOrig: "7F9E...A1", hashMod: "A34D...B2", deltaV: 14.2, benfordDev: 8.4, status: 'FRAUDE', censo: 350 },
    { id: "AI-1102-CT", time: "03:15", loc: "San Pedro Sula", type: "CENSO_EXC", votesOriginal: { PN: 100, PL: 100, LIBRE: 100 }, votesModified: { PN: 310, PL: 50, LIBRE: 50 }, hashOrig: "5B2C...F9", hashMod: "E11D...C4", deltaV: 9.1, benfordDev: 2.1, status: 'FRAUDE', censo: 300 },
    { id: "AI-0892-OL", time: "03:18", loc: "Juticalpa", type: "DELTA_SPIKE", votesOriginal: { PN: 50, PL: 50, LIBRE: 190 }, votesModified: { PN: 50, PL: 50, LIBRE: 190 }, hashOrig: "90FF...E1", hashMod: "90FF...E1", deltaV: 45.0, benfordDev: 1.2, status: 'CRÍTICO', censo: 400 },
    { id: "AI-5521-LP", time: "03:22", loc: "La Paz", type: "BENFORD_DEV", votesOriginal: { PN: 60, PL: 60, LIBRE: 30 }, votesModified: { PN: 90, PL: 40, LIBRE: 20 }, hashOrig: "11AA...00", hashMod: "22BB...11", deltaV: 2.5, benfordDev: 12.8, status: 'ANOMALÍA', censo: 200 },
  ], []);

  const t = {
    ES: {
      header: "ZONA DE CUARENTENA: ACTAS INCONSISTENTES (AI)",
      injectedCount: "ACTAS INYECTADAS DETECTADAS",
      stats: {
        benford: "DESVIACIÓN CHI-CUADRADO (BENFORD)",
        delta: "VELOCIDAD DE CARGA (DELTA V)",
        census: "VERIFICADOR DE CENSO LOCAL"
      },
      verdicts: {
        benford: "VERDICTO: Desviación artificial para cuadrar totales.",
        delta: "VERDICTO: Picos de carga masiva automatizada.",
        census: "VERDICTO: Votos exceden censo. Suplantación directa."
      },
      labels: {
        id: "ID_ACTA", type: "TIPO_ERROR", verdict: "VERDICTO", inspect: "AUDITAR",
        original: "T-1 (ORIGINAL)", actual: "Tn (ACTUAL)"
      }
    },
    EN: {
      header: "QUARANTINE ZONE: INCONSISTENT RECORDS (AI)",
      injectedCount: "INJECTED RECORDS DETECTED",
      stats: {
        benford: "CHI-SQUARE DEVIATION (BENFORD)",
        delta: "UPLOAD VELOCITY (DELTA V)",
        census: "LOCAL CENSUS VERIFIER"
      },
      verdicts: {
        benford: "VERDICT: Artificial deviation to balance totals.",
        delta: "VERDICT: Automated mass upload spikes.",
        census: "VERDICT: Votes exceed census. Identity theft."
      },
      labels: {
        id: "RECORD_ID", type: "ERROR_TYPE", verdict: "VERDICT", inspect: "AUDIT",
        original: "T-1 (ORIGINAL)", actual: "Tn (ACTUAL)"
      }
    }
  }[lang];

  const ExplainerCard = ({ text }: { text: string }) => (
    <div className={`mt-4 p-3 rounded-2xl border flex gap-3 items-start ${isDark ? 'bg-red-500/5 border-red-500/10' : 'bg-red-50 border-red-100'}`}>
      <div className={`mt-0.5 shrink-0 p-1 rounded-lg ${isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-600 text-white'}`}>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      </div>
      <p className={`text-[10px] font-bold leading-tight ${isDark ? 'text-zinc-400' : 'text-zinc-700'}`}>{text}</p>
    </div>
  );

  const selectedRecord = useMemo(() => quarantineRecords.find(r => r.id === inspectingId), [inspectingId]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-32">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-red-600/5 p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-red-600/20">
        <div className="space-y-1">
          <h2 className="text-xl md:text-3xl font-black tracking-tighter text-red-600 uppercase">{t.header}</h2>
          <p className="text-[9px] font-black opacity-50 uppercase tracking-[0.2em]">Auditoría Forense | AI FEED</p>
        </div>
        <div className="flex flex-col">
          <span className="text-4xl md:text-7xl font-black mono text-red-600 tabular-nums">2,407</span>
          <span className="text-[9px] font-black opacity-40 uppercase tracking-widest">{t.injectedCount}</span>
        </div>
      </div>

      {/* ALGORITHMS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {[
          { title: t.stats.benford, comp: (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quarantineRecords}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="id" hide />
                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                <Bar dataKey="benfordDev" radius={[4, 4, 0, 0]}>
                  {quarantineRecords.map((e, i) => <Cell key={i} fill={e.benfordDev > 5 ? '#ef4444' : '#3b82f6'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ), verdict: t.verdicts.benford },
          { title: t.stats.delta, comp: (
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis type="category" dataKey="id" hide />
                <YAxis type="number" dataKey="deltaV" fontSize={10} axisLine={false} tickLine={false} />
                <Scatter data={quarantineRecords} fill="#ef4444" />
              </ScatterChart>
            </ResponsiveContainer>
          ), verdict: t.verdicts.delta },
        ].map((card, i) => (
          <div key={i} className="bento-card p-6 flex flex-col h-full">
            <h3 className="text-[9px] font-black opacity-40 uppercase mb-6 tracking-widest">{card.title}</h3>
            <div className="h-[180px] w-full">{card.comp}</div>
            <ExplainerCard text={card.verdict} />
          </div>
        ))}

        <div className="bento-card p-6 flex flex-col h-full md:col-span-2 lg:col-span-1">
          <h3 className="text-[9px] font-black opacity-40 uppercase mb-6 tracking-widest">{t.stats.census}</h3>
          <div className="flex-grow space-y-4">
            {quarantineRecords.slice(0, 3).map(r => (
              <div key={r.id} className="space-y-1">
                <div className="flex justify-between text-[10px] font-black mono">
                  <span>{r.id}</span>
                  <span className="text-red-500">{r.votesModified.PN + r.votesModified.PL + r.votesModified.LIBRE} / {r.censo}</span>
                </div>
                <div className="h-2 w-full bg-zinc-500/10 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: '100%' }}></div>
                </div>
              </div>
            ))}
          </div>
          <ExplainerCard text={t.verdicts.census} />
        </div>
      </div>

      {/* EVIDENCE TABLE */}
      <div className="bento-card overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="text-[9px] font-black uppercase opacity-40 border-b border-zinc-500/10">
                <th className="p-6">{t.labels.id}</th>
                <th className="p-6">{t.labels.type}</th>
                <th className="p-6 text-center">{t.labels.verdict}</th>
                <th className="p-6 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-500/5">
              {quarantineRecords.map(r => (
                <tr key={r.id} className="hover:bg-zinc-500/5 transition-colors">
                  <td className="p-6 text-[11px] font-black mono text-blue-500">{r.id}</td>
                  <td className="p-6">
                    <span className="text-[9px] font-black px-2 py-0.5 bg-red-600/10 text-red-600 rounded uppercase">{r.type}</span>
                  </td>
                  <td className="p-6 text-center text-[10px] font-black text-red-600">{r.status}</td>
                  <td className="p-6 text-right">
                    <button onClick={() => setInspectingId(r.id)} className="px-4 py-2 bg-zinc-900 dark:bg-white dark:text-black text-white rounded-xl text-[9px] font-black uppercase">AUDITAR</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL RESPONSIVO OPTIMIZADO */}
      {inspectingId && selectedRecord && (
        <div className="fixed inset-0 z-[400] flex items-end md:items-center justify-center p-0 md:p-6 backdrop-blur-3xl bg-black/80 animate-in fade-in duration-300">
          <div className={`w-full max-w-5xl bento-card border-t md:border-2 border-red-600/30 overflow-hidden flex flex-col h-[92vh] md:h-auto md:max-h-[90vh] rounded-t-[32px] md:rounded-[32px] ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
            
            {/* Modal Header */}
            <div className="p-5 md:p-8 border-b border-zinc-500/10 flex justify-between items-center">
               <div>
                  <h4 className="text-xl md:text-2xl font-black tracking-tighter mono">{inspectingId}</h4>
                  <p className="text-[10px] font-black text-red-600 uppercase mt-1">Discrepancia Forense Detectada</p>
               </div>
               <button onClick={() => setInspectingId(null)} className="w-10 h-10 rounded-full bg-zinc-500/10 flex items-center justify-center text-xl hover:scale-110 transition-transform">✕</button>
            </div>

            {/* Mobile View Tabs Selector */}
            <div className="flex md:hidden border-b border-zinc-500/10">
              <button 
                onClick={() => setMobileTab('actual')}
                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${mobileTab === 'actual' ? 'text-red-600 border-b-2 border-red-600' : 'opacity-40'}`}
              >
                {t.labels.actual}
              </button>
              <button 
                onClick={() => setMobileTab('original')}
                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${mobileTab === 'original' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'opacity-40'}`}
              >
                {t.labels.original}
              </button>
            </div>

            {/* Modal Content - Scrollable area */}
            <div className="flex-grow overflow-y-auto p-4 md:p-8 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                
                {/* CAPTURA ORIGINAL (Oculta en móvil si Tn está activa) */}
                <div className={`${mobileTab === 'original' ? 'block' : 'hidden md:block'} space-y-3`}>
                   <h5 className="hidden md:block text-[9px] font-black opacity-30 uppercase tracking-[0.2em] mb-4">T-1 (CAPTURA INICIAL)</h5>
                   <div className={`p-5 md:p-7 rounded-[24px] md:rounded-[32px] border mono text-[11px] md:text-[12px] leading-relaxed overflow-x-auto ${isDark ? 'bg-black/40 border-emerald-500/10 text-emerald-500/80' : 'bg-emerald-50/50 border-emerald-500/20 text-emerald-700'}`}>
                      <div className="opacity-40">{"{"}</div>
                      <div className="pl-4">"id_acta": <span className="text-blue-500">"{selectedRecord.id}"</span>,</div>
                      <div className="pl-4">"votos": {"{"}</div>
                      {Object.entries(selectedRecord.votesOriginal).map(([key, val]) => (
                        <div key={key} className="pl-8">"{key}": <span className="font-black">{val}</span>,</div>
                      ))}
                      <div className="pl-4">{"}"},</div>
                      <div className="pl-4 truncate">"hash": "SHA256_{selectedRecord.hashOrig}"</div>
                      <div className="opacity-40">{"}"}</div>
                   </div>
                </div>

                {/* ESTADO ACTUAL (Activa por defecto en móvil) */}
                <div className={`${mobileTab === 'actual' ? 'block' : 'hidden md:block'} space-y-3`}>
                   <h5 className="hidden md:block text-[9px] font-black opacity-30 uppercase tracking-[0.2em] mb-4">Tn (ESTADO ACTUAL)</h5>
                   <div className={`p-5 md:p-7 rounded-[24px] md:rounded-[32px] border mono text-[11px] md:text-[12px] leading-relaxed overflow-x-auto ${isDark ? 'bg-red-500/5 border-red-500/20 text-red-500/80' : 'bg-red-50/50 border-red-500/20 text-red-700'}`}>
                      <div className="opacity-40">{"{"}</div>
                      <div className="pl-4">"id_acta": <span className="text-blue-500">"{selectedRecord.id}"</span>,</div>
                      <div className="pl-4">"votos": {"{"}</div>
                      {Object.entries(selectedRecord.votesModified).map(([key, val]) => {
                        const hasChanged = val !== (selectedRecord.votesOriginal as any)[key];
                        return (
                          <div key={key} className={`pl-8 flex items-center gap-2 ${hasChanged ? 'bg-red-500/10 -mx-2 px-2 rounded font-black' : 'opacity-40'}`}>
                            "{key}": <span className={hasChanged ? 'underline decoration-2' : ''}>{val}</span>
                            {hasChanged && <span className="text-[7px] bg-red-600 text-white px-1 rounded-sm">MOD</span>}
                          </div>
                        );
                      })}
                      <div className="pl-4">{"}"},</div>
                      <div className="pl-4 flex items-center gap-2 bg-red-500/10 -mx-2 px-2 rounded font-black truncate">
                        "hash": "SHA256_{selectedRecord.hashMod}"
                      </div>
                      <div className="opacity-40">{"}"}</div>
                   </div>
                </div>
              </div>

              {/* Forensic Footer Info */}
              <div className={`mt-6 md:mt-8 p-5 rounded-2xl border flex flex-col md:flex-row gap-4 items-center ${isDark ? 'bg-zinc-900 border-white/5' : 'bg-zinc-50 border-black/5'}`}>
                <div className="flex -space-x-2 shrink-0">
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-[10px] font-black border-2 border-white dark:border-zinc-950">!</div>
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-black border-2 border-white dark:border-zinc-950">✓</div>
                </div>
                <p className="text-[10px] md:text-xs font-bold leading-relaxed opacity-70 italic text-center md:text-left">
                  {lang === 'ES' 
                    ? "Los datos fueron alterados post-captura inicial, rompiendo el hash criptográfico del acta." 
                    : "Data was altered post-initial capture, breaking the record's cryptographic hash."}
                </p>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-5 md:p-8 border-t border-zinc-500/10 bg-zinc-500/5 flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col flex-grow">
                <span className="text-[8px] font-black opacity-30 uppercase tracking-widest">ESTADO FINAL</span>
                <span className="text-[11px] font-black text-red-600 uppercase">AUDITORÍA: RUPTURA DETECTADA</span>
              </div>
              <button className="w-full sm:w-auto px-10 py-4 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-600/20 active:scale-95 transition-all">
                EXPORTAR EVIDENCIA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialView;
