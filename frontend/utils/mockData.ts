import { RadarReport, MonitorEntry } from '../types';

export const generateMockReport = (): RadarReport => {
  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

  return {
    date: formattedDate,
    summary: "Se identificaron 2 oportunidades estratégicas. Fuentes: DOF y Gaceta CDMX.\nSeñal más relevante: Nueva API de validación de edictos judiciales en CDMX y actualización del padrón de inhabilitados federales.",
    findings: [
      {
        id: "f1",
        priority: 1,
        source: [
          { name: "Gaceta Oficial CDMX", url: "https://data.consejeria.cdmx.gob.mx/index.php/gaceta" },
          { name: "Nuevo Buscador de Edictos", url: "https://data.consejeria.cdmx.gob.mx/edictos_api" }
        ],
        riskUseCase: "Riesgo judicial (Personas físicas y morales). Permite detectar notificaciones por edictos, juicios sucesorios y remates. Aporta campos de actor, demandado y juzgado.",
        feasibilityLevel: "Alta",
        feasibilityDetails: "API REST pública identificada, devuelve JSON estructurado. Automatización viable.",
        action: "Hacer prueba técnica",
        score: 92
      },
      {
        id: "f2",
        priority: 2,
        source: [
          { name: "Diario Oficial de la Federación", url: "https://dof.gob.mx/index.php" },
          { name: "Anexo Sanciones SFP", url: "https://dof.gob.mx/nota_detalle.php?codigo=5678901" }
        ],
        riskUseCase: "Riesgo administrativo/corporativo (Personas morales). Actualización del padrón de proveedores inhabilitados. Aporta RFC, razón social y plazo de inhabilitación.",
        feasibilityLevel: "Media",
        feasibilityDetails: "Publicación en PDF con texto seleccionable. Requiere extracción OCR/Regex y conciliación con ComprasMX.",
        action: "Incorporar al roadmap",
        score: 75
      }
    ],
    alerts: [
      "El portal del Periódico Oficial de Jalisco presenta intermitencias (Error 503), lo que podría afectar el scraper actual.",
      "RENAPO actualizó sus términos de uso para validación masiva; requiere revisión para asegurar cumplimiento."
    ],
    nextSteps: [
      "Ejecutar prueba técnica de extracción en la nueva API de edictos de CDMX (Equipo de Ingeniería).",
      "Solicitar opinión legal sobre los nuevos términos de uso de RENAPO.",
      "Monitorear disponibilidad del portal de Jalisco durante las próximas 48 horas."
    ]
  };
};

export const generateMockMonitorData = (): MonitorEntry[] => {
  const today = new Date().toISOString().split('T')[0];
  return [
    {
      id: 'm1',
      entidad: 'Ciudad de México',
      materia: 'Edictos',
      tipo: 'Portal Oficial de Edictos y Notificaciones Ciudad de México',
      url: 'https://data.consejeria.cdmx.gob.mx/edictos',
      fecha_descubrimiento: today,
      es_nuevo: true
    },
    {
      id: 'm2',
      entidad: 'Jalisco',
      materia: 'Judicial',
      tipo: 'Portal de Acuerdos y Boletín Judicial Jalisco',
      url: 'https://cjj.gob.mx/boletin',
      fecha_descubrimiento: '2023-10-01',
      es_nuevo: false
    },
    {
      id: 'm3',
      entidad: 'Federal',
      materia: 'Administrativo',
      tipo: 'Tribunal de Justicia Administrativa Federal',
      url: 'https://www.tfja.gob.mx/acuerdos',
      fecha_descubrimiento: '2023-10-05',
      es_nuevo: false
    },
    {
      id: 'm4',
      entidad: 'Nuevo León',
      materia: 'Laboral',
      tipo: 'Centro de Conciliación / Boletín Laboral Nuevo León',
      url: 'https://pjenl.gob.mx/laboral',
      fecha_descubrimiento: today,
      es_nuevo: true
    },
    {
      id: 'm5',
      entidad: 'Aguascalientes',
      materia: 'Judicial',
      tipo: 'Poder Judicial del Estado de Aguascalientes',
      url: 'https://poderjudicialags.gob.mx/',
      fecha_descubrimiento: '2023-09-15',
      es_nuevo: false
    }
  ];
};
