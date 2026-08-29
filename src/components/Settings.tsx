import React, { useState, useMemo } from 'react';
import { Building2, UserPlus, Stethoscope, ShieldCheck, Phone, Mail, FileBadge, Check, Trash2, Edit2, Sparkles, Save, Download, Upload, Database, RefreshCw, AlertCircle, Palette, RotateCcw } from 'lucide-react';
import { Dentist, Patient, Appointment, Budget, ConditionType } from '../types';
import { CONDITION_METAS } from '../data/mockData';

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
  patients: Patient[];
  appointments: Appointment[];
  budgets: Budget[];
  onRestoreBackupData: (backupData: any) => void;
  conditionColors: Record<ConditionType, string>;
  onUpdateConditionColor: (conditionId: ConditionType, newColor: string) => void;
  onResetConditionColors: () => void;
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
  patients,
  appointments,
  budgets,
  onRestoreBackupData,
  conditionColors,
  onUpdateConditionColor,
  onResetConditionColors
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

  // Estado local para Backup
  const [restoreSuccessMessage, setRestoreSuccessMessage] = useState(false);
  const [restoreErrorMessage, setRestoreErrorMessage] = useState('');

  // Filtro de categoría en gestor de colores
  const [colorCategoryFilter, setColorCategoryFilter] = useState<string>('todas');

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

  // Handler para Descargar Backup a la PC del cliente
  const handleDownloadBackup = () => {
    const fullData = {
      version: '1.2.0',
      exportDate: new Date().toISOString(),
      clinicInfo: {
        name: clinicName,
        address: clinicAddress,
        phone: clinicPhone
      },
      conditionColors,
      dentists,
      patients,
      appointments,
      budgets
    };

    const jsonStr = JSON.stringify(fullData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `backup-odontomerlo-${dateStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handler para Cargar y Restaurar Backup desde la PC del cliente
  const handleFileUploadRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsedData = JSON.parse(event.target?.result as string);
        if (!parsedData.clinicInfo || !parsedData.patients) {
          throw new Error('El archivo no contiene un formato de copia de seguridad válido.');
        }
        onRestoreBackupData(parsedData);
        if (parsedData.clinicInfo.name) setTempClinicName(parsedData.clinicInfo.name);
        if (parsedData.clinicInfo.address) setTempAddress(parsedData.clinicInfo.address);
        if (parsedData.clinicInfo.phone) setTempPhone(parsedData.clinicInfo.phone);

        setRestoreSuccessMessage(true);
        setTimeout(() => setRestoreSuccessMessage(false), 4000);
      } catch (err: any) {
        setRestoreErrorMessage(err.message || 'Error al leer el archivo de backup.');
        setTimeout(() => setRestoreErrorMessage(''), 4000);
      }
    };
    reader.readAsText(file);
  };

  const filteredConditionList = useMemo(() => {
    return Object.values(CONDITION_METAS).filter(cond => {
      return colorCategoryFilter === 'todas' || cond.category === colorCategoryFilter;
    });
  }, [colorCategoryFilter]);

  // Preset Palettes
  const applyPresetPalette = (preset: 'facultad' | 'neon' | 'pastel') => {
    if (preset === 'facultad') {
      onResetConditionColors();
    } else if (preset === 'neon') {
      const neonMap: Partial<Record<ConditionType, string>> = {
        caries_np: '#ff0055',
        caries_p: '#ff0000',
        obturado: '#00d2ff',
        obturacion_defectuosa: '#ef4444',
        endodoncia: '#7b00ff',
        corona: '#00ffaa',
        incrustacion: '#00ffff',
        implante: '#39ff14',
        extraccion_indicada: '#ff007f',
        ausente: '#ff2a2a',
        extraido: '#0055ff'
      };
      Object.keys(neonMap).forEach(key => {
        onUpdateConditionColor(key as ConditionType, neonMap[key as ConditionType]!);
      });
    } else if (preset === 'pastel') {
      const pastelMap: Partial<Record<ConditionType, string>> = {
        caries_np: '#f87171',
        caries_p: '#ef4444',
        obturado: '#60a5fa',
        obturacion_defectuosa: '#f87171',
        endodoncia: '#818cf8',
        corona: '#38bdf8',
        incrustacion: '#38bdf8',
        implante: '#34d399',
        extraccion_indicada: '#fb7185',
        ausente: '#f87171',
        extraido: '#3b82f6'
      };
      Object.keys(pastelMap).forEach(key => {
        onUpdateConditionColor(key as ConditionType, pastelMap[key as ConditionType]!);
      });
    }
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
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Configuración & Personalización Profesional</h2>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Administra los datos de la clínica, odontólogos, personalización de colores del odontograma y copias de seguridad.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span>Odonto Merlo v1.2</span>
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

      {/* SECCIÓN 3: PERSONALIZACIÓN DE COLORES DEL ODONTOGRAMA Y TRATAMIENTOS */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                3. Personalización de Colores del Odontograma y Tratamientos
                <span className="text-[10px] font-extrabold uppercase bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                  23 Patologías y Tratamientos
                </span>
              </h3>
              <p className="text-xs text-slate-500">Cambia el color de cada afección o tratamiento para adaptar el odontograma a tus preferencias clínicas.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => applyPresetPalette('facultad')}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="Colores FDI Tradicionales de Universidad"
            >
              🎓 Facultad Tradicional
            </button>
            <button
              onClick={() => applyPresetPalette('neon')}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 transition"
              title="Colores de Alto Contraste / Neón"
            >
              ⚡ Neón / Alto Contraste
            </button>
            <button
              onClick={() => applyPresetPalette('pastel')}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 transition"
              title="Colores Pasteles Suaves"
            >
              🎨 Pastel Clínico
            </button>
            <button
              onClick={onResetConditionColors}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-red-50 hover:bg-red-100 text-red-700 transition flex items-center gap-1"
              title="Restablecer todos los colores a valores por defecto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restablecer
            </button>
          </div>
        </div>

        {/* Filtros de Categoría para Colores */}
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          {[
            { id: 'todas', label: 'Todas (23)' },
            { id: 'patologia', label: 'Patologías & Hallazgos (8)' },
            { id: 'tratamiento', label: 'Tratamientos & Restauraciones (7)' },
            { id: 'protesis', label: 'Prótesis, Implantes & Cirugía (8)' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setColorCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                colorCategoryFilter === cat.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid de Selectores de Color */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredConditionList.map((cond) => {
            const currentColor = conditionColors[cond.id] || cond.color;
            return (
              <div 
                key={cond.id}
                className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-purple-300 transition-all flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  {/* Visual Preview Swatch */}
                  <div 
                    className="w-8 h-8 rounded-xl border border-slate-300 shadow-inner flex items-center justify-center text-xs shrink-0 relative overflow-hidden"
                    style={{ backgroundColor: currentColor }}
                  >
                    {cond.symbol && <span className="font-extrabold text-white drop-shadow-xs">{cond.symbol}</span>}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-extrabold text-slate-800 truncate" title={cond.label}>{cond.label}</h4>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">{currentColor}</span>
                  </div>
                </div>

                {/* Color Picker Input */}
                <div className="relative shrink-0">
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => onUpdateConditionColor(cond.id, e.target.value)}
                    className="w-9 h-9 rounded-xl border border-slate-300 cursor-pointer p-0.5 bg-white shadow-xs hover:scale-105 transition-transform"
                    title={`Cambiar color para: ${cond.label}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECCIÓN 4: COPIA DE SEGURIDAD Y RESTAURACIÓN LOCAL (PC DEL CLIENTE) */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold border border-teal-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                4. Copia de Seguridad & Respaldos (PC Local del Cliente)
                <span className="text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  100% Seguro 🛡️
                </span>
              </h3>
              <p className="text-xs text-slate-400">Descarga un archivo con toda tu información a tu computadora o restaura un backup previo.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Opción A: Descargar Backup */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center space-x-2 text-teal-400 font-bold text-sm mb-2">
                <Download className="w-4 h-4" />
                <span>A. Descargar Copia de Seguridad a tu Computadora</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Descarga un archivo seguro conteniendo la lista de pacientes, odontogramas, colores personalizados, turnos y presupuestos.
              </p>
            </div>

            <button
              onClick={handleDownloadBackup}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-400 hover:to-sky-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Backup Ahora (.json)</span>
            </button>
          </div>

          {/* Opción B: Restaurar Backup */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center space-x-2 text-sky-400 font-bold text-sm mb-2">
                <RefreshCw className="w-4 h-4" />
                <span>B. Restaurar Datos desde un Backup Previo</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Selecciona un archivo de backup previamente descargado (`.json`) para recuperar instantáneamente todos tus datos.
              </p>
            </div>

            <div>
              <label className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-extrabold text-xs rounded-xl cursor-pointer flex items-center justify-center space-x-2 transition-all">
                <Upload className="w-4 h-4 text-sky-400" />
                <span>Seleccionar y Restaurar Backup</span>
                <input type="file" accept=".json" onChange={handleFileUploadRestore} className="hidden" />
              </label>
            </div>
          </div>

        </div>

        {restoreSuccessMessage && (
          <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-2 animate-fade-in">
            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>¡Copia de seguridad restaurada exitosamente! Todos los pacientes, turnos e historias clínicas han sido recuperados.</span>
          </div>
        )}

        {restoreErrorMessage && (
          <div className="p-4 bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold rounded-xl flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{restoreErrorMessage}</span>
          </div>
        )}
      </div>

      {/* SECCIÓN 5: LISTADO Y ESTADO DE ODONTÓLOGOS DEL STAFF */}
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
