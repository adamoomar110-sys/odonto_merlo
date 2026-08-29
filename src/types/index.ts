export type ToothSurface = 'vestibular' | 'lingual' | 'mesial' | 'distal' | 'oclusal' | 'pieza';

export type ConditionType = 
  // Patologías / Hallazgos
  | 'sano'
  | 'caries_np'
  | 'caries_p'
  | 'surco_profundo'
  | 'fractura'
  | 'desgaste'
  | 'retenido'
  | 'supernumerario'
  // Tratamientos / Restauraciones
  | 'obturado'
  | 'obturacion_defectuosa'
  | 'endodoncia'
  | 'corona'
  | 'incrustacion'
  | 'perno'
  | 'sellador'
  // Reemplazos / Prótesis / Cirugía
  | 'implante'
  | 'puente'
  | 'protesis_removible'
  | 'protesis_total'
  | 'extraccion_indicada'
  | 'ausente'
  | 'extraido'
  // Estructura
  | 'erupcion';

export interface ConditionMeta {
  id: ConditionType;
  label: string;
  color: string; // Tailwind hex or css color
  category?: 'patologia' | 'tratamiento' | 'protesis' | 'ortodoncia';
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
  bridgeStart?: number;
  bridgeEnd?: number;
  bridgeRole?: 'pilar' | 'pontico';
}

export interface DentalXRay {
  id: string;
  date: string;
  title: string;
  type: 'panoramica' | 'periapical' | 'oclusal' | 'tomografia';
  imageUrl: string;
  notes?: string;
}

export interface HealthDeclaration {
  date: string;
  // Preexistentes / Crónicas
  hypertension: boolean; // Hipertensión Arterial
  diabetes: boolean; // Diabetes
  cardiacDisease: boolean; // Cardiopatías / Marcapasos
  anticoagulants: boolean; // Anticoagulados / Hemorragias
  respiratoryDisease: boolean; // Asma / Enf. Respiratoria
  hepatitis: boolean; // Hepatitis / Enf. Hepática
  epilepsy: boolean; // Epilepsia / Convulsiones
  customConditions?: string[]; // Enfermedades / Patologías personalizadas agregadas por el profesional
  // Temporales / Estado Actual
  activeInfection: boolean; // Infección activa
  fever: boolean; // Fiebre reciente
  pregnantOrLactating: boolean; // Embarazo o Lactancia
  currentMedication: string; // Medicación actual en curso
  recentSurgeries: string; // Cirugías recientes
  localAnesthesiaAllergy: boolean; // Alergia a Anestesia Local
}

export interface ClinicalEvolution {
  id: string;
  date: string; // YYYY-MM-DD
  dentistName: string; // Nombre del profesional / odontólogo/a
  toothNumber?: number; // Pieza dental (opcional)
  treatment: string; // Procedimiento realizado / Evolución del turno
  notes?: string; // Observaciones clínicas, indicación de fármacos, etc.
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
  healthDeclaration?: HealthDeclaration; // Planilla de enfermedades preexistentes y temporales (Anamnesis)
  odontogramFindings: ToothFinding[];
  xrays?: DentalXRay[]; // Radiografías opcionales
  evolutions?: ClinicalEvolution[]; // Evolución clínica diaria de turnos y tratamientos
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

export type DayOfWeek = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';

export interface DaySchedule {
  day: DayOfWeek;
  label: string;
  isOpen: boolean;
  startTime: string; // e.g. '08:00' (Primer tramo / Mañana)
  endTime: string; // e.g. '13:00'
  hasSplitShift?: boolean; // Habilita horario cortado (corte de almuerzo / re-apertura)
  startTime2?: string; // e.g. '16:00' (Segundo tramo / Tarde)
  endTime2?: string; // e.g. '20:00'
  slotDurationMinutes: number; // e.g. 30
}

export type ClinicScheduleConfig = Record<DayOfWeek, DaySchedule>;

