import React, { useState } from 'react';
import { ActiveTab, Navbar } from './components/Navbar';
import { Odontogram } from './components/Odontogram';
import { Appointments } from './components/Appointments';
import { Patients } from './components/Patients';
import { Budgets } from './components/Budgets';
import { Footer } from './components/Footer';
import { IntroScreen } from './components/IntroScreen';
import { Login } from './components/Login';
import { Registro } from './components/Registro';
import { INITIAL_PATIENTS, INITIAL_APPOINTMENTS, INITIAL_BUDGETS } from './data/mockData';
import { Patient, Appointment, Budget, ToothFinding, AppointmentStatus } from './types';
import { Calendar, Users } from 'lucide-react';

type AppPhase = 'intro' | 'login' | 'registro' | 'app';

export const App: React.FC = () => {
  // ── TODOS los hooks siempre al tope (regla de React) ──
  const [appPhase, setAppPhase] = useState<AppPhase>('intro');
  const [usuarioActivo, setUsuarioActivo] = useState<string>('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('odontogram');
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(INITIAL_PATIENTS[0].id);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Handlers
  const handleUpdateOdontogramFindings = (patientId: string, newFindings: ToothFinding[]) => {
    setPatients(prev => prev.map(p =>
      p.id === patientId ? { ...p, odontogramFindings: newFindings } : p
    ));
  };

  const handleAddAppointment = (newApp: Appointment) => {
    setAppointments([newApp, ...appointments]);
  };

  const handleUpdateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(app => app.id === id ? { ...app, status } : app));
  };

  const handleAddPatient = (newPatient: Patient) => {
    setPatients([newPatient, ...patients]);
  };

  const handleAddBudget = (newBudget: Budget) => {
    setBudgets([newBudget, ...budgets]);
  };

  const handleUpdatePayment = (budgetId: string, addedPayment: number) => {
    setBudgets(prev => prev.map(b => {
      if (b.id === budgetId) {
        return { ...b, paidAmount: b.paidAmount + addedPayment };
      }
      return b;
    }));
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === todayStr);

  // ── Flujo de fases (después de todos los hooks) ──
  if (appPhase === 'intro') {
    return <IntroScreen onFinish={() => setAppPhase('login')} />;
  }

  if (appPhase === 'login') {
    return <Login onLogin={(role) => { setUsuarioActivo(role); setAppPhase('registro'); }} />;
  }

  if (appPhase === 'registro') {
    return <Registro usuarioLogin={usuarioActivo} onDone={() => setAppPhase('app')} />;
  }

  // ── App principal ──
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-teal-500 selection:text-white">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        todayAppointmentsCount={todayAppointments.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">

        {activeTab === 'odontogram' && (
          <div className="mb-6 bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold uppercase text-slate-400">Paciente Activo:</span>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="px-4 py-2 rounded-xl border border-teal-300 bg-teal-50 text-teal-900 font-bold text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none cursor-pointer"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} - DNI: {p.dni} ({p.healthInsurance})</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-teal-600" /> {patients.length} Pacientes
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-600" /> {todayAppointments.length} Turnos Hoy
              </span>
            </div>
          </div>
        )}

        {activeTab === 'odontogram' && (
          <Odontogram patient={selectedPatient} onUpdateFindings={handleUpdateOdontogramFindings} />
        )}

        {activeTab === 'appointments' && (
          <Appointments
            appointments={appointments}
            patients={patients}
            onAddAppointment={handleAddAppointment}
            onUpdateStatus={handleUpdateAppointmentStatus}
          />
        )}

        {activeTab === 'patients' && (
          <Patients
            patients={patients}
            selectedPatientId={selectedPatientId}
            onSelectPatient={setSelectedPatientId}
            onAddPatient={handleAddPatient}
            onNavigateToOdontogram={(pId) => {
              setSelectedPatientId(pId);
              setActiveTab('odontogram');
            }}
          />
        )}

        {activeTab === 'budgets' && (
          <Budgets
            budgets={budgets}
            patients={patients}
            onAddBudget={handleAddBudget}
            onUpdatePayment={handleUpdatePayment}
          />
        )}

      </main>

      <Footer />
    </div>
  );
};

export default App;
