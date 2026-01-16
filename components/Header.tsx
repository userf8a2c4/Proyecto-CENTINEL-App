
import React from 'react';
import { Language, Theme } from '../types';

interface HeaderProps {
  lang: Language;
  setLang: (l: Language) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  colorBlindMode: boolean;
  setColorBlindMode: (b: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  lang, setLang, theme, setTheme, colorBlindMode, setColorBlindMode
}) => {
  const t = {
    ES: { 
      title: "CENTINEL", 
      subtitle: "AUDITORÍA FORENSE", 
      export: "Reporte PDF", 
      hash: "Hash de Sesión",
      contrast: "Contraste" 
    },
    EN: { 
      title: "CENTINEL", 
      subtitle: "FORENSIC AUDIT", 
      export: "PDF Report", 
      hash: "Session Hash",
      contrast: "Contrast"
    }
  }[lang];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass h-16 md:h-20 flex items-center">
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className={`font-extrabold text-xl md:text-2xl tracking-tight leading-none ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{t.title}</span>
            <span className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">{t.subtitle}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 no-print">
          <div className="hidden lg:flex items-center gap-4 mr-4 text-slate-400 font-medium text-xs">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              CNE_GATEWAY_UP
            </span>
          </div>

          <button 
            onClick={() => setColorBlindMode(!colorBlindMode)}
            className={`hidden sm:flex px-4 py-2 rounded-xl border font-semibold text-xs transition-all ${colorBlindMode ? 'bg-slate-900 text-white border-white' : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800/50'}`}
          >
            {t.contrast}
          </button>
          
          <button 
            onClick={() => window.print()}
            className={`px-4 md:px-6 py-2 rounded-xl transition-all font-bold text-xs md:text-sm shadow-lg ${colorBlindMode ? 'bg-white text-black border-2 border-black' : 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/10 hover:shadow-red-500/20'}`}
          >
            {t.export}
          </button>

          <div className={`flex items-center rounded-xl overflow-hidden border ${theme === 'light' ? 'border-slate-300' : 'border-slate-700'}`}>
            <button 
              onClick={() => setLang(lang === 'ES' ? 'EN' : 'ES')} 
              className="text-xs font-bold px-4 py-2 hover:bg-slate-800 transition-colors border-r border-slate-700"
            >
              {lang}
            </button>
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              className="text-sm px-4 py-2 hover:bg-slate-800 transition-colors"
            >
               {theme === 'dark' ? '☼' : '☾'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
