
import React from 'react';
import { Language } from '../types';

interface FooterProps {
  lang: Language;
}

const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = {
    ES: {
      subtitle: "C.E.N.T.I.N.E.L. es un esfuerzo colectivo por la transparencia.",
      repoLabel: "Repositorio GitHub",
      repoAction: "Revisa y Fork en dev-v4",
      disclaimerTitle: "INTEGRIDAD TÉCNICA",
      disclaimerText: "Análisis basado en payloads JSON oficiales (CNE) sellados criptográficamente (SHA-256) para asegurar una cadena de custodia digital íntegra.",
      rights: "© 2026 Proyecto CENTINEL",
      terms: "Términos",
      privacy: "Privacidad",
      method: "Metodología"
    },
    EN: {
      subtitle: "C.E.N.T.I.N.E.L. is a collective effort for transparency.",
      repoLabel: "GitHub Repository",
      repoAction: "Review & Fork on dev-v4",
      disclaimerTitle: "TECHNICAL INTEGRITY",
      disclaimerText: "Analysis based on official JSON payloads (CNE) cryptographically sealed (SHA-256) to ensure an intact digital chain of custody.",
      rights: "© 2026 Project CENTINEL",
      terms: "Terms",
      privacy: "Privacy",
      method: "Methodology"
    }
  }[lang];

  return (
    <footer className="glass border-t border-gray-100 dark:border-white/10 mt-auto py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
        <div className="text-center md:text-left">
          <p className="text-gray-500 dark:text-gray-400 font-bold text-sm">
            {t.subtitle}
          </p>
        </div>

        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex items-center gap-4 bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-black uppercase tracking-widest opacity-60">
              {t.repoLabel}
            </span>
            <span className="text-xs font-black">
              {t.repoAction}
            </span>
          </div>
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="p-5 rounded-3xl bg-zinc-500/5 border border-zinc-500/10">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <svg className="w-4 h-4 text-[#007AFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="flex flex-wrap items-center gap-x-4">
              <h5 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#007AFF]">
                {t.disclaimerTitle}
              </h5>
              <p className="text-[10px] md:text-xs font-bold opacity-60">
                {t.disclaimerText}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-gray-100 dark:border-white/10 flex flex-col md:flex-row justify-between items-center text-[9px] font-black text-gray-400 uppercase tracking-widest gap-4">
         <span>{t.rights}</span>
         <div className="flex gap-6">
            <span className="cursor-pointer hover:text-[#007AFF]">{t.terms}</span>
            <span className="cursor-pointer hover:text-[#007AFF]">{t.privacy}</span>
            <span className="cursor-pointer hover:text-[#007AFF]">{t.method}</span>
         </div>
      </div>
    </footer>
  );
};

export default Footer;
