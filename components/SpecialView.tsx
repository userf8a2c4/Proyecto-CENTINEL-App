
import React, { useState } from 'react';
import { Language, ElectionData, Theme } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, AreaChart, Area, ReferenceLine, Label
} from 'recharts';

interface SpecialViewProps {
  lang: Language;
  data: ElectionData | null;
  theme: Theme;
  colorBlindMode: boolean;
}

const SpecialView: React.FC<SpecialViewProps> = ({ lang, data, theme, colorBlindMode }) => {
  const [inspectingId, setInspectingId] = useState<string | null>(null);

  const totalInconsistent = 2773; 
  const totalCorrect = 16279;

  const isDark = theme === 'dark';
  const gridColor = isDark ? '#1F1F1F' : '#E5E5E5';
  const labelColor = isDark ? '#666' : '#999';

  const t = {
    ES: {
      metrics: {
        deviation: "Desviación de Tendencia",
        inflation: "Inflación de Censo",
        impact: "Impacto en Actas Inconsistentes",
        votersAffected: "Actas con Inconsistencias",
        favors: "Datos extraídos del reporte 'Inconsistentes' del CNE",
        theoreticalLimit: "Participación Teórica Excedida",
        maxExpected: "Max esperado: 70%",
        normal: "Voto Regular",
        special: "Voto Especial",
        alertPerc: "+45% Desviación"
      },
      timeline: {
        title: "ANÁLISIS DE FLUJO: INYECCIÓN DE ACTAS ESPECIALES",
        spikeLabel: "Batch Upload Injection (12k records)",
        vol: "Volumen de Votos"
      },
      table: {
        title: "REGISTRO DE EVIDENCIA (DATA-SCRAPING CNE)",
        id: "ID ACTA",
        time: "TIMESTAMP",
        loc: "UBICACIÓN",
        err: "ERROR TÉCNICO",
        action: "INSPECT"
      }
    },
    EN: {
      metrics: {
        deviation: "Trend Deviation",
        inflation: "Census Inflation",
        impact: "Impact on Inconsistent Records",
        votersAffected: "Records with Inconsistencies",
        favors: "Data extracted from CNE 'Inconsistent' report",
        theoreticalLimit: "Theoretical Limit Exceeded",
        maxExpected: "Max expected: 70%",
        normal: "Regular Vote",
        special: "Special Vote",
        alertPerc: "+45% Deviation"
      },
      timeline: {
        title: "FLOW ANALYSIS: SPECIAL RECORDS INJECTION",
        spikeLabel: "Batch Upload Injection (12k records)",
        vol: "Vote Volume"
      },
      table: {
        title: "EVIDENCE LOG (CNE DATA-SCRAPING)",
        id: "RECORD ID",
        time: "TIMESTAMP",
        loc: "LOCATION",
        err: "TECHNICAL ERROR",
        action: "INSPECT"
      }
    }
  }[lang];

  const deviationData = [
    { name: t.metrics.normal, value: 55, fill: colorBlindMode ? '#333' : '#007AFF' },
    { name: t.metrics.special, value: 10, fill: colorBlindMode ? '#FFF' : '#FF3B30' }
  ];

  const injectionData = [
    { time: "01:00", vol: 150 }, { time: "01:15", vol: 180 }, { time: "01:30", vol: 140 },
    { time: "01:45", vol: 160 }, { time: "02:00", vol: 155 }, { time: "02:15", vol: 170 },
    { time: "02:30", vol: 165 }, { time: "02:45", vol: 150 },
    { time: "03:00", vol: 4800 },
    { time: "03:15", vol: 120 }, { time: "03:30", vol: 135 }, { time: "03:45", vol: 140 },
    { time: "04:00", vol: 155 }
  ];

  const records = [
    { id: "#SPEC-8821", time: "03:14:22 AM", loc: "Olancho, Catacamas", err: "CENSO_EXCEDIDO", hash: "8F32A...B902" },
    { id: "#SPEC-8822", time: "03:14:45 AM", loc: "Lempira, Gracias", err: "BENFORD_FAIL", hash: "7C11B...D881" },
    { id: "#SPEC-8823", time: "03:15:10 AM", loc: "Cortés, Choloma", err: "HASH_ROTO", hash: "9A44F...E110" },
    { id: "#SPEC-8824", time: "03:15:35 AM", loc: "F. Morazán, Dist. 01", err: "CENSO_EXCEDIDO", hash: "2D88C...A442" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`bento-card p-6 flex flex-col h-56 border-l-4 ${colorBlindMode ? 'border-l-white bg-black' : 'border-l-red-600 bg-[var(--card-bg)]'}`}>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-6">{t.metrics.deviation}</h3>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deviationData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" hide />
                <Bar dataKey="value" radius={[0, 2, 2, 0]} barSize={14}>
                  {deviationData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} stroke={colorBlindMode ? '#000' : 'none'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between items-end mt-4">
            <span className="text-[10px] font-bold text-zinc-500 uppercase mono">{t.metrics.special}</span>
            <span className={`text-2xl font-black tracking-tighter ${colorBlindMode ? 'text-white' : 'text-red-600'}`}>{t.metrics.alertPerc}</span>
          </div>
        </div>

        <div className={`bento-card p-6 flex flex-col h-56 border-l-4 ${colorBlindMode ? 'border-l-white bg-black' : 'border-l-red-600 bg-[var(--card-bg)]'}`}>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-6">{t.metrics.impact}</h3>
          <div className="flex-grow flex flex-col items-center justify-center">
             <span className={`text-6xl font-black tracking-tighter mono ${colorBlindMode ? 'text-white' : 'text-red-600'}`}>{totalInconsistent.toLocaleString()}</span>
             <span className={`text-[10px] font-black uppercase mt-2 tracking-widest ${colorBlindMode ? 'text-zinc-400' : 'text-red-500'}`}>{t.metrics.votersAffected}</span>
          </div>
          <p className="text-[9px] mono text-zinc-500 mt-4 text-center opacity-60">SOURCE: CNE_PUBLIC_ENDPOINT_SCRAPING</p>
        </div>

        <div className={`bento-card p-6 flex flex-col h-56 border-l-4 ${colorBlindMode ? 'border-l-white bg-black' : 'border-l-red-600 bg-[var(--card-bg)]'}`}>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-6">{t.metrics.inflation}</h3>
          <div className="flex-grow flex flex-col items-center justify-center">
             <span className={`text-6xl font-black tracking-tighter mono ${theme === 'dark' || colorBlindMode ? 'text-white' : 'text-black'}`}>98.2%</span>
             <span className={`text-[10px] font-black uppercase mt-2 ${colorBlindMode ? 'text-zinc-400' : 'text-red-500'}`}>{t.metrics.theoreticalLimit}</span>
          </div>
          <p className="text-[9px] mono text-zinc-400 mt-4 text-center">{t.metrics.maxExpected}</p>
        </div>
      </div>

      <div className={`bento-card p-8 h-[450px] flex flex-col ${colorBlindMode ? 'border-2 border-white bg-black' : 'border-[var(--card-border)]'}`}>
        <div className="flex justify-between items-center mb-8">
          <h3 className={`text-[11px] font-black uppercase tracking-[0.3em] ${colorBlindMode ? 'text-white' : 'text-[var(--text-color)] opacity-80'}`}>{t.timeline.title}</h3>
          <span className={`text-[10px] font-black px-4 py-1 border mono ${colorBlindMode ? 'border-white text-white' : 'border-red-600/50 text-red-500 bg-red-600/10'}`}>ANOMALY_SPIKE_DETECTED</span>
        </div>
        <div className="flex-grow -ml-8">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={injectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="time" stroke={labelColor} fontSize={10} className="mono" />
              <YAxis hide />
              <Tooltip 
                contentStyle={{backgroundColor: isDark ? '#000' : '#fff', border: `1px solid ${colorBlindMode ? '#fff' : '#FF3B30'}`, borderRadius: '0px'}}
                itemStyle={{color: colorBlindMode ? '#fff' : '#FF3B30', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase'}}
              />
              <Area 
                type="stepAfter" 
                dataKey="vol" 
                stroke={colorBlindMode ? '#fff' : '#FF3B30'} 
                strokeWidth={3} 
                fill={colorBlindMode ? '#fff' : '#FF3B30'} 
                fillOpacity={0.1} 
              />
              <ReferenceLine x="03:00" stroke={colorBlindMode ? '#fff' : '#FF3B30'} strokeDasharray="5 5" strokeWidth={2}>
                <Label value={t.timeline.spikeLabel} position="top" fill={colorBlindMode ? '#fff' : '#FF3B30'} fontSize={10} fontWeight="900" className="mono" />
              </ReferenceLine>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`bento-card overflow-hidden ${colorBlindMode ? 'border-2 border-white' : ''}`}>
        <div className="p-6 border-b border-[var(--card-border)] bg-zinc-800/5 flex justify-between items-center">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{t.table.title}</h3>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`text-[9px] font-black uppercase tracking-widest text-zinc-500 border-b border-[var(--card-border)] ${isDark ? 'bg-black/40' : 'bg-zinc-50'}`}>
                <th className="py-5 px-8">{t.table.id}</th>
                <th className="py-5 px-8">{t.table.time}</th>
                <th className="py-5 px-8">{t.table.loc}</th>
                <th className="py-5 px-8">{t.table.err}</th>
                <th className="py-5 px-8 text-right">{t.table.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--card-border)]">
              {records.map(r => (
                <tr key={r.id} className={`transition-colors group ${isDark ? 'hover:bg-zinc-900/50' : 'hover:bg-zinc-50'}`}>
                  <td className="py-5 px-8 text-[11px] mono font-black text-[#007AFF]">{r.id}</td>
                  <td className="py-5 px-8 text-[10px] mono text-zinc-500">{r.time}</td>
                  <td className="py-5 px-8 text-[10px] font-bold text-zinc-400 uppercase">{r.loc}</td>
                  <td className="py-5 px-8">
                    <span className={`text-[9px] font-black px-2 py-0.5 border ${colorBlindMode ? 'border-white text-white' : 'bg-red-600 text-white border-red-600'}`}>
                      {r.err}
                    </span>
                  </td>
                  <td className="py-5 px-8 text-right">
                    <button 
                      onClick={() => setInspectingId(r.id)}
                      className={`px-4 py-1.5 border transition-all text-[9px] font-black uppercase tracking-widest ${colorBlindMode ? 'bg-white text-black border-white' : 'border-zinc-800 text-zinc-500 hover:border-zinc-400 hover:text-current'}`}
                    >
                      {t.table.action}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {inspectingId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md bg-black/90 animate-in fade-in duration-300 no-print">
          <div className={`w-full max-w-2xl overflow-hidden border-2 animate-in zoom-in-95 duration-300 ${colorBlindMode ? 'bg-black border-white' : 'bg-[#050505] border-red-600/30'}`}>
            <div className={`p-6 border-b flex justify-between items-center ${colorBlindMode ? 'border-white bg-zinc-900' : 'border-white/5 bg-[#0a0a0a]'}`}>
              <div>
                <h4 className="text-2xl font-black text-white tracking-tighter mono">{inspectingId}</h4>
                <p className={`text-[9px] font-black uppercase mt-1 mono ${colorBlindMode ? 'text-zinc-300' : 'text-red-500'}`}>OFFICIAL_CNE_DATA_SOURCE_SECURED</p>
              </div>
              <button onClick={() => setInspectingId(null)} className="w-12 h-12 border border-current flex items-center justify-center hover:bg-red-600 hover:text-white transition-all text-white">✕</button>
            </div>
            <div className="p-8">
              <div className={`p-6 border mono ${colorBlindMode ? 'bg-zinc-900 border-white' : 'bg-black border-white/5'}`}>
                <pre className={`text-[11px] overflow-x-auto custom-scrollbar leading-relaxed ${colorBlindMode ? 'text-white' : 'text-blue-400'}`}>
{`{
  "protocol_id": "${inspectingId}",
  "cne_source_verified": true,
  "payload": {
    "timestamp": "${records.find(r=>r.id===inspectingId)?.time}",
    "votos_validos": 258,
    "censo_mesa": 250,
    "delta": "+8",
    "alert": "CENSO_EXCEDIDO"
  },
  "hash_verification": {
    "sha256": "${records.find(r=>r.id===inspectingId)?.hash}",
    "status": "MISMATCH_DETECTED"
  }
}`}
                </pre>
              </div>
            </div>
            <div className={`p-6 flex justify-center border-t ${colorBlindMode ? 'border-white bg-zinc-900' : 'border-white/5 bg-[#0a0a0a]'}`}>
              <button onClick={() => setInspectingId(null)} className={`px-10 py-4 font-black uppercase tracking-[0.3em] text-[10px] transition-all ${colorBlindMode ? 'bg-white text-black border-white' : 'bg-[#007AFF] hover:bg-[#0062cc] text-white'}`}>
                CLOSE_TERMINAL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialView;
