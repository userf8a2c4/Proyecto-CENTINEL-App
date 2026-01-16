
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
      subtitle: "Forensic", 
      export: "PDF", 
      hash: "HASH",
      contrast: "CONTRASTE" 
    },
    EN: { 
      title: "CENTINEL", 
      subtitle: "Forensic", 
      export: "PDF", 
      hash: "HASH",
      contrast: "CONTRAST"
    }
  }[lang];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass h-14 md:h-16 flex items-center">
      <div className="max-w-7xl mx-auto px-4 md:px-6 w-full flex justify-between items-center">
        <div className="flex items-center gap-2 md:gap-4">
          <span className={`font-black text-lg md:text-xl tracking-tighter ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}>{t.title}</span>
          <div className={`hidden sm:block h-4 w-px ${theme === 'light' ? 'bg-zinc-300' : 'bg-zinc-800'}`}></div>
          <span className="hidden sm:block text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{t.subtitle}</span>
        </div>

        <div className="flex items-center gap-2 md:gap-3 no-print">
          <button 
            onClick={() => setColorBlindMode(!colorBlindMode)}
            className={`px-2 md:px-3 py-1.5 md:py-2 border transition-all ${colorBlindMode ? 'border-current bg-current text-current invert' : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}
          >
            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">{t.contrast}</span>
          </button>

          <button className={`hidden lg:flex px-4 py-2 border transition-all ${theme === 'light' ? 'border-zinc-300' : 'border-zinc-800 hover:border-zinc-600'}`}>
             <span className="text-[9px] font-black text-zinc-400 flex items-center gap-2">
                {t.hash}
             </span>
          </button>
          
          <button 
            onClick={() => window.print()}
            className={`px-3 md:px-5 py-1.5 md:py-2 transition-all ${colorBlindMode ? 'bg-white text-black border-2 border-black font-black' : 'bg-[#007BFF] hover:bg-blue-600 text-white'}`}
          >
            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">{t.export}</span>
          </button>

          <div className={`flex items-center border ${theme === 'light' ? 'border-zinc-300 bg-white' : 'border-zinc-800 bg-black'}`}>
            <button onClick={() => setLang(lang === 'ES' ? 'EN' : 'ES')} className={`mono text-[9px] md:text-[10px] font-black px-2 md:px-3 py-1 hover:bg-zinc-800 hover:text-white transition-colors border-r ${theme === 'light' ? 'border-zinc-300' : 'border-zinc-800'}`}>{lang}</button>
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              className={`text-xs md:text-sm px-2 md:px-3 py-1 hover:bg-zinc-800 hover:text-white transition-colors`}
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
