import React, { useState } from 'react';
import { Patient, DentalXRay } from '../types';
import { Users, UserPlus, Search, ShieldAlert, Phone, Mail, FileText, Activity, ChevronRight, Stethoscope, Camera, Image, Plus, Eye, X, ZoomIn, Upload, Sparkles } from 'lucide-react';

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
  const [showXRayModal, setShowXRayModal] = useState<boolean>(false);
  const [activeXRayLightbox, setActiveXRayLightbox] = useState<DentalXRay | null>(null);

  // Form State Paciente Nuevo
  const [name, setName] = useState<string>('');
  const [dni, setDni] = useState<string>('');
  const [age, setAge] = useState<number>(30);
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [healthInsurance, setHealthInsurance] = useState<string>('Particular / Sin Prepaga');
  const [insuranceNumber, setInsuranceNumber] = useState<string>('');
  const [medicalHistory, setMedicalHistory] = useState<string>('');
  const [allergies, setAllergies] = useState<string>('Ninguna conocida');
  const [notes, setNotes] = useState<string>('');

  // Form State Nueva Radiografía
  const [xrayTitle, setXRayTitle] = useState<string>('');
  const [xrayType, setXRayType] = useState<'panoramica' | 'periapical' | 'oclusal' | 'tomografia'>('panoramica');
  const [xrayDate, setXRayDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [xrayImage, setXRayImage] = useState<string>('');
  const [xrayNotes, setXRayNotes] = useState<string>('');

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
      photoUrl: photoUrl.trim() || undefined,
      healthInsurance,
      insuranceNumber,
      medicalHistory,
      allergies,
      notes,
      odontogramFindings: [],
      xrays: []
    };

    onAddPatient(newP);
    onSelectPatient(newP.id);
    setShowModal(false);
    // Reset form
    setName('');
    setDni('');
    setPhone('');
    setEmail('');
    setPhotoUrl('');
  };

  const handleFileUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUploadXRay = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setXRayImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddXRay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!xrayTitle.trim() || !selectedPatient) return;

    const newXRay: DentalXRay = {
      id: 'xr-' + Date.now(),
      date: xrayDate,
      title: xrayTitle.trim(),
      type: xrayType,
      imageUrl: xrayImage.trim() || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80',
      notes: xrayNotes.trim()
    };

    if (!selectedPatient.xrays) {
      selectedPatient.xrays = [];
    }
    selectedPatient.xrays.unshift(newXRay);

    setShowXRayModal(false);
    setXRayTitle('');
    setXRayImage('');
    setXRayNotes('');
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
          <p className="text-sm text-slate-500">Gestión de datos filiatorios, fotos de perfil, radiografías y antecedentes de salud.</p>
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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col h-[720px] lg:col-span-1">
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
                    <div className="flex items-center space-x-3">
                      {p.photoUrl ? (
                        <img
                          src={p.photoUrl}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover border border-teal-300 shadow-xs"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                          {p.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{p.name}</h4>
                        <p className="text-xs text-slate-500">DNI: <span className="font-semibold text-slate-700">{p.dni}</span> | {p.age} años</p>
                        <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-teal-800">
                          {p.healthInsurance}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className={`w-5 h-5 ${isSelected ? 'text-teal-600' : 'text-slate-300'}`} />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Patient Detail Card & Clinical Sheet */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:col-span-2 flex flex-col justify-between overflow-y-auto max-h-[720px]">
          {selectedPatient ? (
            <div className="space-y-6">
              
              {/* Header profile with photo */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="flex items-center space-x-4">
                  {selectedPatient.photoUrl ? (
                    <img
                      src={selectedPatient.photoUrl}
                      alt={selectedPatient.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500 shadow-md ring-2 ring-teal-200"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-md">
                      {selectedPatient.name.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                      <span>{selectedPatient.name}</span>
                      {selectedPatient.photoUrl && (
                        <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full border border-teal-200">
                          Foto adjunta 📸
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-slate-500 flex items-center gap-3 mt-1">
                      <span>DNI: <strong className="text-slate-700">{selectedPatient.dni}</strong></span>
                      <span>•</span>
                      <span>Edad: <strong className="text-slate-700">{selectedPatient.age} años</strong></span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onNavigateToOdontogram(selectedPatient.id)}
                    className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition flex items-center gap-2"
                  >
                    <Stethoscope className="w-4 h-4" />
                    Abrir Odontograma
                  </button>
                </div>
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

              {/* SECCIÓN DE RADIOGRAFÍAS ODONTOLÓGICAS (OPCIONAL) */}
              <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 space-y-4 shadow-md">
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Image className="w-5 h-5 text-teal-400" />
                    <h4 className="text-sm font-extrabold tracking-wide text-white">
                      Radiografías & Estudios de Imagen ({selectedPatient.xrays?.length || 0})
                    </h4>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      Opcional
                    </span>
                  </div>

                  <button
                    onClick={() => setShowXRayModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adjuntar Radiografía</span>
                  </button>
                </div>

                {/* Galería de Radiografías */}
                {!selectedPatient.xrays || selectedPatient.xrays.length === 0 ? (
                  <div className="text-center py-6 px-4 bg-slate-950/60 rounded-xl border border-slate-800/80">
                    <Camera className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-400 font-medium">No hay radiografías ni estudios cargados para este paciente.</p>
                    <p className="text-[11px] text-slate-500 mt-1">Haz clic en "Adjuntar Radiografía" para subir placas panorámicas o periapicales.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedPatient.xrays.map(xr => (
                      <div
                        key={xr.id}
                        onClick={() => setActiveXRayLightbox(xr)}
                        className="group bg-slate-950 rounded-xl border border-slate-800 hover:border-teal-500/50 p-3 cursor-pointer transition-all hover:shadow-lg overflow-hidden flex flex-col justify-between"
                      >
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-black mb-3 group-hover:opacity-90">
                          <img
                            src={xr.imageUrl}
                            alt={xr.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs text-teal-300 font-bold flex items-center gap-1">
                              <ZoomIn className="w-3.5 h-3.5" /> Ampliar Placa
                            </span>
                          </div>
                          <span className="absolute top-2 right-2 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-black/70 text-teal-300 backdrop-blur-xs border border-slate-700">
                            {xr.type}
                          </span>
                        </div>

                        <div>
                          <div className="flex justify-between items-start">
                            <h5 className="font-bold text-xs text-white group-hover:text-teal-300 transition-colors line-clamp-1">{xr.title}</h5>
                            <span className="text-[10px] text-slate-400">{xr.date}</span>
                          </div>
                          {xr.notes && (
                            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{xr.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <p className="text-slate-400 text-center py-20">Selecciona un paciente de la lista para ver su ficha clínica completa.</p>
          )}
        </div>

      </div>

      {/* MODAL REGISTRAR NUEVO PACIENTE */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
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
              
              {/* Foto opcional del paciente */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-teal-600" /> Foto del Paciente (Opcional)
                </label>

                <div className="flex items-center space-x-4">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Preview" className="w-14 h-14 rounded-xl object-cover border-2 border-teal-500" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400">
                      <Camera className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <label className="px-3 py-1.5 bg-teal-600 text-white font-bold text-xs rounded-lg hover:bg-teal-700 cursor-pointer inline-flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" /> Subir Imagen
                      <input type="file" accept="image/*" onChange={handleFileUploadPhoto} className="hidden" />
                    </label>
                    <input
                      type="url"
                      placeholder="O pega la URL de la foto..."
                      value={photoUrl}
                      onChange={e => setPhotoUrl(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nombre Completo *</label>
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
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">DNI / Documento *</label>
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
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Edad *</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Teléfono Móvil *</label>
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

      {/* MODAL ADJUNTAR RADIOGRAFÍA (OPCIONAL) */}
      {showXRayModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 w-full max-w-lg overflow-hidden animate-fade-in">
            <div className="bg-slate-800 px-6 py-4 flex items-center justify-between border-b border-slate-700">
              <h3 className="font-bold text-base flex items-center gap-2 text-teal-300">
                <Image className="w-5 h-5" /> Adjuntar Radiografía Odontológica
              </h3>
              <button onClick={() => setShowXRayModal(false)} className="text-slate-400 hover:text-white font-bold text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddXRay} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Título / Descripción de la Placa *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Radiografía Panorámica Pre-Conducto"
                  value={xrayTitle}
                  onChange={e => setXRayTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Tipo de Placa</label>
                  <select
                    value={xrayType}
                    onChange={e => setXRayType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="panoramica">Panorámica</option>
                    <option value="periapical">Periapical</option>
                    <option value="tomografia">Tomografía / 3D</option>
                    <option value="oclusal">Oclusal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Fecha del Estudio</label>
                  <input
                    type="date"
                    value={xrayDate}
                    onChange={e => setXRayDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Cargar Imagen de Radiografía</label>
                <div className="space-y-2">
                  <label className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-colors">
                    <Upload className="w-4 h-4 text-teal-400" />
                    <span>Seleccionar Archivo de Imagen</span>
                    <input type="file" accept="image/*" onChange={handleFileUploadXRay} className="hidden" />
                  </label>
                  <input
                    type="url"
                    placeholder="O pega la URL directa de la imagen..."
                    value={xrayImage}
                    onChange={e => setXRayImage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {xrayImage && (
                <div className="aspect-video rounded-xl bg-black overflow-hidden border border-slate-800">
                  <img src={xrayImage} alt="Preview" className="w-full h-full object-contain" />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Observaciones Clínicas (Opcional)</label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre conductos, estado de hueso o hallazgos..."
                  value={xrayNotes}
                  onChange={e => setXRayNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowXRayModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl shadow-md transition"
                >
                  Guardar Radiografía
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIGHTBOX VISOR PANTALLA COMPLETA DE RADIOGRAFÍAS */}
      {activeXRayLightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-4xl w-full max-h-[90vh] flex flex-col bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center text-white">
              <div>
                <h3 className="font-extrabold text-sm text-teal-300 flex items-center gap-2">
                  <ZoomIn className="w-4 h-4" />
                  {activeXRayLightbox.title}
                </h3>
                <span className="text-[11px] text-slate-400">Fecha: {activeXRayLightbox.date} | Tipo: {activeXRayLightbox.type.toUpperCase()}</span>
              </div>
              <button
                onClick={() => setActiveXRayLightbox(null)}
                className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white font-bold"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 bg-black p-4 flex items-center justify-center overflow-auto">
              <img
                src={activeXRayLightbox.imageUrl}
                alt={activeXRayLightbox.title}
                className="max-h-[65vh] object-contain rounded-lg border border-slate-800 shadow-2xl"
              />
            </div>

            {activeXRayLightbox.notes && (
              <div className="p-4 bg-slate-900 border-t border-slate-800 text-xs text-slate-300">
                <strong className="text-teal-400 block mb-1">Informe Diagnóstico / Observaciones:</strong>
                {activeXRayLightbox.notes}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
