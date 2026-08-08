import { Patient, Appointment, Budget, ConditionMeta } from '../types';

export const CONDITION_METAS: Record<string, ConditionMeta> = {
  sano: {
    id: 'sano',
    label: 'Sano',
    color: '#e2e8f0',
    bgClass: 'bg-slate-100',
    textClass: 'text-slate-700',
    description: 'Pieza dental sin patologías'
  },
  caries: {
    id: 'caries',
    label: 'Caries',
    color: '#ef4444',
    bgClass: 'bg-red-100',
    textClass: 'text-red-700',
    description: 'Lesión cariosa (Rojo)',
    symbol: '🔴'
  },
  obturado: {
    id: 'obturado',
    label: 'Obturado / Arreglo',
    color: '#3b82f6',
    bgClass: 'bg-blue-100',
    textClass: 'text-blue-700',
    description: 'Restauración con composite o amalgama (Azul)',
    symbol: '🔵'
  },
  endodoncia: {
    id: 'endodoncia',
    label: 'Tratamiento de Conducto',
    color: '#3b82f6',
    bgClass: 'bg-blue-100',
    textClass: 'text-blue-700',
    description: 'Endodoncia / Conducto realizado (Azul)',
    symbol: '🔵'
  },
  corona: {
    id: 'corona',
    label: 'Corona / Prótesis',
    color: '#3b82f6',
    bgClass: 'bg-blue-100',
    textClass: 'text-blue-700',
    description: 'Corona fija o incrustación (Azul)',
    symbol: '👑'
  },
  sellador: {
    id: 'sellador',
    label: 'Sellador de Fosas',
    color: '#3b82f6',
    bgClass: 'bg-blue-100',
    textClass: 'text-blue-700',
    description: 'Sellador preventivo (Azul)',
    symbol: '🔵'
  },
  extraccion_indicada: {
    id: 'extraccion_indicada',
    label: 'Extracción Indicada',
    color: '#dc2626',
    bgClass: 'bg-red-100',
    textClass: 'text-red-700',
    description: 'Pieza con indicación de exodoncia (2 líneas paralelas horizontales rojas)',
    symbol: '═'
  },
  ausente: {
    id: 'ausente',
    label: 'Diente Ausente',
    color: '#dc2626',
    bgClass: 'bg-red-100',
    textClass: 'text-red-700',
    description: 'Diente ausente (Cruz Roja ❌)',
    symbol: '❌'
  },
  extraido: {
    id: 'extraido',
    label: 'Diente Extraído',
    color: '#2563eb',
    bgClass: 'bg-blue-100',
    textClass: 'text-blue-700',
    description: 'Pieza extraída previamente (Cruz Azul ❌)',
    symbol: '❌'
  }
};

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'p-1',
    name: 'Carlos Alberto Gómez',
    dni: '32.455.890',
    age: 38,
    phone: '+54 9 11 4589-1234',
    email: 'carlos.gomez@email.com',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    healthInsurance: 'OSDE 310',
    insuranceNumber: '4890123901',
    medicalHistory: 'Hipertensión controlada con enalapril. Sin cirugías previas.',
    allergies: 'Penicilina (Alergia moderada)',
    healthDeclaration: {
      date: '2026-07-15',
      hypertension: true,
      diabetes: false,
      cardiacDisease: false,
      anticoagulants: false,
      respiratoryDisease: false,
      hepatitis: false,
      epilepsy: false,
      activeInfection: true,
      fever: false,
      pregnantOrLactating: false,
      currentMedication: 'Enalapril 10mg diario, Amoxicilina 500mg por 7 días',
      recentSurgeries: 'Ninguna',
      localAnesthesiaAllergy: false
    },
    notes: 'Paciente con sensibilidad en premolares superiores.',
    odontogramFindings: [
      { id: 'f-1', toothNumber: 16, surface: 'oclusal', condition: 'caries', date: '2026-07-15', notes: 'Caries oclusal Grado II' },
      { id: 'f-2', toothNumber: 16, surface: 'mesial', condition: 'caries', date: '2026-07-15', notes: 'Mancha cariosa' },
      { id: 'f-3', toothNumber: 24, surface: 'oclusal', condition: 'obturado', date: '2026-05-10', notes: 'Composite estético' },
      { id: 'f-4', toothNumber: 36, surface: 'pieza', condition: 'endodoncia', date: '2026-03-20', notes: 'Conducto rematado en 3 conductos' },
      { id: 'f-5', toothNumber: 46, surface: 'pieza', condition: 'ausente', date: '2025-11-04', notes: 'Exodoncia antigua' },
      { id: 'f-6', toothNumber: 11, surface: 'vestibular', condition: 'sellador', date: '2026-01-12', notes: 'Protección preventiva' },
    ],
    xrays: [
      {
        id: 'xr-1',
        date: '2026-07-10',
        title: 'Radiografía Panorámica Maxilar',
        type: 'panoramica',
        imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80',
        notes: 'Evaluación general de maxilares y piezas 16, 24, 36. Se observa ligera rarefacción en pieza 36.'
      },
      {
        id: 'xr-2',
        date: '2026-03-18',
        title: 'Periapical Pieza 36 (Pre-Conducto)',
        type: 'periapical',
        imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
        notes: 'Conductos mesiales visibles de 19mm. Sin lesión periapical evidente.'
      }
    ]
  },
  {
    id: 'p-2',
    name: 'María Florencia Rossi',
    dni: '28.912.443',
    age: 44,
    phone: '+54 9 11 6723-9988',
    email: 'mflor.rossi@email.com',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    healthInsurance: 'Swiss Medical',
    insuranceNumber: '89012384',
    medicalHistory: 'Sin patologías previas.',
    allergies: 'Ninguna conocida.',
    notes: 'Iniciando tratamiento ortodóncico.',
    odontogramFindings: [
      { id: 'f-7', toothNumber: 14, surface: 'oclusal', condition: 'obturado', date: '2026-06-01' },
      { id: 'f-8', toothNumber: 26, surface: 'pieza', condition: 'corona', date: '2026-02-18', notes: 'Corona porcelana sobre zirconio' },
      { id: 'f-9', toothNumber: 38, surface: 'pieza', condition: 'ausente', date: '2024-09-10' },
      { id: 'f-10', toothNumber: 48, surface: 'pieza', condition: 'ausente', date: '2024-09-10' },
    ],
    xrays: [
      {
        id: 'xr-3',
        date: '2026-02-15',
        title: 'Radiografía Panorámica Ortodoncia',
        type: 'panoramica',
        imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80',
        notes: 'Alineación de arcadas superior e inferior. Control pre-ortodóncico.'
      }
    ]
  },
  {
    id: 'p-3',
    name: 'Joaquín Benítez',
    dni: '41.003.551',
    age: 26,
    phone: '+54 9 11 3412-8877',
    email: 'joaco.benitez@email.com',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    healthInsurance: 'IOMA',
    insuranceNumber: '77612349',
    medicalHistory: 'Bruxismo leve nocturno. Usa placa de descanso.',
    allergies: 'Aspirina',
    notes: 'Evaluación para limpieza ultrasónica y blanqueamiento.',
    odontogramFindings: [
      { id: 'f-11', toothNumber: 47, surface: 'oclusal', condition: 'caries', date: '2026-07-28' },
      { id: 'f-12', toothNumber: 37, surface: 'oclusal', condition: 'caries', date: '2026-07-28' }
    ]
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'app-1',
    patientId: 'p-1',
    patientName: 'Carlos Alberto Gómez',
    patientPhone: '+54 9 11 4589-1234',
    dentistName: 'Dra. Amalia Merlo',
    date: new Date().toISOString().split('T')[0], // Today
    time: '09:30',
    specialty: 'Operatoria & Arreglos',
    status: 'confirmado',
    notes: 'Tratamiento de caries en pieza 16 (Oclusal y Mesial).'
  },
  {
    id: 'app-2',
    patientId: 'p-2',
    patientName: 'María Florencia Rossi',
    patientPhone: '+54 9 11 6723-9988',
    dentistName: 'Dra. Amalia Merlo',
    date: new Date().toISOString().split('T')[0],
    time: '11:00',
    specialty: 'Ortodoncia & Control',
    status: 'pendiente',
    notes: 'Ajuste de arcos y control de corona en pieza 26.'
  },
  {
    id: 'app-3',
    patientId: 'p-3',
    patientName: 'Joaquín Benítez',
    patientPhone: '+54 9 11 3412-8877',
    dentistName: 'Dra. Amalia Merlo',
    date: new Date().toISOString().split('T')[0],
    time: '15:00',
    specialty: 'Limpieza Ultrasónica',
    status: 'pendiente',
    notes: 'Profilaxis dental y fluoración.'
  },
  {
    id: 'app-4',
    patientId: 'p-1',
    patientName: 'Carlos Alberto Gómez',
    patientPhone: '+54 9 11 4589-1234',
    dentistName: 'Dra. Amalia Merlo',
    date: '2026-08-10',
    time: '10:00',
    specialty: 'Endodoncia Control',
    status: 'confirmado',
    notes: 'Revisión clínica radiográfica post-conducto.'
  }
];

export const INITIAL_BUDGETS: Budget[] = [
  {
    id: 'bud-1',
    patientId: 'p-1',
    patientName: 'Carlos Alberto Gómez',
    date: '2026-07-20',
    items: [
      { id: 'i-1', toothNumber: 16, description: 'Restauración estética con composite (2 superficies)', cost: 45000 },
      { id: 'i-2', toothNumber: 36, description: 'Tratamiento de conducto multirradicular', cost: 95000 },
      { id: 'i-3', description: 'Limpieza profunda ultrasónica + Perno y reconstrucción', cost: 50000 }
    ],
    totalCost: 190000,
    paidAmount: 95000,
    status: 'en_proceso'
  },
  {
    id: 'bud-2',
    patientId: 'p-3',
    patientName: 'Joaquín Benítez',
    date: '2026-07-28',
    items: [
      { id: 'i-4', toothNumber: 47, description: 'Obturación simple fotocurada', cost: 35000 },
      { id: 'i-5', toothNumber: 37, description: 'Obturación simple fotocurada', cost: 35000 },
      { id: 'i-6', description: 'Placa miorrelajante para bruxismo', cost: 65000 }
    ],
    totalCost: 135000,
    paidAmount: 0,
    status: 'aprobado'
  }
];
