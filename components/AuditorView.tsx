
import React, { useState } from 'react';
import { Language, ElectionData, Protocol, Theme } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, AreaChart, Area, ScatterChart, Scatter, ZAxis, Legend
} from 'recharts';

interface AuditorViewProps {
  lang: Language;
  data: ElectionData | null;
  theme: Theme;
  colorBlindMode: boolean;
}

const AuditorView: React.FC<AuditorViewProps> = ({ lang, data, theme, colorBlindMode }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'dispersion' | 'ledger'>('stats');
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(data?.latestProtocols[0] || null);

  const isDark = theme === 'dark';
  const chartColor = isDark ? '#666' : '#94A3B8';
  const gridColor = isDark ? '#1F1F1F' : '#E5E5E5';
  const tooltipBg = isDark ? '#000' : '#fff';
  
  const t = {
    ES: {
      stats: "FLUJO", dispersion: "DISPERSIÓN", ledger: "ACTAS",
      statsTitle: "PROGRESIÓN TEMPORAL",
      benfordTitle: "LEY DE BENFORD",
      correlationTitle: "CORRELACIÓN TÉCNICA",
      ledgerTitle: "REGISTRO DE PROTOCOLOS",
      inspector: "INSPECTOR",
      verified: "OK",
      fail: "ERROR",
      expected: "Exp",
      actual: "Obs"
    },
    EN: {
      stats: "FLOW", dispersion: "SCATTER", ledger: "RECORDS",
      statsTitle: "TIME PROGRESSION",
      benfordTitle: "BENFORD'S LAW",
      correlationTitle: "TECHNICAL CORRELATION",
      ledgerTitle: "PROTOCOL LOG",
      inspector: "INSPECTOR",
      verified: "OK",
      fail: "FAIL",
      expected: "Exp",
      actual: "Obs"
    }
  }[lang];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Tabs Responsivos */}
      <div className="flex w-full p-1 border border-[var(--card-border)] bg-[var(--card-bg)] no-print">
        {['stats', 'dispersion', 'ledger'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)} 
            className={`flex-1 px-2 py-3 text-[8px] md:text-[10px] font-black tracking-widest transition-all uppercase border-r last:border-0 border-[var(--card-border)] ${activeTab === tab ? (colorBlindMode ? 'bg-white text-black' : 'bg-zinc-100 dark:bg-white dark:text-black text-black') : 'text-zinc-500'}`}
          >
            {t[tab as keyof typeof t]}
          </button>
        ))}
      </div>

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bento-card p-3 md:p-6 h-[300px] md:h-[400px] flex flex-col">
            <h3 className="text-[9px] md:text-[10px] font-black tracking-[0.2em] uppercase mb-4 opacity-50">{t.statsTitle}</h3>
            <div className="flex-grow -ml-6 md:-ml-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.history || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="time" stroke={chartColor} fontSize={8} className="mono" />
                  <YAxis stroke={chartColor} fontSize={8} className="mono" />
                  <Tooltip contentStyle={{backgroundColor: tooltipBg, border: `1px solid ${gridColor}`, fontSize: '9px'}} />
                  <Area type="monotone" name="NASRY" dataKey="nasry" stroke="#007BFF" fill="#007BFF" fillOpacity={0.1} strokeWidth={2} />
                  <Area type="monotone" name="SALVADOR" dataKey="salvador" stroke="#FF0000" fill="#FF0000" fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bento-card p-3 md:p-6 h-[300px] md:h-[400px] flex flex-col">
            <h3 className="text-[9px] md:text-[10px] font-black tracking-[0.2em] uppercase mb-4 opacity-50">{t.benfordTitle}</h3>
            <div className="flex-grow -ml-6 md:-ml-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.benford || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="digit" stroke={chartColor} fontSize={8} className="mono" />
                  <YAxis stroke={chartColor} fontSize={8} className="mono" />
                  <Bar name={t.expected} dataKey="expected" fill={isDark ? "#222" : "#DDD"} barSize={15} />
                  <Bar name={t.actual} dataKey="actual" fill={colorBlindMode ? "#fff" : "#007BFF"} barSize={15}>
                    {data?.benford.map((entry, index) => (
                      <Cell key={index} fill={Math.abs(entry.actual - entry.expected) > 3 ? '#FF0000' : (colorBlindMode ? '#fff' : '#007BFF')} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'dispersion' && (
        <div className="bento-card p-3 md:p-6 h-[400px] md:h-[500px] flex flex-col">
          <h3 className="text-[9px] md:text-[10px] font-black tracking-[0.2em] uppercase mb-4 opacity-50">{t.correlationTitle}</h3>
          <div className="flex-grow -ml-6 md:-ml-8">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis type="number" dataKey="participation" name="Part" unit="%" stroke={chartColor} fontSize={8} domain={[0, 100]} />
                <YAxis type="number" dataKey="winnerVoteShare" name="Votos" unit="%" stroke={chartColor} fontSize={8} domain={[0, 100]} />
                <ZAxis type="number" range={[30, 200]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{backgroundColor: tooltipBg, border: `1px solid ${gridColor}`, fontSize: '9px'}} />
                <Scatter name="Centros" data={data?.outliers || []} fill={colorBlindMode ? "#fff" : "#007BFF"}>
                  {data?.outliers.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isAnomaly ? '#FF0000' : (colorBlindMode ? '#fff' : '#007BFF')} fillOpacity={entry.isAnomaly ? 1 : 0.4} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'ledger' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7 bento-card overflow-hidden flex flex-col h-[400px] md:h-auto">
            <div className="p-3 border-b flex justify-between items-center bg-zinc-900/10">
              <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] text-zinc-500">{t.ledgerTitle}</h3>
            </div>
            <div className="overflow-x-auto custom-scrollbar flex-grow relative">
              <table className="w-full text-left border-collapse min-w-[400px]">
                <thead className="sticky top-0 bg-[var(--card-bg)] z-10">
                  <tr className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-zinc-500 border-b border-[var(--card-border)]">
                    <th className="py-3 px-3 md:px-6">ID</th>
                    <th className="py-3 px-3 md:px-6">STATUS</th>
                    <th className="py-3 px-3 md:px-6 text-right">TIME</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--card-border)]">
                  {data?.latestProtocols.map(p => (
                    <tr 
                      key={p.id} 
                      className={`cursor-pointer transition-colors ${selectedProtocol?.id === p.id ? (isDark ? 'bg-zinc-800' : 'bg-zinc-100') : 'hover:bg-zinc-900/50'}`} 
                      onClick={() => setSelectedProtocol(p)}
                    >
                      <td className="py-3 px-3 md:px-6 text-[9px] mono font-bold text-[#007BFF]">{p.id.split('-').pop()}</td>
                      <td className="py-3 px-3 md:px-6">
                        <span className={`text-[7px] font-black px-1 py-0.5 border ${p.verified ? 'border-green-600/30 text-green-500' : 'border-red-600/30 text-red-500'}`}>
                          {p.verified ? t.verified : t.fail}
                        </span>
                      </td>
                      <td className="py-3 px-3 md:px-6 text-right text-[8px] mono opacity-40">{new Date(p.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-5 bento-card p-4 flex flex-col">
            <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">{t.inspector}</h3>
            {selectedProtocol ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-black/20 border border-zinc-800">
                    <label className="text-[7px] font-black text-zinc-600 block mb-0.5 uppercase">UID</label>
                    <p className="text-[10px] mono font-black truncate">{selectedProtocol.id}</p>
                  </div>
                  <div className="p-2 bg-black/20 border border-zinc-800">
                    <label className="text-[7px] font-black text-zinc-600 block mb-0.5 uppercase">DEPT</label>
                    <p className="text-[10px] font-black truncate">{selectedProtocol.deptId.split(' ').pop()}</p>
                  </div>
                </div>
                <div className="border border-zinc-800/50 overflow-hidden">
                  <div className="p-3 bg-black/40 h-48 md:h-64 overflow-y-auto custom-scrollbar">
                    <pre className="text-[8px] md:text-[10px] mono text-[#007BFF] leading-relaxed whitespace-pre-wrap">
                      {JSON.stringify(JSON.parse(selectedProtocol.jsonData), null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center opacity-20 mono text-[10px]">SELECT_RECORD</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditorView;
