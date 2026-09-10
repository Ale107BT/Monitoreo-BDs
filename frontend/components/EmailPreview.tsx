import React, { useState } from 'react';
import { RadarReport } from '../types';
import { FindingsTable } from './FindingsTable';
import { Copy, Mail, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { copyReportToClipboard, getMailtoLink } from '../utils/clipboard';

interface Props {
  report: RadarReport;
}

export const EmailPreview: React.FC<Props> = ({ report }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyReportToClipboard(report);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } else {
      alert("Error al copiar al portapapeles. Por favor, intente de nuevo.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      {/* Email Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Vista Previa del Correo</div>
          <div className="text-sm text-slate-700">
            <span className="font-medium">Asunto:</span> Radar DOF | Bases de datos legales | {report.date}
          </div>
          <div className="text-sm text-slate-700 mt-1">
            <span className="font-medium">Para:</span> Team Legal (7 destinatarios)
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copiado' : 'Copiar para Gmail'}
          </button>
          <a
            href={getMailtoLink(report)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-brand-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1"
          >
            <Mail className="w-4 h-4" />
            Abrir Cliente
          </a>
        </div>
      </div>

      {/* Email Body */}
      <div className="p-6 md:p-8 overflow-y-auto bg-white text-slate-800 text-sm leading-relaxed">
        <p className="mb-4 font-medium">Hola, Team Legal:</p>
        
        <div className="mb-6 whitespace-pre-wrap text-slate-600 border-l-4 border-brand-500 pl-4 py-1 bg-brand-50/50 rounded-r-md">
          {report.summary}
        </div>

        <div className="mb-8">
          <FindingsTable findings={report.findings} />
        </div>

        {report.alerts.length > 0 && (
          <div className="mb-8">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Alertas para fuentes actuales
            </h3>
            <ul className="space-y-2">
              {report.alerts.map((alert, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>{alert}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {report.nextSteps.length > 0 && (
          <div>
            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-3">
              <ArrowRight className="w-4 h-4 text-brand-600" />
              Siguientes pasos
            </h3>
            <ul className="space-y-2">
              {report.nextSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-brand-600 mt-1">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
