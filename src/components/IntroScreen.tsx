import React, { useEffect, useState } from 'react';

interface IntroScreenProps {
  onFinish: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onFinish }) => {
  const [phase, setPhase] = useState<'enter' | 'show' | 'exit'>('enter');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('show'), 100);
    const t2 = setTimeout(() => setPhase('exit'), 3200);
    const t3 = setTimeout(() => onFinish(), 3900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onFinish]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'linear-gradient(135deg, #0a1628 0%, #0d2137 40%, #0a2e2a 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        transition: 'opacity 0.7s ease',
        opacity: phase === 'exit' ? 0 : 1,
        overflow: 'hidden',
      }}
    >
      {/* Partículas de fondo */}
      <Particles />

      {/* Círculo brillante de fondo */}
      <div style={{
        position: 'absolute',
        width: '600px', height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)',
        animation: 'pulse-glow 2.5s ease-in-out infinite',
      }} />

      {/* Logo y contenido central */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px',
        transform: phase === 'enter' ? 'scale(0.6) translateY(30px)' : 'scale(1) translateY(0)',
        opacity: phase === 'enter' ? 0 : 1,
        transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        position: 'relative', zIndex: 2,
      }}>
        {/* Ícono dental animado */}
        <div style={{
          width: '110px', height: '110px',
          background: 'linear-gradient(135deg, #14b8a6, #0ea5e9)',
          borderRadius: '32px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 60px rgba(20,184,166,0.5), 0 0 120px rgba(20,184,166,0.2)',
          animation: 'float 3s ease-in-out infinite',
        }}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <path
              d="M32 8C22 8 14 16 14 22c0 4 2 7 4 10l4 20c0 2 2 4 4 4s4-2 4-4l2-10h0l2 10c0 2 2 4 4 4s4-2 4-4l4-20c2-3 4-6 4-10 0-6-8-14-18-14z"
              fill="white" fillOpacity="0.95"
              style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.2))' }}
            />
            <circle cx="26" cy="22" r="3" fill="rgba(20,184,166,0.6)" />
            <circle cx="38" cy="22" r="3" fill="rgba(20,184,166,0.6)" />
          </svg>
        </div>

        {/* Nombre del sistema */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '42px', fontWeight: '800', letterSpacing: '-1px',
            background: 'linear-gradient(90deg, #ffffff 0%, #14b8a6 50%, #38bdf8 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            lineHeight: 1.1,
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
          }}>
            OdontoMerlo
          </div>
          <div style={{
            fontSize: '13px', color: 'rgba(148,163,184,0.9)',
            letterSpacing: '3px', textTransform: 'uppercase',
            marginTop: '8px', fontFamily: "'Inter', sans-serif",
          }}>
            Sistema de Gestión Odontológica
          </div>
        </div>

        {/* Barra de progreso */}
        <div style={{
          width: '220px', height: '3px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '999px', overflow: 'hidden',
          marginTop: '8px',
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #14b8a6, #38bdf8)',
            borderRadius: '999px',
            animation: 'progress-fill 2.8s ease forwards',
            boxShadow: '0 0 12px rgba(20,184,166,0.8)',
          }} />
        </div>

        {/* Texto cargando */}
        <div style={{
          fontSize: '12px', color: 'rgba(148,163,184,0.6)',
          letterSpacing: '2px', textTransform: 'uppercase',
          animation: 'blink 1.2s ease-in-out infinite',
          fontFamily: "'Inter', sans-serif",
        }}>
          Cargando sistema...
        </div>
      </div>

      {/* Footer Aura */}
      <div style={{
        position: 'absolute', bottom: '28px',
        fontSize: '11px', color: 'rgba(100,116,139,0.7)',
        letterSpacing: '2px', textTransform: 'uppercase',
        fontFamily: "'Inter', sans-serif",
      }}>
        Powered by Aura ✦
      </div>

      {/* Estilos de animación */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        @keyframes progress-fill {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes blink {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes particle-float {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-100px) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// Partículas flotantes
const Particles: React.FC = () => {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: Math.random() * 100,
    delay: Math.random() * 4,
    duration: Math.random() * 6 + 6,
    opacity: Math.random() * 0.4 + 0.1,
  }));

  return (
    <>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          width: `${p.size}px`, height: `${p.size}px`,
          borderRadius: '50%',
          background: p.id % 3 === 0
            ? 'rgba(20,184,166,0.6)'
            : p.id % 3 === 1
              ? 'rgba(56,189,248,0.5)'
              : 'rgba(255,255,255,0.3)',
          left: `${p.left}%`, bottom: '-10px',
          animation: `particle-float ${p.duration}s ${p.delay}s ease-in infinite`,
        }} />
      ))}
    </>
  );
};
