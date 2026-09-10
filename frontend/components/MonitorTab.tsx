import React, { useState } from 'react';
import { useRadarStore } from '../store';
import { Search, Loader2, Globe, CheckCircle2, Copy, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { copyMonitorToClipboard, getMonitorMailtoLink } from '../utils/clipboard';

export const MonitorTab: React.FC = () => {
  const { monitorEntries, isScanningMonitor, scanMonitor, lastMonitorRunDate } = useRadarStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!monitorEntries) return;
    const date = lastMonitorRunDate ? new Date(lastMonitorRunDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    const success = await copyMonitorToClipboard(monitorEntries, date);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const nuevos = monitorEntries?.filter(e => e.es_nuevo) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Monitor Judicial (Búsqueda Web)</h2>
          <p className="text-slate-500 text-sm">Rastrea nuevos portales judiciales y de edictos en la web abierta.</p>
        </div>
        <button
          onClick={scanMonitor}
          disabled={isScanningMonitor}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
        >
          {isScanningMonitor ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Buscando enlaces...
            </>
          ) : (
            <>
              <Globe className="w-4 h-4" />
              Ejecutar Rastreador
            </>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!monitorEntries && !isScanningMonitor && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center flex flex-col items-center justify-center min-h-[300px]"
          >
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Globe className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Rastreador Web Inactivo</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              Ejecuta el rastreador para buscar nuevos boletines, listas de acuerdos y portales de edictos en motores de búsqueda.
            </p>
          </motion.div>
        )}

        {isScanningMonitor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center min-h-[300px]"
          >
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
              <Search className="absolute inset-0 m-auto w-8 h-8 text-blue-500 animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Analizando resultados web...</h3>
            <p className="text-slate-500 text-sm animate-pulse">
              Clasificando por entidad y materia...
            </p>
          </motion.div>
        )}

        {monitorEntries && !isScanningMonitor && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
          >
            {/* Email Header */}
            <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Vista Previa del Correo</div>
                <div className="text-sm text-slate-700">
                  <span className="font-medium">Asunto:</span> {nuevos.length > 0 ? `⭐ [¡NUEVOS ENLACES!] Monitor Judicial - ${lastMonitorRunDate?.split('T')[0]}` : `✔ [Inventario al Día] Monitor Judicial - ${lastMonitorRunDate?.split('T')[0]}`}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copiado' : 'Copiar HTML'}
                </button>
                <a
                  href={getMonitorMailtoLink(monitorEntries, lastMonitorRunDate?.split('T')[0] || '')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Abrir Cliente
                </a>
              </div>
            </div>

            {/* Email Body Preview */}
            <div className="p-6 md:p-8 overflow-y-auto bg-slate-100 text-slate-800 text-sm leading-relaxed">
              <div className="max-w-[950px] mx-auto bg-white p-6 rounded-lg shadow-sm border border-slate-300">
                <div className="border-b-2 border-blue-600 pb-3 mb-5">
                  <h2 className="text-xl font-bold text-slate-900 m-0">⚖️ Rastreador Judicial: Novedades e Inventario Completo</h2>
                  <p className="text-slate-500 text-xs mt-1 mb-0">Fecha: <b>{lastMonitorRunDate?.split('T')[0]}</b> | Total monitoreados: <b>{monitorEntries.length}</b></p>
                </div>

                {nuevos.length > 0 && (
                  <div className="bg-yellow-50 border-2 border-amber-500 rounded-lg p-4 mb-6">
                    <h3 className="text-amber-900 text-base font-bold m-0 mb-3">⭐ Portales Descubiertos Hoy ({nuevos.length})</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-xs">
                        <thead>
                          <tr className="text-left text-amber-900 text-[11px] uppercase">
                            <th className="p-2">Estatus</th>
                            <th className="p-2">Entidad</th>
                            <th className="p-2">Materia</th>
                            <th className="p-2">Nombre Oficial Identificado</th>
                            <th className="p-2 text-center">Acceso</th>
                          </tr>
                        </thead>
                        <tbody>
                          {nuevos.map((n, idx) => (
                            <tr key={idx} className="bg-amber-50/50">
                              <td className="p-2 border-b-2 border-yellow-300 font-bold text-amber-700">
                                <span className="bg-amber-500 text-white px-2 py-0.5 rounded text-[11px]">¡NUEVO! ✨</span>
                              </td>
                              <td className="p-2 border-b-2 border-yellow-300 font-bold text-slate-900">{n.entidad}</td>
                              <td className="p-2 border-b-2 border-yellow-300 text-blue-600 font-bold text-[11px]">{n.materia}</td>
                              <td className="p-2 border-b-2 border-yellow-300 text-slate-700">{n.tipo}</td>
                              <td className="p-2 border-b-2 border-yellow-300 text-center">
                                <a href={n.url} target="_blank" rel="noreferrer" className="inline-block bg-amber-600 text-white px-3 py-1 rounded text-[11px] font-bold no-underline">Abrir ↗</a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <h3 className="text-slate-900 text-sm font-bold mb-2">Directorio Consolidado en Memoria</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900 text-white text-left text-[11px]">
                        <th className="p-2 w-8">#</th>
                        <th className="p-2 w-36">Entidad</th>
                        <th className="p-2 w-24">Materia</th>
                        <th className="p-2">Nombre Oficial / Descripción</th>
                        <th className="p-2 text-center w-20">Acceso</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monitorEntries.map((item, idx) => (
                        <tr key={idx} className={item.es_nuevo ? 'bg-yellow-50' : 'bg-white'}>
                          <td className="p-2 border-b border-slate-200 text-[11px] text-slate-500">{idx + 1}</td>
                          <td className="p-2 border-b border-slate-200 font-bold text-slate-900">
                            {item.entidad}
                            {item.es_nuevo && <span className="bg-amber-500 text-white px-1.5 py-0.5 rounded text-[10px] ml-1.5">NUEVO</span>}
                          </td>
                          <td className="p-2 border-b border-slate-200 text-[11px] text-blue-600">{item.materia}</td>
                          <td className="p-2 border-b border-slate-200 text-slate-700 text-xs">{item.tipo}</td>
                          <td className="p-2 border-b border-slate-200 text-center">
                            <a href={item.url} target="_blank" rel="noreferrer" className="inline-block bg-blue-600 text-white px-2 py-1 rounded text-[11px] no-underline">Abrir ↗</a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-slate-400 text-[11px] mt-6 text-center">Agente Automatizado BlackTrust.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
