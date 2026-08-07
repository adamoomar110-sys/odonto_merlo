import React, { useState } from 'react';
import { Appointment, Patient, AppointmentStatus } from '../types';
import { Calendar, Clock, Plus, Search, CheckCircle, XCircle, AlertCircle, MessageSquare, User, Filter, Phone, AlertTriangle, Sparkles } from 'lucide-react';

interface AppointmentsProps {
  appointments: Appointment[];
  patients: Patient[];
  onAddAppointment: (newApp: Appointment) => void;
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
  onTriggerTicket?: (app: Appointment) => void;
}

export const Appointments: React.FC<AppointmentsProps> = ({
  appointments,
  patients,
  onAddAppointment,
  onUpdateStatus,
  onTriggerTicket
}) => {
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);

  // Form State
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const [dentistName, setDentistName] = useState<string>('Dra. Amalia Merlo');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>('10:00');
  const [specialty, setSpecialty] = useState<string>('Consultorio General');
  const [notes, setNotes] = useState<string>('');

  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = app.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || app.dentistName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || app.status === filterStatus;
    const matchesDate = !filterDate || app.date === filterDate;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const patientObj = patients.find(p => p.id === selectedPatientId);
    if (!patientObj) return;

    const newApp: Appointment = {
      id: 'app-' + Date.now(),
      patientId: patientObj.id,
      patientName: patientObj.name,
      patientPhone: patientObj.phone,
      dentistName,
      date,
      time,
      specialty,
      status: 'pendiente',
      notes
    };

    onAddAppointment(newApp);
    if (onTriggerTicket) {
      onTriggerTicket(newApp);
    }
    setShowModal(false);
    setNotes('');
  };

  const generateWhatsAppMessage = (app: Appointment) => {
    const text = `Hola ${app.patientName}, te recordamos tu turno en *Odonto Merlo* el día ${app.date} a las ${app.time} hs con ${app.dentistName} (${app.specialty}). Por favor confirma tu asistencia respondiendo a este mensaje. ¡Te esperamos!`;
    const encoded = encodeURIComponent(text);
    const cleanPhone = app.patientPhone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  const generateWhatsAppImprevistoMessage = (app: Appointment) => {
    const text = `Hola ${app.patientName}, te contactamos desde *Odonto Merlo* por un imprevisto de fuerza mayor con tu turno del día ${app.date} a las ${app.time} hs (${app.specialty}). Nos gustaría reprogramar tu cita. Por favor dinos qué horario te queda cómodo. ¡Muchas gracias!`;
    const encoded = encodeURIComponent(text);
    const cleanPhone = app.patientPhone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmado':
        return <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Confirmado</span>;
      case 'pendiente':
        return <span className="bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Pendiente</span>;
      case 'atendido':
        return <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Atendido</span>;
      case 'cancelado':
        return <span className="bg-red-100 text-red-800 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Cancelado</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Action */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-teal-600" />
            Agenda y Gestión de Turnos
          </h2>
          <p className="text-sm text-slate-500">Administración de citas odontológicas, confirmación y recordatorios por WhatsApp.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 text-sm"
        >
          <Plus className="w-5 h-5" />
          Agendar Nuevo Turno
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por paciente u odontólogo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
          {filterDate && (
            <button onClick={() => setFilterDate('')} className="text-xs text-teal-600 hover:underline">
              Limpiar fecha
            </button>
          )}
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white font-semibold text-slate-700"
        >
          <option value="todos">Todos los Estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="confirmado">Confirmado</option>
          <option value="atendido">Atendido</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="font-semibold text-slate-600">No se encontraron turnos programados.</p>
            <p className="text-xs">Prueba cambiando los filtros o agenda una nueva cita.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredAppointments.map((app) => (
              <div key={app.id} className="p-5 hover:bg-slate-50/80 transition flex flex-wrap items-center justify-between gap-4">
                
                <div className="flex items-start space-x-4 min-w-[280px]">
                  <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex flex-col items-center justify-center font-bold text-xs shrink-0 border border-teal-200">
                    <span className="text-base leading-none">{app.time}</span>
                    <span className="text-[10px] text-teal-600 font-normal uppercase mt-0.5">{app.date.split('-').slice(1).join('/')}</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                      {app.patientName}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <User className="w-3.5 h-3.5 text-slate-400" /> {app.dentistName} — <span className="font-semibold text-teal-700">{app.specialty}</span>
                    </p>
                    {app.notes && (
                      <p className="text-xs text-slate-600 mt-1 italic bg-slate-100 px-2 py-0.5 rounded inline-block">
                        "{app.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {getStatusBadge(app.status)}

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => generateWhatsAppMessage(app)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition border border-emerald-200 flex items-center gap-1 text-xs font-bold"
                      title="Enviar recordatorio 24hs por WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Recordatorio 24hs</span>
                    </button>

                    <button
                      onClick={() => generateWhatsAppImprevistoMessage(app)}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 transition border border-amber-200 flex items-center gap-1 text-xs font-bold"
                      title="Avisar imprevisto o reprogramación por WhatsApp"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Avisar Imprevisto</span>
                    </button>

                    <select
                      value={app.status}
                      onChange={(e) => onUpdateStatus(app.id, e.target.value as AppointmentStatus)}
                      className="text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="confirmado">Confirmar</option>
                      <option value="atendido">Marcar Atendido</option>
                      <option value="cancelado">Cancelar</option>
                    </select>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Agendar Turno */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-teal-600 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" /> Agendar Nuevo Turno Odontológico
              </h3>
              <button onClick={() => setShowModal(false)} className="text-teal-100 hover:text-white font-bold text-xl">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Paciente:</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - DNI: {p.dni}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Odontólogo Tratante:</label>
                  <select
                    value={dentistName}
                    onChange={(e) => setDentistName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="Dr. Rodrigo Merlo">Dr. Rodrigo Merlo</option>
                    <option value="Dra. Silvina Merlo">Dra. Silvina Merlo</option>
                    <option value="Dr. Alejandro Merlo">Dr. Alejandro Merlo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Especialidad / Motivo:</label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    placeholder="Ej. Operatoria, Endodoncia..."
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Fecha:</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Hora:</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Observaciones / Indicaciones:</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detalles sobre el procedimiento o requerimientos del paciente..."
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
                  Confirmar Turno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
