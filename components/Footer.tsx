
import React from 'react';
import { Language } from '../types';

interface FooterProps {
  lang: Language;
}

const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = {
    ES: {
      subtitle: "CENTINEL es un esfuerzo colectivo ciudadano por la transparencia electoral.",
      repoLabel: "Auditoría de Código",
      repoAction: "Explorar dev-v4 en GitHub",
      disclaimerTitle: "TRANSPARENCIA RADICAL",
      disclaimerText: "Análisis basado exclusivamente en datos públicos del CNE procesados mediante hashing SHA-256 para garantizar una cadena de custodia digital inmutable.",
      rights: "© 2026 PROYECTO CENTINEL",
      terms: "Términos de Uso",
      privacy: "Privacidad de Datos",
      method: "Metodología Forense"
    },
    EN: {
      subtitle: "CENTINEL is a collective citizen effort for electoral transparency.",
      repoLabel: "Code Audit",
      repoAction: "Explore dev-v4 on GitHub",
      disclaimerTitle: "RADICAL TRANSPARENCY",
      disclaimerText: "Analysis based exclusively on official CNE public data processed via SHA-256 hashing to guarantee an immutable digital chain of custody.",
      rights: "© 2026 PROJECT CENTINEL",
      terms: "Terms of Use",
      privacy: "Data Privacy",
      method: "Forensic Methodology"
    }
  }[lang];

  return (
    <footer className="glass border-t border-slate-800/50 mt-auto py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="bg-blue-600 p-1.5 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
             </div>
             <span className="font-black text-xl tracking-tighter">CENTINEL</span>
          </div>
          <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-xs">
            {t.subtitle}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
           <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">
             {t.disclaimerTitle}
           </h5>
           <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
             "{t.disclaimerText}"
           </p>
        </div>

        <div className="flex flex-col justify-center">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-5 bg-slate-100 text-slate-900 px-6 py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-slate-900/20"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-50">
                {t.repoLabel}
              </span>
              <span className="text-sm font-extrabold tracking-tight">
                {t.repoAction}
              </span>
            </div>
          </a>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest gap-6">
         <span>{t.rights}</span>
         <div className="flex gap-10">
            <span className="cursor-pointer hover:text-blue-500 transition-colors">{t.terms}</span>
            <span className="cursor-pointer hover:text-blue-500 transition-colors">{t.privacy}</span>
            <span className="cursor-pointer hover:text-blue-500 transition-colors">{t.method}</span>
         </div>
      </div>
    </footer>
  );
};

export default Footer;
