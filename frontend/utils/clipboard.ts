import { RadarReport, MonitorEntry } from '../types';

export const copyReportToClipboard = async (report: RadarReport): Promise<boolean> => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #000;">
      <p>Hola, Team Legal:</p>
      
      <p style="white-space: pre-wrap;">${report.summary}</p>
      
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px; font-size: 13px;">
        <thead>
          <tr style="background-color: #f3f4f6; text-align: left;">
            <th style="border: 1px solid #d1d5db; padding: 8px;">Prioridad</th>
            <th style="border: 1px solid #d1d5db; padding: 8px;">Fuente o publicación</th>
            <th style="border: 1px solid #d1d5db; padding: 8px;">Riesgo/caso de uso</th>
            <th style="border: 1px solid #d1d5db; padding: 8px;">Factibilidad</th>
            <th style="border: 1px solid #d1d5db; padding: 8px;">Acción</th>
            <th style="border: 1px solid #d1d5db; padding: 8px;">Score estratégico (0–100)</th>
          </tr>
        </thead>
        <tbody>
          ${report.findings.map(f => `
            <tr>
              <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">${f.priority}</td>
              <td style="border: 1px solid #d1d5db; padding: 8px;">
                ${f.source.map(s => `<a href="${s.url}" style="color: #2563eb; text-decoration: none;">${s.name}</a>`).join('<br/>')}
              </td>
              <td style="border: 1px solid #d1d5db; padding: 8px;">${f.riskUseCase}</td>
              <td style="border: 1px solid #d1d5db; padding: 8px;">
                <strong>${f.feasibilityLevel}</strong><br/>
                <span style="font-size: 11px; color: #4b5563;">${f.feasibilityDetails}</span>
              </td>
              <td style="border: 1px solid #d1d5db; padding: 8px;">${f.action}</td>
              <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center; font-weight: bold; color: ${f.score >= 80 ? '#16a34a' : f.score >= 60 ? '#ca8a04' : '#dc2626'};">${f.score}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      ${report.alerts.length > 0 ? `
        <p><strong>Alertas para fuentes actuales</strong></p>
        <ul style="margin-top: 0;">
          ${report.alerts.map(a => `<li>${a}</li>`).join('')}
        </ul>
      ` : ''}

      ${report.nextSteps.length > 0 ? `
        <p><strong>Siguientes pasos</strong></p>
        <ul style="margin-top: 0;">
          ${report.nextSteps.map(n => `<li>${n}</li>`).join('')}
        </ul>
      ` : ''}
    </div>
  `;

  const plainTextContent = `Hola, Team Legal:\n\n${report.summary}\n\n` +
    `[Tabla de hallazgos copiada en formato enriquecido. Pegue en un cliente de correo que soporte HTML para verla correctamente.]\n\n` +
    (report.alerts.length > 0 ? `Alertas para fuentes actuales\n${report.alerts.map(a => `- ${a}`).join('\n')}\n\n` : '') +
    (report.nextSteps.length > 0 ? `Siguientes pasos\n${report.nextSteps.map(n => `- ${n}`).join('\n')}` : '');

  try {
    const clipboardItem = new ClipboardItem({
      'text/html': new Blob([htmlContent], { type: 'text/html' }),
      'text/plain': new Blob([plainTextContent], { type: 'text/plain' })
    });
    await navigator.clipboard.write([clipboardItem]);
    return true;
  } catch (err) {
    console.error('Failed to copy rich text: ', err);
    try {
      await navigator.clipboard.writeText(plainTextContent);
      return true;
    } catch (fallbackErr) {
      console.error('Failed to copy plain text: ', fallbackErr);
      return false;
    }
  }
};

export const getMailtoLink = (report: RadarReport): string => {
  const recipients = "enevy.elizalde@blacktrust.net,legal@blacktrust.net,juan.cruz@blacktrust.net,alejandro.gv@blacktrust.net,ana.sanchez@blacktrust.net,allison.centeno@blacktrust.net,maria.hernandez@blacktrust.net";
  const subject = encodeURIComponent(`Radar DOF | Bases de datos legales | ${report.date}`);
  const body = encodeURIComponent(`Hola, Team Legal:\n\n[Por favor, pegue aquí el contenido copiado usando el botón "Copiar para Gmail" en el Dashboard para conservar el formato de la tabla]\n`);
  
  return `mailto:${recipients}?subject=${subject}&body=${body}`;
};

export const copyMonitorToClipboard = async (entries: MonitorEntry[], dateStr: string): Promise<boolean> => {
  const nuevos = entries.filter(e => e.es_nuevo);
  let bloque_nuevos = "";
  
  if (nuevos.length > 0) {
    const filas_nuevos = nuevos.map(n => `
      <tr style="background-color: #fffbeb;">
        <td style="padding: 10px; border-bottom: 2px solid #fde047; font-weight: bold; color: #b45309;">
          <span style="background-color: #f59e0b; color: white; padding: 2px 7px; border-radius: 4px; font-size: 11px;">¡NUEVO! ✨</span>
        </td>
        <td style="padding: 10px; border-bottom: 2px solid #fde047; font-weight: bold; color: #0f172a;">${n.entidad}</td>
        <td style="padding: 10px; border-bottom: 2px solid #fde047; color: #0284c7; font-weight: bold; font-size: 11px;">${n.materia}</td>
        <td style="padding: 10px; border-bottom: 2px solid #fde047; color: #334155;">${n.tipo}</td>
        <td style="padding: 10px; border-bottom: 2px solid #fde047; text-align: center;">
          <a href="${n.url}" target="_blank" style="background-color: #d97706; color: white; padding: 5px 12px; border-radius: 4px; text-decoration: none; font-size: 11px; font-weight: bold;">Abrir ↗</a>
        </td>
      </tr>
    `).join('');

    bloque_nuevos = `
      <div style="background-color: #fefce8; border: 2px solid #f59e0b; border-radius: 8px; padding: 14px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 15px;">⭐ Portales Descubiertos Hoy (${nuevos.length})</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr style="text-align: left; color: #78350f; font-size: 11px; text-transform: uppercase;">
              <th style="padding: 6px;">Estatus</th>
              <th style="padding: 6px;">Entidad</th>
              <th style="padding: 6px;">Materia</th>
              <th style="padding: 6px;">Nombre Oficial Identificado</th>
              <th style="padding: 6px; text-align: center;">Acceso</th>
            </tr>
          </thead>
          <tbody>${filas_nuevos}</tbody>
        </table>
      </div>
    `;
  }

  const filas_todos = entries.map((item, idx) => {
    const bg = item.es_nuevo ? "#fffbeb" : "#ffffff";
    const badge = item.es_nuevo ? '<span style="background-color: #f59e0b; color: white; padding: 1px 5px; border-radius: 3px; font-size: 10px; margin-left: 5px;">NUEVO</span>' : "";
    return `
      <tr style="background-color: ${bg};">
        <td style="padding: 7px 10px; border-bottom: 1px solid #e2e8f0; font-size: 11px; color: #64748b;">${idx + 1}</td>
        <td style="padding: 7px 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #0f172a;">${item.entidad || 'N/A'} ${badge}</td>
        <td style="padding: 7px 10px; border-bottom: 1px solid #e2e8f0; font-size: 11px; color: #0284c7;">${item.materia || 'Judicial'}</td>
        <td style="padding: 7px 10px; border-bottom: 1px solid #e2e8f0; color: #334155; font-size: 12px;">${item.tipo || 'Publicación Oficial'}</td>
        <td style="padding: 7px 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">
          <a href="${item.url || '#'}" target="_blank" style="background-color: #0284c7; color: white; padding: 3px 8px; border-radius: 4px; text-decoration: none; font-size: 11px;">Abrir ↗</a>
        </td>
      </tr>
    `;
  }).join('');

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; background-color: #f1f5f9; padding: 20px; margin: 0;">
      <div style="max-width: 950px; margin: auto; background-color: white; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.06); border: 1px solid #cbd5e1;">
        <div style="border-bottom: 2px solid #0284c7; padding-bottom: 10px; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #0f172a;">⚖️ Rastreador Judicial: Novedades e Inventario Completo</h2>
          <p style="margin: 5px 0 0 0; color: #64748b; font-size: 12px;">Fecha: <b>${dateStr}</b> | Total monitoreados: <b>${entries.length}</b></p>
        </div>
        ${bloque_nuevos}
        <h3 style="color: #0f172a; font-size: 14px; margin-bottom: 8px;">Directorio Consolidado en Memoria</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr style="background-color: #0f172a; color: white; text-align: left; font-size: 11px;">
              <th style="padding: 8px 10px; width: 30px;">#</th>
              <th style="padding: 8px 10px; width: 150px;">Entidad</th>
              <th style="padding: 8px 10px; width: 100px;">Materia</th>
              <th style="padding: 8px 10px;">Nombre Oficial / Descripción</th>
              <th style="padding: 8px 10px; text-align: center; width: 70px;">Acceso</th>
            </tr>
          </thead>
          <tbody>${filas_todos}</tbody>
        </table>
        <p style="color: #94a3b8; font-size: 11px; margin-top: 25px; text-align: center;">Agente Automatizado BlackTrust.</p>
      </div>
    </div>
  `;

  const plainTextContent = `Rastreador Judicial: Novedades e Inventario Completo\nFecha: ${dateStr} | Total monitoreados: ${entries.length}\n\n[Tabla copiada en formato enriquecido. Pegue en un cliente de correo que soporte HTML para verla correctamente.]`;

  try {
    const clipboardItem = new ClipboardItem({
      'text/html': new Blob([htmlContent], { type: 'text/html' }),
      'text/plain': new Blob([plainTextContent], { type: 'text/plain' })
    });
    await navigator.clipboard.write([clipboardItem]);
    return true;
  } catch (err) {
    console.error('Failed to copy rich text: ', err);
    try {
      await navigator.clipboard.writeText(plainTextContent);
      return true;
    } catch (fallbackErr) {
      console.error('Failed to copy plain text: ', fallbackErr);
      return false;
    }
  }
};

export const getMonitorMailtoLink = (entries: MonitorEntry[], dateStr: string): string => {
  const nuevos = entries.filter(e => e.es_nuevo);
  const subject = encodeURIComponent(nuevos.length > 0 ? `⭐ [¡NUEVOS ENLACES!] Monitor Judicial - ${dateStr}` : `✔ [Inventario al Día] Monitor Judicial - ${dateStr}`);
  const body = encodeURIComponent(`[Por favor, pegue aquí el contenido copiado usando el botón "Copiar HTML" en el Dashboard para conservar el formato de la tabla]\n`);
  return `mailto:alejandro.gv@blacktrust.net?subject=${subject}&body=${body}`;
};
