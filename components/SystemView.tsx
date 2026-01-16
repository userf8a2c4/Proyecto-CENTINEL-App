
import React, { useState } from 'react';
import { Language, Theme } from '../types';

interface SystemViewProps {
  lang: Language;
  theme: Theme;
  colorBlindMode: boolean;
}

interface DiaryEntry {
  date: string;
  type: 'FIX' | 'CORE' | 'UI' | 'SECURITY';
  msg: string;
  file: string;
}

const SystemView: React.FC<SystemViewProps> = ({ lang, theme, colorBlindMode }) => {
  const [activeTab, setActiveTab] = useState<'config' | 'diary' | 'intent'>('config');
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [loadingFile, setLoadingFile] = useState(false);

  const t = {
    ES: {
      tabs: { config: "CONFIGURACIÓN", diary: "DEV DIARY", intent: "MANIFIESTO" },
      config: {
        title: "SENSORES DE AUDITORÍA ACTIVOS",
        rule: "REGLA", status: "ESTADO", value: "UMBRAL",
        rules: [
          { id: "B_SIGMA", name: "Análisis Benford (Sigma 3)", status: "ACTIVO", val: "5.0%", desc: "Detecta desviaciones matemáticas en el primer dígito." },
          { id: "C_INFL", name: "Detección de Inflación Censo", status: "ACTIVO", val: "> 95%", desc: "Alerta centros con más votos que votantes registrados." },
          { id: "H_INTEG", name: "Integridad Hash SHA-256", status: "ACTIVO", val: "STRICT", desc: "Verifica que el JSON no haya sido modificado post-emisión." },
          { id: "P_DYN", name: "Delta de Participación Dinámica", status: "MONITOREO", val: "+20% /h", desc: "Detecta picos de carga no lineales." }
        ]
      },
      diary: {
        title: "DEV DIARY // REPOSITORIO CENTRAL",
        inspect: "LEER DOCUMENTO",
        back: "VOLVER AL ÍNDICE",
        entries: [
          { date: "2025-11-28", type: "CORE", msg: "Actualización de Estructura de Datos V4", file: "2025-11-28-v4-structure.md" },
          { date: "2025-11-27", type: "SECURITY", msg: "Protocolos de Validación Criptográfica", file: "2025-11-27-crypto-validation.md" },
          { date: "2025-11-26", type: "UI", msg: "Refactorización de Interfaz Forense", file: "2025-11-26-ui-refactor.md" }
        ] as DiaryEntry[]
      },
      intent: {
        title: "DECLARACIÓN DE INTENCIONES",
        body: [
          "CENTINEL no es un ente oficial, es un microscopio digital ciudadano.",
          "Nuestra misión es la transparencia radical: cada dato debe ser rastreable hasta su origen criptográfico.",
          "Neutralidad tecnológica: los algoritmos no tienen partido, solo procesan evidencias.",
          "El código es abierto para que la vigilancia sea compartida y la verdad sea inmutable."
        ]
      }
    },
    EN: {
      tabs: { config: "CONFIG", diary: "DEV DIARY", intent: "MANIFESTO" },
      config: {
        title: "ACTIVE AUDIT SENSORS",
        rule: "RULE", status: "STATUS", value: "THRESHOLD",
        rules: [
          { id: "B_SIGMA", name: "Benford Analysis (Sigma 3)", status: "ACTIVE", val: "5.0%", desc: "Detects mathematical deviations in the first digit." },
          { id: "C_INFL", name: "Census Inflation Detection", status: "ACTIVE", val: "> 95%", desc: "Alerts centers with more votes than registered voters." },
          { id: "H_INTEG", name: "SHA-256 Hash Integrity", status: "ACTIVE", val: "STRICT", desc: "Verifies JSON was not modified post-issuance." },
          { id: "P_DYN", name: "Dynamic Participation Delta", status: "MONITOR", val: "+20% /h", desc: "Detects non-linear load spikes." }
        ]
      },
      diary: {
        title: "DEV DIARY // CENTRAL REPOSITORY",
        inspect: "READ DOCUMENT",
        back: "BACK TO INDEX",
        entries: [
          { date: "2025-11-28", type: "CORE", msg: "Data Structure Update V4", file: "2025-11-28-v4-structure.md" },
          { date: "2025-11-27", type: "SECURITY", msg: "Cryptographic Validation Protocols", file: "2025-11-27-crypto-validation.md" },
          { date: "2025-11-26", type: "UI", msg: "Forensic Interface Refactor", file: "2025-11-26-ui-refactor.md" }
        ] as DiaryEntry[]
      },
      intent: {
        title: "STATEMENT OF INTENT",
        body: [
          "CENTINEL is not an official entity; it is a citizen digital microscope.",
          "Our mission is radical transparency: every data point must be traceable to its cryptographic origin.",
          "Technological neutrality: algorithms have no party; they only process evidence.",
          "Code is open so surveillance is shared and truth remains immutable."
        ]
      }
    }
  }[lang];

  const fetchDiaryFile = async (entry: DiaryEntry) => {
    setLoadingFile(true);
    setSelectedEntry(entry);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      // Contenido extenso simulado para probar el scroll
      setFileContent(`---
SOURCE: sentinel/Dev Diary/${entry.file}
BRANCH: dev-v4
INTEGRITY: SHA-256_VERIFIED
---

# ${entry.msg}

Documento técnico recuperado de la bitácora de desarrollo de Centinel. Este archivo detalla los cambios estructurales realizados para garantizar la transparencia radical del proceso.

## Detalles de Implementación
- Actualización de los punteros de configuración global.
- Sincronización de los sensores de auditoría con la base de datos distribuida.
- Refuerzo de la capa de visualización para dispositivos móviles.
- Implementación de lógica de validación cruzada entre departamentos.
- Optimización de los tiempos de respuesta del motor de renderizado forense.

### Notas Técnicas Adicionales
Para asegurar que cada usuario pueda verificar la procedencia de los datos, hemos implementado una capa de 'Truth-Sealing' en cada respuesta del servidor. Esto permite que el cliente valide el HASH localmente antes de mostrar cualquier gráfica.

## Próximos Pasos
1. Integración con nodos de observación internacional.
2. Despliegue de la red de verificación redundante.
3. Auditoría de código por parte de entidades independientes.

> "El escrutinio público es la única garantía de integridad electoral."

Este diario de desarrollo sirve como bitácora inmutable de cada decisión técnica tomada durante la vigencia del Proyecto CENTINEL. Invitamos a la comunidad a realizar auditorías de caja blanca sobre nuestra rama dev-v4.

---
Sincronizado el: ${new Date().toISOString()}
Firma Digital: [VERIFIED_SHA256_STAMP]
---`);
    } catch (err) {
      setFileContent("Error: No se pudo establecer conexión con el repositorio para recuperar el archivo .md");
    } finally {
      setLoadingFile(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row w-full p-1 border border-[var(--card-border)] bg-[var(--card-bg)]">
        {(['config', 'diary', 'intent'] as const).map((tab) => (
          <button 
            key={tab}
            onClick={() => { setActiveTab(tab); setSelectedEntry(null); }} 
            className={`px-4 py-2.5 text-[9px] md:text-[10px] font-black tracking-widest transition-all uppercase border-b md:border-b-0 md:border-r last:border-0 border-[var(--card-border)] ${activeTab === tab ? (colorBlindMode ? 'bg-white text-black' : 'bg-zinc-100 dark:bg-white dark:text-black text-black') : 'text-zinc-500 hover:text-current hover:bg-zinc-800/10'}`}
          >
            {t.tabs[tab]}
          </button>
        ))}
      </div>

      {activeTab === 'config' && (
        <div className="bento-card overflow-hidden">
          <div className="p-4 border-b border-[var(--card-border)] flex justify-between items-center bg-zinc-800/5">
            <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-zinc-500">{t.config.title}</h3>
            <span className="text-[8px] mono text-green-500 font-bold tracking-widest">LIVE_VALIDATION_ON</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-zinc-500 border-b border-[var(--card-border)]">
                  <th className="py-4 px-6">{t.config.rule}</th>
                  <th className="py-4 px-6">{t.config.status}</th>
                  <th className="py-4 px-6">{t.config.value}</th>
                  <th className="py-4 px-6">DESCRIPTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--card-border)]">
                {t.config.rules.map(rule => (
                  <tr key={rule.id} className="hover:bg-zinc-800/5 transition-colors">
                    <td className="py-4 px-6 text-[10px] font-black">{rule.name}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${rule.status === 'ACTIVO' || rule.status === 'ACTIVE' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-yellow-500 animate-pulse'}`}></span>
                        <span className="text-[9px] font-bold mono">{rule.status}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[10px] mono font-bold text-blue-500">{rule.val}</td>
                    <td className="py-4 px-6 text-[9px] text-zinc-500 mono leading-relaxed">{rule.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'diary' && (
        <div className="bento-card overflow-hidden flex flex-col h-[600px]">
          <div className={`p-4 border-b border-[var(--card-border)] flex-shrink-0 flex justify-between items-center ${theme === 'light' ? 'bg-zinc-50' : 'bg-zinc-900/50'}`}>
            <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-zinc-500">{selectedEntry ? selectedEntry.date : t.diary.title}</h3>
            {selectedEntry && (
              <button 
                onClick={() => setSelectedEntry(null)} 
                className="text-[9px] font-black uppercase tracking-widest px-3 py-1 border border-[var(--card-border)] hover:bg-zinc-800 hover:text-white transition-all"
              >
                {t.diary.back}
              </button>
            )}
          </div>

          <div className="flex-grow overflow-y-auto custom-scrollbar">
            {!selectedEntry ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-zinc-500 border-b border-[var(--card-border)] sticky top-0 bg-[var(--card-bg)]">
                      <th className="py-4 px-6">DATE</th>
                      <th className="py-4 px-6">TYPE</th>
                      <th className="py-4 px-6">FILE_NAME</th>
                      <th className="py-4 px-6 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--card-border)]">
                    {t.diary.entries.map((entry, i) => (
                      <tr key={i} className="hover:bg-zinc-800/5 transition-colors group">
                        <td className="py-4 px-6 text-[10px] mono text-zinc-500">{entry.date}</td>
                        <td className="py-4 px-6">
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-sm ${entry.type === 'FIX' ? 'bg-blue-900/40 text-blue-400' : entry.type === 'CORE' ? 'bg-purple-900/40 text-purple-400' : entry.type === 'SECURITY' ? 'bg-red-900/40 text-red-400' : 'bg-green-900/40 text-green-400'}`}>
                            {entry.type}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-[10px] font-bold opacity-80 mono">{entry.file}</td>
                        <td className="py-4 px-6 text-right">
                          <button 
                            onClick={() => fetchDiaryFile(entry)}
                            className="text-[9px] font-black uppercase tracking-[0.15em] px-4 py-2 bg-zinc-800 text-white hover:bg-[#007BFF] transition-all"
                          >
                            {t.diary.inspect}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 md:p-10 animate-in slide-in-from-right-4 duration-500">
                {loadingFile ? (
                  <div className="h-64 flex flex-col items-center justify-center mono text-[10px] opacity-30 animate-pulse">
                    &gt; RETRIEVING_DATA_FROM_BRANCH_DEV_V4...
                  </div>
                ) : (
                  <div className="max-w-none">
                    <div className={`p-6 border border-zinc-800 mb-8 bg-black/20 mono text-[11px] leading-relaxed whitespace-pre-wrap shadow-inner ${colorBlindMode ? 'border-white text-white' : 'text-blue-400'}`}>
                      {fileContent}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'intent' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bento-card p-6 md:p-10 flex flex-col justify-center bg-zinc-900/10">
            <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500 mb-8">{t.intent.title}</h3>
            <div className="space-y-6">
              {t.intent.body.map((text, i) => (
                <p key={i} className="text-sm md:text-lg font-black tracking-tight leading-tight md:leading-snug">
                  <span className="text-blue-500 mr-2">/</span> {text}
                </p>
              ))}
            </div>
          </div>
          <div className="bento-card p-6 md:p-10 flex flex-col justify-between border-dashed opacity-50">
             <div className="mono text-[10px] space-y-2">
                <p>&gt; PROJECT: SENTINEL_V4</p>
                <p>&gt; SCOPE: NATIONAL_AUDIT</p>
                <p>&gt; AUTH: CITIZEN_LED</p>
                <p>&gt; REPO_V: git:dev-v4</p>
             </div>
             <div className="mt-8">
                <div className="h-24 w-24 border-4 border-zinc-800 flex items-center justify-center">
                   <div className="text-[8px] font-black mono text-center p-2">SHA-256 SECURED ENVIRONMENT</div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemView;
