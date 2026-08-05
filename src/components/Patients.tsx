import React, { useState } from 'react';
import { Patient } from '../types';
import { Users, UserPlus, Search, ShieldAlert, Phone, Mail, FileText, Activity, ChevronRight, Stethoscope } from 'lucide-react';

interface PatientsProps {
  patients: Patient[];
  selectedPatientId: string;
  onSelectPatient: (patientId: string) => void;
  onAddPatient: (newPatient: Patient) => void;
  onNavigateToOdontogram: (patientId: string) => void;
}

export const Patients: React.FC<PatientsProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
  onAddPatient,
  onNavigateToOdontogram
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);

  // Form State
  const [name, setName] = useState<string>('');
  const [dni, setDni] = useState<string>('');
  const [age, setAge] = useState<number>(30);
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [healthInsurance, setHealthInsurance] = useState<string>('Particular / Sin Prepaga');
  const [insuranceNumber, setInsuranceNumber] = useState<string>('');
  const [medicalHistory, setMedicalHistory] = useState<string>('');
  const [allergies, setAllergies] = useState<string>('Ninguna conocida');
  const [notes, setNotes] = useState<string>('');

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.dni.includes(searchQuery) ||
    p.phone.includes(searchQuery)
  );

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    const newP: Patient = {
      id: 'p-' + Date.now(),
      name,
      dni,
      age: Number(age),
      phone,
      email,
      healthInsurance,
      insuranceNumber,
      medicalHistory,
      allergies,
      notes,
      odontogramFindings: []
    };

    onAddPatient(newP);
    onSelectPatient(newP.id);
    setShowModal(false);
    // Reset form
    setName('');
    setDni('');
    setPhone('');
    setEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-600" />
            Fichas e Historias Clínicas de Pacientes
          </h2>
          <p className="text-sm text-slate-500">Gestión de datos filiatorios, cobertura médica, antecedentes y alertas de salud.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 text-sm"
        >
          <UserPlus className="w-5 h-5" />
          Registrar Nuevo Paciente
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Patients List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col h-[650px] lg:col-span-1">
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar por Nombre, DNI o Teléfono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredPatients.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-400">No se encontraron pacientes registrados.</p>
            ) : (
              filteredPatients.map((p) => {
                const isSelected = p.id === selectedPatient?.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectPatient(p.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/70 shadow-sm ring-1 ring-teal-400'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{p.name}</h4>
                      <p className="text-xs text-slate-500">DNI: <span className="font-semibold text-slate-700">{p.dni}</span> | {p.age} años</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-teal-800">
                        {p.healthInsurance}
                      </span>
                    </div>

                    <ChevronRight className={`w-5 h-5 ${isSelected ? 'text-teal-600' : 'text-slate-300'}`} />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Patient Detail Card & Clinical Sheet */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:col-span-2 flex flex-col justify-between">
          {selectedPatient ? (
            <div className="space-y-6">
              
              {/* Header profile */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
                    {selectedPatient.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">{selectedPatient.name}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-3">
                      <span>DNI: <strong className="text-slate-700">{selectedPatient.dni}</strong></span>
                      <span>•</span>
                      <span>Edad: <strong className="text-slate-700">{selectedPatient.age} años</strong></span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToOdontogram(selectedPatient.id)}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition flex items-center gap-2"
                >
                  <Stethoscope className="w-4 h-4" />
                  Abrir Odontograma
                </button>
              </div>

              {/* Patient Info Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Contact & Insurance */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-teal-600" /> Cobertura & Contacto
                  </h4>
                  <div className="text-xs space-y-1.5">
                    <p><span className="text-slate-400 font-medium">Obra Social / Prepaga:</span> <strong className="text-slate-800">{selectedPatient.healthInsurance}</strong></p>
                    <p><span className="text-slate-400 font-medium">N° de Afiliado:</span> <strong className="text-slate-800">{selectedPatient.insuranceNumber || 'Sin información'}</strong></p>
                    <p><span className="text-slate-400 font-medium">Teléfono:</span> <strong className="text-teal-700">{selectedPatient.phone}</strong></p>
                    <p><span className="text-slate-400 font-medium">Email:</span> <strong className="text-slate-700">{selectedPatient.email || 'N/A'}</strong></p>
                  </div>
                </div>

                {/* Medical History & Allergies Alert */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-teal-600" /> Antecedentes Médicos
                  </h4>
                  
                  {/* Allergy Highlight Box */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 text-xs text-red-800 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-red-900">Alergias Conocidas:</strong>
                      {selectedPatient.allergies}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600">
                    <span className="font-bold text-slate-700">Historia Clínica:</span> {selectedPatient.medicalHistory || 'Sin hallazgos de relevancia médica registrados.'}
                  </p>
                </div>

              </div>

              {/* Odontogram Summary Box */}
              <div className="bg-teal-50/50 rounded-xl p-4 border border-teal-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-teal-600" /> Estado del Odontograma
                  </h4>
                  <span className="text-xs font-extrabold text-teal-700 bg-white px-2.5 py-0.5 rounded-full border border-teal-200">
                    {selectedPatient.odontogramFindings?.length || 0} Hallazgos Registrados
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  {selectedPatient.odontogramFindings && selectedPatient.odontogramFindings.length > 0 
                    ? `Piezas afectadas o tratadas: ${Array.from(new Set(selectedPatient.odontogramFindings.map(f => f.toothNumber))).map(n => `#${n}`).join(', ')}.`
                    : 'Sin registros de patologías en el mapa dental activo.'
                  }
                </p>
              </div>

            </div>
          ) : (
            <p className="text-slate-400 text-center py-20">Selecciona un paciente de la lista para ver su ficha clínica completa.</p>
          )}
        </div>

      </div>

      {/* Modal Registrar Nuevo Paciente */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-teal-600 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <UserPlus className="w-5 h-5" /> Ficha de Alta de Nuevo Paciente
              </h3>
              <button onClick={() => setShowModal(false)} className="text-teal-100 hover:text-white font-bold text-xl">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nombre Completo:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Ana Paula Fernández"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">DNI / Documento:</label>
                  <input
                    type="text"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    placeholder="Ej. 35.123.456"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Edad:</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Teléfono Móvil:</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+54 9 11 ..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="paciente@email.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Obra Social / Cobertura:</label>
                  <input
                    type="text"
                    value={healthInsurance}
                    onChange={(e) => setHealthInsurance(e.target.value)}
                    placeholder="OSDE, Swiss Medical, IOMA, Particular..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">N° de Afiliado:</label>
                  <input
                    type="text"
                    value={insuranceNumber}
                    onChange={(e) => setInsuranceNumber(e.target.value)}
                    placeholder="N° credencial"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1 text-red-700">Alergias Medicamentosas o del Paciente:</label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="Ej. Penicilina, Látex, Aspirina (o 'Ninguna')"
                  className="w-full px-3 py-2 rounded-xl border border-red-200 bg-red-50/50 text-sm text-red-900 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Antecedentes Médicos / Enfermedades:</label>
                <textarea
                  rows={2}
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  placeholder="Diabetes, hipertensión, prótesis, medicación crónica..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition"
                >
                  Guardar Paciente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
