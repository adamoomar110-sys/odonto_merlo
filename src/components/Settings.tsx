import React, { useState } from 'react';
import { Building2, UserPlus, Stethoscope, ShieldCheck, Phone, Mail, FileBadge, Check, Trash2, Edit2, Sparkles, Save } from 'lucide-react';
import { Dentist } from '../types';

interface SettingsProps {
  clinicName: string;
  onUpdateClinicName: (newName: string) => void;
  clinicAddress: string;
  onUpdateClinicAddress: (newAddress: string) => void;
  clinicPhone: string;
  onUpdateClinicPhone: (newPhone: string) => void;
  dentists: Dentist[];
  onAddDentist: (dentist: Dentist) => void;
  onToggleDentistStatus: (id: string) => void;
  onDeleteDentist: (id: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  clinicName,
  onUpdateClinicName,
  clinicAddress,
  onUpdateClinicAddress,
  clinicPhone,
  onUpdateClinicPhone,
  dentists,
  onAddDentist,
  onToggleDentistStatus,
  onDeleteDentist,
}) => {
  // Estado local para los campos del consultorio
  const [tempClinicName, setTempClinicName] = useState(clinicName);
  const [tempAddress, setTempAddress] = useState(clinicAddress);
  const [tempPhone, setTempPhone] = useState(clinicPhone);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Estado local para el formulario de nuevo Odontólogo/a
  const [newDentistName, setNewDentistName] = useState('');
  const [newLicense, setNewLicense] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('Odontología General & Ortodoncia');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [dentistSavedMessage, setDentistSavedMessage] = useState(false);

  const handleSaveClinicSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempClinicName.trim()) return;
    onUpdateClinicName(tempClinicName.trim());
    onUpdateClinicAddress(tempAddress.trim());
    onUpdateClinicPhone(tempPhone.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCreateDentist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDentistName.trim() || !newLicense.trim()) return;

    const newDentist: Dentist = {
      id: 'dentist-' + Date.now(),
      name: newDentistName.trim(),
      licenseNumber: newLicense.trim(),
      specialty: newSpecialty.trim(),
      phone: newPhone.trim() || '+54 9 11 0000-0000',
      email: newEmail.trim() || 'contacto@consultorio.com',
      active: true
    };

    onAddDentist(newDentist);
    setNewDentistName('');
    setNewLicense('');
    setNewPhone('');
    setNewEmail('');
    setDentistSavedMessage(true);
    setTimeout(() => setDentistSavedMessage(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Encabezado del Módulo */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              ⚙️
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Configuración del Consultorio</h2>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Administra el nombre de la clínica y da de alta los profesionales odontólogos del staff.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span>Configuración Profesional</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SECCIÓN 1: NOMBRE Y DATOS DEL CONSULTORIO */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">1. Nombre del Consultorio</h3>
              <p className="text-xs text-slate-500">Información visible en la portada, turnos y presupuestos.</p>
            </div>
          </div>

          <form onSubmit={handleSaveClinicSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Nombre del Consultorio *</label>
              <input
                type="text"
                required
                value={tempClinicName}
                onChange={e => setTempClinicName(e.target.value)}
                placeholder="Ej: Odonto Merlo"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Dirección del Consultorio</label>
              <input
                type="text"
                value={tempAddress}
                onChange={e => setTempAddress(e.target.value)}
                placeholder="Ej: Av. del Libertador 1450, Merlo"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Teléfono Principal de Contacto</label>
              <input
                type="text"
                value={tempPhone}
                onChange={e => setTempPhone(e.target.value)}
                placeholder="Ej: +54 9 11 4589-1234"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm font-semibold text-slate-800"
              />
            </div>

            {savedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>¡Nombre y datos del consultorio actualizados correctamente!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm rounded-xl transition-all shadow-md shadow-teal-600/20 flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios del Consultorio</span>
            </button>
          </form>
        </div>

        {/* SECCIÓN 2: FORMULARIO DE ALTA DE ODONTÓLOGOS */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <UserPlus className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">2. Crear Nuevo/a Odontólogo/a</h3>
              <p className="text-xs text-slate-500">Registra un nuevo profesional para atender y firmar historias clínicas.</p>
            </div>
          </div>

          <form onSubmit={handleCreateDentist} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Nombre y Apellido *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Dra. Amalia Merlo"
                  value={newDentistName}
                  onChange={e => setNewDentistName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Matrícula Profesional (MN/MP) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: MP 48902"
                  value={newLicense}
                  onChange={e => setNewLicense(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm font-semibold text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Especialidad Principal</label>
              <input
                type="text"
                placeholder="Ej: Endodoncia & Ortodoncia"
                value={newSpecialty}
                onChange={e => setNewSpecialty(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm font-semibold text-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Teléfono Directo</label>
                <input
                  type="tel"
                  placeholder="Ej: +54 9 11 3456-7890"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="Ej: dra.merlo@odontomerlo.com"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm font-semibold text-slate-800"
                />
              </div>
            </div>

            {dentistSavedMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>¡Nuevo/a Odontólogo/a dado de alta exitosamente!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white font-extrabold text-sm rounded-xl transition-all shadow-md shadow-teal-600/20 flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Registrar Odontólogo/a</span>
            </button>
          </form>
        </div>

      </div>

      {/* SECCIÓN 3: LISTADO Y ESTADO DE ODONTÓLOGOS DEL STAFF */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Staff Odontológico ({dentists.length} Registrados)</h3>
              <p className="text-xs text-slate-500">Nómina de odontólogos habilitados para atender en el consultorio.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dentists.map((dentist) => (
            <div
              key={dentist.id}
              className={`p-5 rounded-2xl border transition-all ${
                dentist.active
                  ? 'border-slate-200 bg-white shadow-xs hover:border-teal-300'
                  : 'border-slate-200 bg-slate-50 opacity-75'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    👨‍⚕️
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{dentist.name}</h4>
                    <span className="text-xs text-teal-700 font-bold flex items-center gap-1">
                      <FileBadge className="w-3.5 h-3.5" />
                      {dentist.licenseNumber}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onToggleDentistStatus(dentist.id)}
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border cursor-pointer ${
                    dentist.active
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-200 text-slate-600 border-slate-300'
                  }`}
                >
                  {dentist.active ? 'Activo/a' : 'Inactivo/a'}
                </button>
              </div>

              <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div><strong>Especialidad:</strong> {dentist.specialty}</div>
                <div><strong>Teléfono:</strong> {dentist.phone}</div>
                <div><strong>Email:</strong> {dentist.email}</div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end gap-2">
                {dentists.length > 1 && (
                  <button
                    onClick={() => onDeleteDentist(dentist.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar profesional"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
