import React from 'react';
import { Finding } from '../types';
import { ExternalLink } from 'lucide-react';

interface Props {
  findings: Finding[];
}

export const FindingsTable: React.FC<Props> = ({ findings }) => {
  if (findings.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-lg border border-slate-200">
        No se identificaron nuevas oportunidades accionables en este periodo.
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getPriorityBadge = (priority: number) => {
    switch (priority) {
      case 1: return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">P1 - Alta</span>;
      case 2: return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">P2 - Media</span>;
      case 3: return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">P3 - Baja</span>;
      default: return null;
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 bg-white text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-900">Prioridad</th>
            <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-900">Fuente o publicación</th>
            <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-900 w-1/3">Riesgo/caso de uso</th>
            <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-900">Factibilidad</th>
            <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-900">Acción</th>
            <th scope="col" className="px-4 py-3 text-center font-semibold text-slate-900">Score estratégico</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {findings.map((finding) => (
            <tr key={finding.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-4 whitespace-nowrap">
                {getPriorityBadge(finding.priority)}
              </td>
              <td className="px-4 py-4">
                <div className="flex flex-col gap-1">
                  {finding.source.map((s, idx) => (
                    <a 
                      key={idx} 
                      href={s.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-brand-600 hover:text-brand-800 hover:underline inline-flex items-center gap-1"
                    >
                      {s.name}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </td>
              <td className="px-4 py-4 text-slate-700">
                {finding.riskUseCase}
              </td>
              <td className="px-4 py-4">
                <div className="font-medium text-slate-900">{finding.feasibilityLevel}</div>
                <div className="text-xs text-slate-500 mt-1">{finding.feasibilityDetails}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  {finding.action}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-center">
                <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full border font-bold ${getScoreColor(finding.score)}`}>
                  {finding.score}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
