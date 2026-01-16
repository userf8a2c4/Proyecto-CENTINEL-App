
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import CitizenView from './components/CitizenView';
import AuditorView from './components/AuditorView';
import SpecialView from './components/SpecialView';
import SystemView from './components/SystemView';
import Timeline from './components/Timeline';
import Footer from './components/Footer';
import { Language, ViewMode, Theme } from './types';
import { useElectionData } from './hooks/useElectionData';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ES');
  const [view, setView] = useState<ViewMode>('special');
  const [theme, setTheme] = useState<Theme>('dark');
  const [colorBlindMode, setColorBlindMode] = useState<boolean>(false);
  const [selectedDept, setSelectedDept] = useState<string>("Nivel Nacional");
  const [timeCursor, setTimeCursor] = useState<number>(100); 
  
  const { data, loading } = useElectionData();

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('light-theme');
    } else {
      root.classList.remove('light-theme');
    }
  }, [theme]);

  const filteredData = useMemo(() => {
    if (!data) return null;
    const historyCount = data.history.length;
    const limitIndex = Math.max(1, Math.floor((timeCursor / 100) * historyCount));
    const historySlice = data.history.slice(0, limitIndex);
    const lastPoint = historySlice[historySlice.length - 1];
    
    return {
      ...data,
      candidates: data.candidates.map(c => ({
        ...c,
        votes: (lastPoint[c.id] as number) || 0,
      })),
      history: historySlice,
      global: {
        ...data.global,
        processedPercent: Number((data.global.processedPercent * (timeCursor / 100)).toFixed(1)),
        participationPercent: Number((data.global.participationPercent * (timeCursor / 100)).toFixed(1))
      }
    };
  }, [data, timeCursor]);

  const t = {
    ES: {
      citizenBtn: "CIUDADANO",
      auditorBtn: "AUDITOR",
      specialBtn: "ESPECIAL",
      criticalBanner: "CRITICAL ALERT: NON-LINEAR DATA INJECTION DETECTED | SHA-256 VERIFIED | DELTA: 14.4%",
      sync: "SYNC"
    },
    EN: {
      citizenBtn: "CITIZEN",
      auditorBtn: "AUDITOR",
      specialBtn: "SPECIAL",
      criticalBanner: "CRITICAL ALERT: NON-LINEAR DATA INJECTION DETECTED | SHA-256 VERIFIED | DELTA: 14.4%",
      sync: "SYNC"
    }
  }[lang];

  const getSelectorStyle = (mode: ViewMode) => {
    const isActive = view === mode;
    const isSpecial = mode === 'special';
    
    if (colorBlindMode) {
      if (isActive) return 'bg-[var(--text-color)] text-[var(--bg-color)] border-2 border-[var(--text-color)] font-black z-10';
      return 'bg-transparent text-zinc-500 border border-zinc-800 opacity-60';
    }

    if (isActive) {
      if (isSpecial) return 'bg-red-600 text-white font-black';
      return theme === 'dark' ? 'bg-zinc-100 text-black font-black' : 'bg-zinc-900 text-white font-black';
    }

    return 'text-zinc-500 hover:text-current hover:bg-zinc-800/10';
  };

  return (
    <div className={`min-h-screen flex flex-col pb-36 transition-colors duration-300 ${colorBlindMode ? 'color-blind-active' : ''}`}>
      <Header 
        lang={lang} 
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        colorBlindMode={colorBlindMode}
        setColorBlindMode={setColorBlindMode}
      />
      
      <main className="flex-grow container mx-auto px-4 pt-20 md:pt-24 pb-12 max-w-7xl">
        {/* Banner de Evidencia - Industrial Theme */}
        <div className={`py-1.5 md:py-2 mb-6 md:mb-8 overflow-hidden flex items-center border-y border-[var(--card-border)] ${colorBlindMode ? 'bg-white' : 'bg-red-600'}`}>
          <div className="whitespace-nowrap animate-[marquee_25s_linear_infinite] inline-block w-full">
            <span className={`mono text-[9px] md:text-[10px] font-black px-4 md:px-8 uppercase tracking-widest ${colorBlindMode ? 'text-black' : 'text-white'}`}>{t.criticalBanner}</span>
            <span className={`mono text-[9px] md:text-[10px] font-black px-4 md:px-8 uppercase tracking-widest ${colorBlindMode ? 'text-black' : 'text-white'}`}>{t.criticalBanner}</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 no-print">
          <div className={`flex w-full md:w-auto p-1 border border-[var(--card-border)] bg-[var(--card-bg)] overflow-x-auto no-scrollbar`}>
            <button 
              onClick={() => setView('citizen')} 
              className={`flex-1 md:flex-none px-4 md:px-6 py-2 md:py-2.5 text-[9px] md:text-[10px] tracking-[0.1em] md:tracking-[0.2em] transition-all uppercase whitespace-nowrap ${getSelectorStyle('citizen')}`}
            >
              {t.citizenBtn}
            </button>
            <button 
              onClick={() => setView('auditor')} 
              className={`flex-1 md:flex-none px-4 md:px-6 py-2 md:py-2.5 text-[9px] md:text-[10px] tracking-[0.1em] md:tracking-[0.2em] transition-all uppercase border-x border-[var(--card-border)] whitespace-nowrap ${getSelectorStyle('auditor')}`}
            >
              {t.auditorBtn}
            </button>
            <button 
              onClick={() => setView('special')} 
              className={`flex-1 md:flex-none px-4 md:px-6 py-2 md:py-2.5 text-[9px] md:text-[10px] tracking-[0.1em] md:tracking-[0.2em] relative transition-all uppercase whitespace-nowrap ${getSelectorStyle('special')}`}
            >
              {view === 'special' && !colorBlindMode && (
                <span className="absolute top-1 right-1 md:right-2 w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full animate-pulse"></span>
              )}
              {t.specialBtn}
            </button>
            <button 
              onClick={() => setView('system')} 
              title="SISTEMA // PROTOCOLO"
              className={`flex-1 md:flex-none px-6 py-2 md:py-2.5 text-[9px] md:text-[10px] transition-all uppercase border-l border-[var(--card-border)] flex items-center justify-center whitespace-nowrap ${getSelectorStyle('system')}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </button>
          </div>
          <div className="flex w-full md:w-auto justify-between md:justify-end items-center gap-6 mono text-[9px] md:text-[10px] opacity-60">
             <span className="font-bold whitespace-nowrap">{t.sync}: 1.48ms</span>
             <div className={`flex items-center gap-2`}>
                <span className="w-1.5 h-1.5 bg-green-500 rounded-none"></span>
                <span className="tracking-widest">LIVE_CORE</span>
             </div>
          </div>
        </div>

        {loading && !filteredData ? (
          <div className="h-64 md:h-96 flex flex-col items-center justify-center mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.5em] opacity-30 italic">
            <div className="w-8 h-8 md:w-12 md:h-12 border-2 border-current border-t-transparent animate-spin mb-4"></div>
            LINKING...
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {view === 'citizen' && <CitizenView lang={lang} data={filteredData} selectedDept={selectedDept} setSelectedDept={setSelectedDept} theme={theme} colorBlindMode={colorBlindMode} />}
            {view === 'auditor' && <AuditorView lang={lang} data={filteredData} theme={theme} colorBlindMode={colorBlindMode} />}
            {view === 'special' && <SpecialView lang={lang} data={filteredData} theme={theme} colorBlindMode={colorBlindMode} />}
            {view === 'system' && <SystemView lang={lang} theme={theme} colorBlindMode={colorBlindMode} />}
          </div>
        )}
      </main>

      <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 w-[95%] md:w-[90%] max-w-5xl z-[60] no-print">
        <Timeline value={timeCursor} onChange={setTimeCursor} history={data?.history || []} theme={theme} colorBlindMode={colorBlindMode} />
      </div>

      <Footer lang={lang} />
    </div>
  );
};

export default App;
