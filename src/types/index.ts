export type ToothSurface = 'vestibular' | 'lingual' | 'mesial' | 'distal' | 'oclusal' | 'pieza';

export type ConditionType = 
  | 'sano'
  | 'caries' 
  | 'obturado' 
  | 'endodoncia' 
  | 'ausente' 
  | 'corona' 
  | 'sellador' 
  | 'extraccion_indicada';

export interface ConditionMeta {
  id: ConditionType;
  label: string;
  color: string; // Tailwind hex or css color
  bgClass: string;
  textClass: string;
  description: string;
  symbol?: string;
}

export interface ToothFinding {
  id: string;
  toothNumber: number;
  surface: ToothSurface;
  condition: ConditionType;
  date: string;
  dentistName?: string;
  notes?: string;
}

export interface DentalXRay {
  id: string;
  date: string;
  title: string;
  type: 'panoramica' | 'periapical' | 'oclusal' | 'tomografia';
  imageUrl: string;
  notes?: string;
}

export interface Patient {
  id: string;
  name: string;
  dni: string;
  age: number;
  phone: string;
  email: string;
  photoUrl?: string; // Foto opcional del paciente
  healthInsurance: string;
  insuranceNumber: string;
  medicalHistory: string;
  allergies: string;
  odontogramFindings: ToothFinding[];
  xrays?: DentalXRay[]; // Radiografías opcionales
  notes: string;
}

export type AppointmentStatus = 'pendiente' | 'confirmado' | 'atendido' | 'cancelado';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  dentistName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  specialty: string;
  status: AppointmentStatus;
  notes: string;
}

export interface BudgetItem {
  id: string;
  toothNumber?: number;
  description: string;
  cost: number;
}

export interface Budget {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  items: BudgetItem[];
  totalCost: number;
  paidAmount: number;
  status: 'borrador' | 'aprobado' | 'en_proceso' | 'completado';
}

export interface Dentist {
  id: string;
  name: string;
  licenseNumber: string; // Matrícula Profesional
  specialty: string;
  phone: string;
  email: string;
  active: boolean;
}

