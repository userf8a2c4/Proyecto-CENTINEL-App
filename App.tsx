
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import CitizenView from './components/CitizenView';
import AuditorView from './components/AuditorView';
import SystemView from './components/SystemView';
import Timeline from './components/Timeline';
import IntegrityMonitor from './components/IntegrityMonitor';
import { Language, ViewMode, Theme, Protocol, ElectionData } from './types';
import { useElectionData } from './hooks/useElectionData';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ES');
  const [view, setView] = useState<ViewMode>('citizen');
  const [theme, setTheme] = useState<Theme>('light');
  const [accessibilityMode, setAccessibilityMode] = useState<'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'high-contrast'>('none');
  const [selectedDept, setSelectedDept] = useState<string>("Nivel Nacional");
  const [timeCursor, setTimeCursor] = useState<number>(100); 
  const [targetProtocol, setTargetProtocol] = useState<Protocol | null>(null);
  const [auditorSubTab, setAuditorSubTab] = useState<'stats' | 'dispersion' | 'alerts' | 'ledger'>('stats');
  
  const { data, loading, error } = useElectionData();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light-theme', 'dark-theme');
    root.classList.add(`${theme}-theme`);
  }, [theme]);

  // Lógica de reconstrucción de estado basada en los 96 archivos
  const filteredData = useMemo(() => {
    if (!data || !data.history || data.history.length === 0) return data;

    const historyCount = data.history.length;
    // Mapeo preciso: el cursor 0-100 se convierte en índice 0 a (N-1)
    const index = Math.min(
      Math.floor((timeCursor / 100) * historyCount),
      historyCount - 1
    );
    
    const historySlice = data.history.slice(0, index + 1);
    const currentPoint = data.history[index];
    
    // El progreso se basa en la posición del archivo dentro de la serie de 96
    const progressFactor = (index + 1) / historyCount;
    
    return {
      ...data,
      candidates: data.candidates.map(c => ({
        ...c,
        votes: typeof currentPoint[c.id] === 'number' ? (currentPoint[c.id] as number) : 0,
      })),
      history: historySlice,
      global: {
        ...data.global,
        processedPercent: Number((data.global.processedPercent * progressFactor).toFixed(2)),
        participationPercent: currentPoint.participation ? Number(currentPoint.participation) : data.global.participationPercent,
        trend: `AUDITANDO ARCHIVO ${index + 1} / ${historyCount} (${currentPoint.time})`
      }
    } as ElectionData;
  }, [data, timeCursor]);

  const handleAlertJump = (protocol: Protocol) => {
    setView('auditor');
    setAuditorSubTab('ledger');
    setTargetProtocol(protocol);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const t = {
    ES: { citizen: "CIUDADANO", auditor: "AUDITOR", ethos: "ETHOS", loading: "SINCRONIZANDO...", error: "ERROR DE DATOS" },
    EN: { citizen: "CITIZEN", auditor: "AUDITOR", ethos: "ETHOS", loading: "SYNCING...", error: "DATA ERROR" }
  }[lang];

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-700 pb-64 ${theme === 'dark' ? 'bg-black text-white' : 'bg-[#f5f5f7] text-[#1d1d1f]'}`}>
      <Header 
        lang={lang} setLang={setLang}
        theme={theme} setTheme={setTheme}
        accessibilityMode={accessibilityMode}
        setAccessibilityMode={setAccessibilityMode}
        data={filteredData}
      />
      
      <main className="flex-grow px-4 sm:px-8 md:px-12 lg:px-16 pt-24 md:pt-32 max-w-[1800px] mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          <IntegrityMonitor lang={lang} data={filteredData} loading={loading} theme={theme} colorBlindMode={accessibilityMode !== 'none'} />
          
          <div className={`flex p-1 rounded-full border transition-all ${theme === 'dark' ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-black/5'}`}>
            <div className="flex">
              {[
                { id: 'citizen', label: t.citizen },
                { id: 'auditor', label: t.auditor },
                { id: 'system', label: t.ethos }
              ].map((btn) => (
                <button 
                  key={btn.id}
                  onClick={() => setView(btn.id as ViewMode)} 
                  className={`px-8 py-3 text-[10px] font-black tracking-widest rounded-full transition-all ${
                    view === btn.id 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
            <p className="text-red-500 text-[10px] font-black tracking-widest uppercase">{t.error}: {error}</p>
          </div>
        )}

        {loading && !data ? (
          <div className="h-[50vh] flex flex-col items-center justify-center">
             <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
             <span className="text-[10px] font-black tracking-[0.5em] opacity-30 uppercase">{t.loading}</span>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {view === 'citizen' && (
              <CitizenView 
                lang={lang} data={filteredData} 
                selectedDept={selectedDept} setSelectedDept={setSelectedDept}
                theme={theme} colorBlindMode={accessibilityMode !== 'none'} 
              />
            )}
            {view === 'auditor' && (
              <AuditorView 
                lang={lang} data={filteredData} 
                theme={theme} colorBlindMode={accessibilityMode !== 'none'}
                activeTab={auditorSubTab}
                setActiveTab={setAuditorSubTab}
                preselectedProtocol={targetProtocol}
              />
            )}
            {view === 'system' && (
              <SystemView 
                lang={lang} theme={theme} colorBlindMode={accessibilityMode !== 'none'} 
                data={filteredData}
              />
            )}
          </div>
        )}
      </main>

      <Timeline 
        value={timeCursor} onChange={setTimeCursor} 
        history={data?.history || []} 
        theme={theme} lang={lang}
        candidates={data?.candidates || []}
        protocols={data?.latestProtocols || []}
        onAlertClick={handleAlertJump}
      />
    </div>
  );
};

export default App;
