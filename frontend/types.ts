export type Priority = 1 | 2 | 3;
export type FeasibilityLevel = 'Alta' | 'Media' | 'Baja';
export type Action = 
  | 'Descubrir fuente' 
  | 'Hacer prueba técnica' 
  | 'Solicitar opinión legal' 
  | 'Incorporar al roadmap' 
  | 'Monitorear' 
  | 'Descartar';

export interface SourceLink {
  name: string;
  url: string;
}

export interface Finding {
  id: string;
  priority: Priority;
  source: SourceLink[];
  riskUseCase: string;
  feasibilityLevel: FeasibilityLevel;
  feasibilityDetails: string;
  action: Action;
  score: number;
}

export interface RadarReport {
  date: string;
  summary: string;
  findings: Finding[];
  alerts: string[];
  nextSteps: string[];
}

export interface MonitorEntry {
  id: string;
  entidad: string;
  materia: string;
  tipo: string;
  url: string;
  fecha_descubrimiento: string;
  es_nuevo: boolean;
}
