
export type Theme = 'light' | 'dark';
export type Language = 'ES' | 'EN';
export type ViewMode = 'citizen' | 'auditor' | 'special' | 'system';

export interface Candidate {
  id: string;
  name: string;
  party: string;
  votes: number;
  color: string;
  accessibleColor?: string;
}

export interface TimeSeriesPoint {
  time: string;
  [candidateId: string]: number | string;
}

export interface OutlierPoint {
  id: string;
  participation: number;
  winnerVoteShare: number;
  isAnomaly: boolean;
  name: string;
}

export interface DeptData {
  id: string;
  name: string;
  processed: number;
  total: number;
  participation: number;
  status: 'clean' | 'warning' | 'critical';
  trend: 'stable' | 'rising' | 'declining';
}

export interface Protocol {
  id: string;
  deptId: string;
  hash: string;
  signature: string;
  timestamp: string;
  verified: boolean;
  jsonData: string;
}

export interface BenfordPoint {
  digit: number;
  expected: number;
  actual: number;
  secondDigitActual?: number;
}

export interface ElectionData {
  lastUpdate: string;
  global: {
    processedPercent: number;
    participationPercent: number;
    totalProtocols: number;
    trend: string;
  };
  candidates: Candidate[];
  departments: DeptData[];
  latestProtocols: Protocol[];
  benford: BenfordPoint[];
  history: TimeSeriesPoint[];
  outliers: OutlierPoint[];
}

export const DEPARTMENTS = [
  "Atlántida", "Choluteca", "Colón", "Comayagua", "Copán", 
  "Cortés", "El Paraíso", "Francisco Morazán", "Gracias a Dios", 
  "Intibucá", "Islas de la Bahía", "La Paz", "Lempira", 
  "Ocotepeque", "Olancho", "Santa Bárbara", "Valle", "Yoro"
];
