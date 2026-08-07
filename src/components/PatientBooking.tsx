import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, CreditCard, ArrowLeft, CheckCircle2, QrCode, Copy, Sparkles, MessageCircle, ShieldCheck, AlertTriangle, CalendarPlus } from 'lucide-react';
import { Appointment } from '../types';

interface PatientBookingProps {
  onBackToMenu: () => void;
  onAddAppointment: (appointment: Appointment) => void;
  onTriggerTicket?: (appointment: Appointment) => void;
}

export const PatientBooking: React.FC<PatientBookingProps> = ({ onBackToMenu, onAddAppointment, onTriggerTicket }) => {
  const [step, setStep] = useState<'schedule' | 'details' | 'payment' | 'confirmed'>('schedule');
  
  // Selección de fecha y turno
  const [selectedSpecialty, setSelectedSpecialty] = useState('Consulta General & Diagnóstico');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('10:00');

  // Datos del paciente
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [dni, setDni] = useState('');

  // Mercado Pago y Pago
  const [paymentOption, setPaymentOption] = useState<'senia' | 'total'>('senia');
  const [copiedAlias, setCopiedAlias] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [newAppointmentId, setNewAppointmentId] = useState('');

  const specialties = [
    { id: 'consulta', name: 'Consulta General & Diagnóstico', price: 25000, senia: 10000 },
    { id: 'limpieza', name: 'Limpieza Ultrasónica & Fluoración', price: 35000, senia: 15000 },
    { id: 'operatoria', name: 'Operatoria & Arreglo de Caries', price: 45000, senia: 20000 },
    { id: 'ortodoncia', name: 'Control de Ortodoncia', price: 30000, senia: 15000 },
  ];

  const currentSpecialtyObj = specialties.find(s => s.name === selectedSpecialty) || specialties[0];
  const amountToPay = paymentOption === 'senia' ? currentSpecialtyObj.senia : currentSpecialtyObj.price;

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const handleCopyAlias = () => {
    navigator.clipboard.writeText('ODONTO.MERLO.MP');
    setCopiedAlias(true);
    setTimeout(() => setCopiedAlias(false), 2500);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    setTimeout(() => {
      const generatedId = 'app-online-' + Date.now();
      setNewAppointmentId(generatedId);

      const newApp: Appointment = {
        id: generatedId,
        patientId: 'online-' + Date.now(),
        patientName: nombre.trim(),
        patientPhone: telefono.trim(),
        dentistName: 'Dra. Amalia Merlo',
        date: selectedDate,
        time: selectedTime,
        specialty: selectedSpecialty,
        status: 'confirmado',
        notes: `Turno reservado online. Pago acreditado vía Mercado Pago (${paymentOption === 'senia' ? 'Seña abonada: $' + amountToPay : 'Pago total: $' + amountToPay}). DNI: ${dni}`
      };

      onAddAppointment(newApp);
      if (onTriggerTicket) {
        onTriggerTicket(newApp);
      }
      setIsProcessingPayment(false);
      setStep('confirmed');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between relative overflow-x-hidden">
      
      {/* Header */}
      <header className="px-6 py-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center space-x-4 max-w-7xl mx-auto w-full justify-between">
          <button
            onClick={onBackToMenu}
            className="flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-teal-400 transition-colors bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700/60"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Menú</span>
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
              🦷
            </div>
            <span className="font-extrabold text-white tracking-tight hidden sm:inline">OdontoMerlo</span>
            <span className="text-xs text-sky-400 font-semibold px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20">
              Reserva de Turnos Online
            </span>
          </div>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 flex flex-col justify-center">

        {/* PASO 1: SELECCIÓN DE FECHA Y HORARIO */}
        {step === 'schedule' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl animate-fade-in">
            <div className="mb-6">
              <span className="text-xs font-extrabold uppercase tracking-widest text-sky-400">Paso 1 de 3</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Selecciona tu Turno</h2>
              <p className="text-slate-400 text-sm mt-1">Elige la especialidad y el horario que más te convenga.</p>
            </div>

            {/* Especialidades */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase text-slate-300 tracking-wider mb-2">Especialidad u Odontología:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {specialties.map(spec => (
                  <div
                    key={spec.id}
                    onClick={() => setSelectedSpecialty(spec.name)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedSpecialty === spec.name
                        ? 'border-sky-500 bg-sky-500/15 text-white ring-2 ring-sky-500/30'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-sm">{spec.name}</div>
                    <div className="text-xs text-slate-400 mt-1 flex justify-between">
                      <span>Valor: ${spec.price.toLocaleString('es-AR')}</span>
                      <span className="text-sky-400 font-semibold">Seña: ${spec.senia.toLocaleString('es-AR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fecha */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase text-slate-300 tracking-wider mb-2">Fecha del Turno:</label>
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-bold text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Horarios disponibles */}
            <div className="mb-8">
              <label className="block text-xs font-bold uppercase text-slate-300 tracking-wider mb-2">Horarios Disponibles:</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {timeSlots.map(time => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`py-2.5 px-3 rounded-xl font-bold text-sm border transition-all ${
                      selectedTime === time
                        ? 'bg-sky-500 border-sky-400 text-white shadow-lg shadow-sky-500/25'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {time} hs
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep('details')}
              className="w-full py-4 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-white font-extrabold text-base rounded-2xl transition-all shadow-xl shadow-sky-500/25 flex items-center justify-center space-x-2"
            >
              <span>Continuar con Mis Datos</span>
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </button>
          </div>
        )}

        {/* PASO 2: REGISTRO DE DATOS DEL PACIENTE */}
        {step === 'details' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl animate-fade-in">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-sky-400">Paso 2 de 3</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Tus Datos de Contacto</h2>
                <p className="text-slate-400 text-sm mt-1">Para confirmar la reserva y enviarte el recordatorio.</p>
              </div>
              <button
                onClick={() => setStep('schedule')}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                Cambiar Fecha
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); if (nombre && telefono && dni) setStep('payment'); }}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Nombre y Apellido *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="Ej: Juan Pérez"
                      value={nombre}
                      onChange={e => setNombre(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Teléfono / WhatsApp *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      required
                      placeholder="Ej: 11 2345-6789"
                      value={telefono}
                      onChange={e => setTelefono(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">DNI *</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="Ej: 35.890.123"
                      value={dni}
                      onChange={e => setDni(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>

              {/* Resumen breve */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 mb-6 text-xs text-slate-300 space-y-1">
                <div className="font-bold text-sky-400">Resumen del Turno:</div>
                <div><strong>Especialidad:</strong> {selectedSpecialty}</div>
                <div><strong>Fecha y Hora:</strong> {selectedDate} a las {selectedTime} hs</div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('schedule')}
                  className="w-1/3 py-3.5 bg-slate-800 text-slate-300 font-bold rounded-2xl hover:bg-slate-700 text-sm"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3.5 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-white font-extrabold rounded-2xl text-sm shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2"
                >
                  <span>Ir al Pago con Mercado Pago</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PASO 3: PAGO CON MERCADO PAGO */}
        {step === 'payment' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl animate-fade-in">
            <div className="mb-6">
              <span className="text-xs font-extrabold uppercase tracking-widest text-sky-400">Paso 3 de 3</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 flex items-center gap-2">
                <span>Pago con Mercado Pago</span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  Verificado 💙
                </span>
              </h2>
              <p className="text-slate-400 text-sm mt-1">Realiza la seña o pago total para reservar tu turno en la agenda.</p>
            </div>

            {/* Opciones de pago: Seña o Total */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div
                onClick={() => setPaymentOption('senia')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentOption === 'senia'
                    ? 'border-sky-500 bg-sky-500/15 text-white ring-2 ring-sky-500/30'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400'
                }`}
              >
                <div className="text-xs font-bold text-sky-400">Abonar Seña (Recomendado)</div>
                <div className="text-xl font-black text-white mt-1">${currentSpecialtyObj.senia.toLocaleString('es-AR')}</div>
                <div className="text-[11px] text-slate-400 mt-1">El resto se abona en el consultorio</div>
              </div>

              <div
                onClick={() => setPaymentOption('total')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentOption === 'total'
                    ? 'border-sky-500 bg-sky-500/15 text-white ring-2 ring-sky-500/30'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400'
                }`}
              >
                <div className="text-xs font-bold text-teal-400">Abonar Pago Total</div>
                <div className="text-xl font-black text-white mt-1">${currentSpecialtyObj.price.toLocaleString('es-AR')}</div>
                <div className="text-[11px] text-slate-400 mt-1">100% del tratamiento congelado</div>
              </div>
            </div>

            {/* Datos de transferencia de Mercado Pago */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-black">
                    MP
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Mercado Pago / CVU</div>
                    <div className="text-[11px] text-slate-400">Odonto Merlo Centro Odontológico</div>
                  </div>
                </div>
                <QrCode className="w-6 h-6 text-sky-400" />
              </div>

              {/* Alias Mercado Pago */}
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Alias Mercado Pago</div>
                  <div className="text-sm font-extrabold text-sky-300 tracking-wider">ODONTO.MERLO.MP</div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyAlias}
                  className="px-3 py-1.5 bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedAlias ? '¡Copiado!' : 'Copiar'}</span>
                </button>
              </div>

              {/* CBU / CVU */}
              <div className="text-xs text-slate-400 space-y-1">
                <div><strong>CVU Mercado Pago:</strong> 0000003100045891234567</div>
                <div><strong>Monto a transferir:</strong> <span className="text-white font-bold">${amountToPay.toLocaleString('es-AR')}</span></div>
              </div>
            </div>

            <form onSubmit={handleConfirmBooking}>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="w-1/3 py-4 bg-slate-800 text-slate-300 font-bold rounded-2xl hover:bg-slate-700 text-sm"
                >
                  Atrás
                </button>

                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-2/3 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold rounded-2xl text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Verificando Pago...</span>
                    </div>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      <span>Confirmar Reserva y Pago</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PASO 4: CONFIRMACIÓN EXITOSA */}
        {step === 'confirmed' && (
          <div className="bg-slate-900/90 border border-teal-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-center animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-xl shadow-teal-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400">¡Reserva Exitosa!</span>
            <h2 className="text-3xl font-extrabold text-white mt-1 mb-2">¡Tu turno ha sido reservado!</h2>
            <p className="text-slate-300 text-sm max-w-md mx-auto mb-6">
              Hola <strong className="text-white">{nombre}</strong>, tu cita ha sido registrada exitosamente en la agenda del consultorio.
            </p>

            {/* Tarjeta de comprobante */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 max-w-md mx-auto text-left mb-6 text-xs text-slate-300 space-y-2">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Código de Turno:</span>
                <span className="font-mono font-bold text-teal-300">{newAppointmentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Especialidad:</span>
                <span className="font-bold text-white">{selectedSpecialty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fecha y Hora:</span>
                <span className="font-bold text-white">{selectedDate} - {selectedTime} hs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Paciente:</span>
                <span className="font-bold text-white">{nombre} (DNI: {dni})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Teléfono:</span>
                <span className="font-bold text-white">{telefono}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 text-teal-400 font-bold">
                <span>Estado de Pago:</span>
                <span>Mercado Pago Acreditado</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 max-w-md mx-auto">
              <a
                href={`https://wa.me/5491123456789?text=Hola%20OdontoMerlo,%20acabo%20de%20reservar%20mi%20turno%20para%20el%20${selectedDate}%20a%20las%20${selectedTime}%20hs.%20Nombre:%20${encodeURIComponent(nombre)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enviar Comprobante por WhatsApp</span>
              </a>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Turno+Odontologico+${encodeURIComponent(selectedSpecialty)}&dates=${selectedDate.replace(/-/g, '')}T${selectedTime.replace(':', '')}00/${selectedDate.replace(/-/g, '')}T${selectedTime.replace(':', '')}00&details=Turno+Odontologico+en+OdontoMerlo+con+la+Dra.+Amalia+Merlo`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  <CalendarPlus className="w-4 h-4" />
                  <span>Agendar en Google Calendar</span>
                </a>

                <a
                  href={`https://wa.me/5491123456789?text=Hola%20OdontoMerlo,%20te%20escribo%20por%20un%20imprevisto%20con%20mi%20turno%20del%20${selectedDate}%20a%20las%20${selectedTime}%20hs.%20Nombre:%20${encodeURIComponent(nombre)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Avisar Imprevisto</span>
                </a>
              </div>

              <button
                onClick={onBackToMenu}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all border border-slate-800"
              >
                Volver al Menú Principal
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer AURA */}
      <footer className="py-6 px-6 border-t border-slate-900 bg-slate-950 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>OdontoMerlo Reserva de Turnos © 2026</span>
          <div className="text-slate-400 font-medium flex items-center gap-1.5 px-3 py-1 bg-slate-900 rounded-full border border-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>© 2026 AURA Startup. Todos los derechos reservados.</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
