import React, { useState } from 'react';
import { ActiveTab, Navbar } from './components/Navbar';
import { Odontogram } from './components/Odontogram';
import { Appointments } from './components/Appointments';
import { Patients } from './components/Patients';
import { Budgets } from './components/Budgets';
import { Settings } from './components/Settings';
import { Footer } from './components/Footer';
import { IntroScreen } from './components/IntroScreen';
import { MainMenu } from './components/MainMenu';
import { PatientBooking } from './components/PatientBooking';
import { Login } from './components/Login';
import { Registro } from './components/Registro';
import { INITIAL_PATIENTS, INITIAL_APPOINTMENTS, INITIAL_BUDGETS } from './data/mockData';
import { Patient, Appointment, Budget, ToothFinding, AppointmentStatus, Dentist } from './types';
import { Calendar, Users, LogOut } from 'lucide-react';

type AppPhase = 'intro' | 'main_menu' | 'booking' | 'login' | 'registro' | 'app';

export const App: React.FC = () => {
  // ── TODOS los hooks siempre al tope (regla de React) ──
  const [appPhase, setAppPhase] = useState<AppPhase>('intro');
  const [usuarioActivo, setUsuarioActivo] = useState<string>('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('odontogram');
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(INITIAL_PATIENTS[0].id);

  // Estado del consultorio y staff de odontólogos
  const [clinicName, setClinicName] = useState<string>('Odonto Merlo');
  const [clinicAddress, setClinicAddress] = useState<string>('Av. del Libertador 1450, Merlo');
  const [clinicPhone, setClinicPhone] = useState<string>('+54 9 11 4589-1234');
  const [dentists, setDentists] = useState<Dentist[]>([
    { id: 'den-1', name: 'Dra. Amalia Merlo', licenseNumber: 'MP 45890', specialty: 'Ortodoncia & Operatoria', phone: '+54 9 11 4589-1234', email: 'dra.merlo@odontomerlo.com', active: true },
    { id: 'den-2', name: 'Dr. Fernando Ruiz', licenseNumber: 'MP 51203', specialty: 'Endodoncia & Cirugía', phone: '+54 9 11 6723-9988', email: 'dr.ruiz@odontomerlo.com', active: true }
  ]);

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

  // Handlers Odontólogos
  const handleAddDentist = (newDentist: Dentist) => {
    setDentists(prev => [newDentist, ...prev]);
  };

  const handleToggleDentistStatus = (id: string) => {
    setDentists(prev => prev.map(d => d.id === id ? { ...d, active: !d.active } : d));
  };

  const handleDeleteDentist = (id: string) => {
    setDentists(prev => prev.filter(d => d.id !== id));
  };

  // Handler para Restaurar Backup Completo
  const handleRestoreBackupData = (backupData: any) => {
    if (backupData.clinicInfo) {
      if (backupData.clinicInfo.name) setClinicName(backupData.clinicInfo.name);
      if (backupData.clinicInfo.address) setClinicAddress(backupData.clinicInfo.address);
      if (backupData.clinicInfo.phone) setClinicPhone(backupData.clinicInfo.phone);
    }
    if (Array.isArray(backupData.dentists)) setDentists(backupData.dentists);
    if (Array.isArray(backupData.patients)) {
      setPatients(backupData.patients);
      if (backupData.patients.length > 0) setSelectedPatientId(backupData.patients[0].id);
    }
    if (Array.isArray(backupData.appointments)) setAppointments(backupData.appointments);
    if (Array.isArray(backupData.budgets)) setBudgets(backupData.budgets);
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === todayStr);

  // ── Flujo de fases ──
  if (appPhase === 'intro') {
    return <IntroScreen onFinish={() => setAppPhase('main_menu')} />;
  }

  if (appPhase === 'main_menu') {
    return (
      <MainMenu
        onSelectConsultorio={() => setAppPhase('login')}
        onSelectReservarTurno={() => setAppPhase('booking')}
      />
    );
  }

  if (appPhase === 'booking') {
    return (
      <PatientBooking
        onBackToMenu={() => setAppPhase('main_menu')}
        onAddAppointment={handleAddAppointment}
      />
    );
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
        clinicName={clinicName}
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
              <button
                onClick={() => setAppPhase('main_menu')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors border border-slate-300"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-600" />
                <span>Menú Principal</span>
              </button>
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

        {activeTab === 'settings' && (
          <Settings
            clinicName={clinicName}
            onUpdateClinicName={setClinicName}
            clinicAddress={clinicAddress}
            onUpdateClinicAddress={setClinicAddress}
            clinicPhone={clinicPhone}
            onUpdateClinicPhone={setClinicPhone}
            dentists={dentists}
            onAddDentist={handleAddDentist}
            onToggleDentistStatus={handleToggleDentistStatus}
            onDeleteDentist={handleDeleteDentist}
            patients={patients}
            appointments={appointments}
            budgets={budgets}
            onRestoreBackupData={handleRestoreBackupData}
          />
        )}

      </main>

      <Footer />
    </div>
  );
};

export default App;
