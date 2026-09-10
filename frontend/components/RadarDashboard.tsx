import React, { useState } from 'react';
import { useRadarStore } from '../store';
import { EmailPreview } from './EmailPreview';
import { MonitorTab } from './MonitorTab';
import { ShieldAlert, Search, Loader2, Database, Activity, Clock, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const RadarDashboard: React.FC = () => {
  const { report, isGenerating, generateReport, lastRunDate } = useRadarStore();
  const [activeTab, setActiveTab] = useState<'radar' | 'monitor'>('radar');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-brand-950 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-brand-500" />
            </div>
            BlackTrust Legal Radar
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Monitoreo diario del DOF y 32 gacetas estatales para ingesta de bases de datos.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-8">
        <button
          className={`px-5 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'radar' ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
          onClick={() => setActiveTab('radar')}
        >
          <ShieldAlert className="w-4 h-4" />
          Radar Estratégico
        </button>
        <button
          className={`px-5 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'monitor' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
          onClick={() => setActiveTab('monitor')}
        >
          <Globe className="w-4 h-4" />
          Monitor Judicial (Web)
        </button>
      </div>

      {/* Main Content Area */}
      {activeTab === 'radar' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            {lastRunDate ? (
              <div className="text-xs text-slate-500 flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
                <Clock className="w-3.5 h-3.5" />
                Última ejecución: {new Date(lastRunDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            ) : <div />}
            <button
              onClick={generateReport}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-950 text-white rounded-lg font-medium hover:bg-brand-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analizando 33 fuentes...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Ejecutar Radar Diario
                </>
              )}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {!report && !isGenerating && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center flex flex-col items-center justify-center min-h-[400px]"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Database className="w-8 h-8 text-slate-400" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">Listo para iniciar el escaneo</h2>
                <p className="text-slate-500 max-w-md mx-auto mb-6">
                  El radar consultará el Diario Oficial de la Federación y las 32 gacetas estatales buscando fuentes públicas con potencial para evaluación de riesgos.
                </p>
                <button
                  onClick={generateReport}
                  className="text-brand-600 font-medium hover:text-brand-700 hover:underline"
                >
                  Iniciar ejecución ahora &rarr;
                </button>
              </motion.div>
            )}

            {isGenerating && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center min-h-[400px]"
              >
                <div className="relative w-20 h-20 mb-6">
                  <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-brand-500 rounded-full border-t-transparent animate-spin"></div>
                  <Activity className="absolute inset-0 m-auto w-8 h-8 text-brand-500 animate-pulse" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">Procesando publicaciones...</h2>
                <p className="text-slate-500 text-sm animate-pulse">
                  Aplicando criterios de inclusión y exclusión de BlackTrust.
                </p>
              </motion.div>
            )}

            {report && !isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                      <Database className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{report.findings.length}</div>
                      <div className="text-sm text-slate-500 font-medium">Oportunidades Identificadas</div>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">
                        {report.findings.filter(f => f.priority === 1).length}
                      </div>
                      <div className="text-sm text-slate-500 font-medium">Prioridad Alta (P1)</div>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">
                        {report.findings.length > 0 
                          ? Math.round(report.findings.reduce((acc, curr) => acc + curr.score, 0) / report.findings.length)
                          : 0}
                      </div>
                      <div className="text-sm text-slate-500 font-medium">Score Promedio</div>
                    </div>
                  </div>
                </div>

                {/* Email Preview */}
                <EmailPreview report={report} />
                
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <MonitorTab />
      )}
    </div>
  );
};
