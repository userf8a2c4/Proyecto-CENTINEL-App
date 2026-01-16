
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import CitizenView from './components/CitizenView';
import AuditorView from './components/AuditorView';
import SpecialView from './components/SpecialView';
import SystemView from './components/SystemView';
import Timeline from './components/Timeline';
import Footer from './components/Footer';
import IntegrityMonitor from './components/IntegrityMonitor';
import { Language, ViewMode, Theme } from './types';
import { useElectionData } from './hooks/useElectionData';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ES');
  const [view, setView] = useState<ViewMode>('citizen');
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
      citizenBtn: "Vigilancia Ciudadana",
      auditorBtn: "Modo Auditor",
      specialBtn: "Actas Especiales",
      systemBtn: "Configuración",
      criticalBanner: "ALERTA DE SISTEMA: INYECCIÓN DE DATOS NO-LINEAL DETECTADA | INTEGRIDAD SHA-256 COMPROMETIDA EN 14.4% DE HASHES",
      sync: "SYNC"
    },
    EN: {
      citizenBtn: "Citizen Watch",
      auditorBtn: "Auditor Mode",
      specialBtn: "Special Records",
      systemBtn: "Configuration",
      criticalBanner: "SYSTEM ALERT: NON-LINEAR DATA INJECTION DETECTED | SHA-256 INTEGRITY COMPROMISED IN 14.4% OF HASHES",
      sync: "SYNC"
    }
  }[lang];

  const getSelectorStyle = (mode: ViewMode) => {
    const isActive = view === mode;
    const isSpecial = mode === 'special';
    
    if (isActive) {
      if (isSpecial) return 'bg-red-600 text-white shadow-lg shadow-red-900/20';
      return 'bg-blue-600 text-white shadow-lg shadow-blue-900/20';
    }

    return 'text-slate-400 hover:text-slate-100 hover:bg-slate-800';
  };

  return (
    <div className={`min-h-screen flex flex-col pb-44 transition-colors duration-300 ${colorBlindMode ? 'color-blind-active' : ''}`}>
      <Header 
        lang={lang} 
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        colorBlindMode={colorBlindMode}
        setColorBlindMode={setColorBlindMode}
      />
      
      <main className="flex-grow container mx-auto px-4 md:px-8 pt-24 md:pt-28 pb-12 max-w-7xl">
        <IntegrityMonitor lang={lang} data={filteredData} loading={loading} theme={theme} colorBlindMode={colorBlindMode} />

        {/* Banner de Evidencia Modernizado */}
        <div className={`py-3 mb-10 overflow-hidden flex items-center rounded-2xl border-2 ${colorBlindMode ? 'bg-white border-black' : 'bg-red-600/10 border-red-600/30 shadow-2xl shadow-red-900/10'}`}>
          <div className="whitespace-nowrap animate-[marquee_30s_linear_infinite] inline-block w-full">
            <span className={`font-extrabold text-[11px] md:text-sm px-10 uppercase tracking-widest ${colorBlindMode ? 'text-black' : 'text-red-500'}`}>{t.criticalBanner}</span>
            <span className={`font-extrabold text-[11px] md:text-sm px-10 uppercase tracking-widest ${colorBlindMode ? 'text-black' : 'text-red-500'}`}>{t.criticalBanner}</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6 mb-12 no-print">
          <nav className="flex flex-wrap gap-2 p-1.5 rounded-2xl border border-slate-700 bg-slate-900/50 backdrop-blur-md">
            <button 
              onClick={() => setView('citizen')} 
              className={`px-6 py-3 rounded-xl text-xs font-bold transition-all uppercase whitespace-nowrap ${getSelectorStyle('citizen')}`}
            >
              {t.citizenBtn}
            </button>
            <button 
              onClick={() => setView('auditor')} 
              className={`px-6 py-3 rounded-xl text-xs font-bold transition-all uppercase whitespace-nowrap ${getSelectorStyle('auditor')}`}
            >
              {t.auditorBtn}
            </button>
            <button 
              onClick={() => setView('special')} 
              className={`px-6 py-3 rounded-xl text-xs font-bold transition-all uppercase whitespace-nowrap relative ${getSelectorStyle('special')}`}
            >
              {t.specialBtn}
              {view !== 'special' && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
              )}
            </button>
            <button 
              onClick={() => setView('system')} 
              className={`px-6 py-3 rounded-xl text-xs font-bold transition-all uppercase whitespace-nowrap ${getSelectorStyle('system')}`}
            >
              {t.systemBtn}
            </button>
          </nav>
          
          <div className="flex items-center justify-between md:justify-end gap-8 font-semibold text-xs text-slate-500 mono">
             <div className="flex flex-col items-end">
                <span className="opacity-40 text-[10px] uppercase tracking-widest">Latency</span>
                <span className="text-slate-300">1.48ms</span>
             </div>
             <div className="flex items-center gap-3 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-emerald-500 tracking-widest uppercase">Live Core Connected</span>
             </div>
          </div>
        </div>

        {loading && !filteredData ? (
          <div className="h-96 flex flex-col items-center justify-center font-bold text-sm uppercase tracking-[0.5em] text-slate-600">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-8"></div>
            Synchronizing Node...
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            {view === 'citizen' && <CitizenView lang={lang} data={filteredData} selectedDept={selectedDept} setSelectedDept={setSelectedDept} theme={theme} colorBlindMode={colorBlindMode} />}
            {view === 'auditor' && <AuditorView lang={lang} data={filteredData} theme={theme} colorBlindMode={colorBlindMode} />}
            {view === 'special' && <SpecialView lang={lang} data={filteredData} theme={theme} colorBlindMode={colorBlindMode} />}
            {view === 'system' && <SystemView lang={lang} theme={theme} colorBlindMode={colorBlindMode} />}
          </div>
        )}
      </main>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl z-[60] no-print">
        <Timeline value={timeCursor} onChange={setTimeCursor} history={data?.history || []} theme={theme} colorBlindMode={colorBlindMode} />
      </div>

      <Footer lang={lang} />
    </div>
  );
};

export default App;
