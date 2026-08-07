import React, { useEffect, useState } from 'react';
import { Calendar, Clock, User, Stethoscope, X, BellRing, Sparkles } from 'lucide-react';
import { Appointment } from '../types';

interface NewAppointmentTicketProps {
  appointment: Appointment | null;
  onClose: () => void;
}

export const NewAppointmentTicket: React.FC<NewAppointmentTicketProps> = ({
  appointment,
  onClose
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!appointment) return;

    setProgress(100);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 100); // 100ms * 100 = 10.000ms = 10 segundos

    return () => clearInterval(interval);
  }, [appointment, onClose]);

  if (!appointment) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-bounce-short select-none">
      <div className="bg-slate-900 border-2 border-teal-400/80 text-white p-5 rounded-3xl shadow-2xl shadow-teal-500/30 backdrop-blur-xl relative overflow-hidden">
        
        {/* Luz brillante decorativa */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-teal-500/20 blur-xl pointer-events-none" />

        {/* Barra de progreso decreciente (10 segundos) */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-teal-400 to-sky-400 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Encabezado del Ticket */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold border border-teal-500/40 animate-pulse">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Ticket en Pantalla (10s)
              </span>
              <h4 className="text-sm font-extrabold text-white">¡Nuevo Turno Registrado!</h4>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Detalle del Turno */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2 text-slate-200 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <User className="w-4 h-4 text-teal-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">PACIENTE:</span>
              <strong className="text-white font-extrabold text-sm">{appointment.patientName}</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-slate-300">
              <Calendar className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">FECHA:</span>
                <span className="font-bold text-white">{appointment.date}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-slate-300">
              <Clock className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">HORA:</span>
                <span className="font-bold text-teal-300">{appointment.time} hs</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-slate-300">
            <Stethoscope className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">TRATAMIENTO / ESPECIALIDAD:</span>
              <span className="font-bold text-emerald-300">{appointment.specialty}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
