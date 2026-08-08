import React, { useState } from 'react';
import { Patient, ToothFinding, ToothSurface, ConditionType } from '../types';
import { CONDITION_METAS } from '../data/mockData';
import { AlertCircle, CheckCircle2, FileText, Printer, Trash2, Plus, Info, Sparkles } from 'lucide-react';

interface OdontogramProps {
  patient: Patient;
  onUpdateFindings: (patientId: string, newFindings: ToothFinding[]) => void;
}

// FDI Quadrants Adult
const UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11];
const UPPER_LEFT  = [21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41];
const LOWER_LEFT  = [31, 32, 33, 34, 35, 36, 37, 38];

// FDI Deciduous (Primary teeth)
const PRIMARY_UPPER_RIGHT = [55, 54, 53, 52, 51];
const PRIMARY_UPPER_LEFT  = [61, 62, 63, 64, 65];
const PRIMARY_LOWER_RIGHT = [85, 84, 83, 82, 81];
const PRIMARY_LOWER_LEFT  = [71, 72, 73, 74, 75];

export const Odontogram: React.FC<OdontogramProps> = ({ patient, onUpdateFindings }) => {
  const [selectedCondition, setSelectedCondition] = useState<ConditionType>('caries_np');
  const [selectedTooth, setSelectedTooth] = useState<number | null>(16);
  const [isPrimaryTeethView, setIsPrimaryTeethView] = useState<boolean>(false);
  const [notesInput, setNotesInput] = useState<string>('');
  const [bridgeStartTooth, setBridgeStartTooth] = useState<number | null>(null);

  const findings = patient.odontogramFindings || [];

  const ARCH_SEQUENCES = [
    [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
    [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
    [55, 54, 53, 52, 51, 61, 62, 63, 64, 65],
    [85, 84, 83, 82, 81, 71, 72, 73, 74, 75]
  ];

  // Helper to find condition for a tooth surface
  const getFindingForSurface = (toothNum: number, surface: ToothSurface) => {
    return findings.find(f => f.toothNumber === toothNum && f.surface === surface);
  };

  // Helper to find tooth-level condition (ausente, extraido, endodoncia, corona, extraccion_indicada, puente)
  const getToothLevelFinding = (toothNum: number) => {
    return findings.find(f => f.toothNumber === toothNum && (
      f.surface === 'pieza' || 
      ['ausente', 'extraido', 'corona', 'endodoncia', 'extraccion_indicada', 'puente'].includes(f.condition)
    ));
  };

  const handleSurfaceClick = (toothNum: number, surface: ToothSurface, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTooth(toothNum);

    // Handling Puente Fijo (Method 1: Start Pillar to End Pillar selection)
    if (selectedCondition === 'puente') {
      if (bridgeStartTooth === null) {
        setBridgeStartTooth(toothNum);
      } else {
        const startNum = bridgeStartTooth;
        const endNum = toothNum;
        setBridgeStartTooth(null);

        if (startNum === endNum) return;

        const seq = ARCH_SEQUENCES.find(s => s.includes(startNum) && s.includes(endNum));
        if (!seq) {
          alert("Para crear un puente fijo, ambas piezas deben estar en la misma arcada.");
          return;
        }

        const idx1 = seq.indexOf(startNum);
        const idx2 = seq.indexOf(endNum);
        const minIdx = Math.min(idx1, idx2);
        const maxIdx = Math.max(idx1, idx2);

        const bridgeTeeth = seq.slice(minIdx, maxIdx + 1);
        const p1 = seq[minIdx];
        const p2 = seq[maxIdx];

        // Remove existing findings for these teeth
        let updated = findings.filter(f => !bridgeTeeth.includes(f.toothNumber));
        const today = new Date().toISOString().split('T')[0];

        const bridgeFindingsToAdd: ToothFinding[] = bridgeTeeth.map(tNum => {
          const isPilar = tNum === p1 || tNum === p2;
          return {
            id: 'find-bridge-' + tNum + '-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
            toothNumber: tNum,
            surface: 'pieza',
            condition: 'puente',
            date: today,
            bridgeStart: p1,
            bridgeEnd: p2,
            bridgeRole: isPilar ? 'pilar' : 'pontico',
            notes: isPilar 
              ? `Puente Fijo (Pilar #${p1} a #${p2})` 
              : `Puente Fijo (Póntico Intermedio #${p1} a #${p2})`
          };
        });

        onUpdateFindings(patient.id, [...updated, ...bridgeFindingsToAdd]);
      }
      return;
    }

    // Reset bridge selection if selecting other conditions
    if (bridgeStartTooth !== null) setBridgeStartTooth(null);

    // If selecting tooth-level condition, apply to whole tooth ('pieza')
    let targetSurface: ToothSurface = surface;
    if (['ausente', 'extraido', 'corona', 'endodoncia', 'extraccion_indicada'].includes(selectedCondition)) {
      targetSurface = 'pieza';
    }

    // Filter out existing finding for this tooth and surface
    const existingIndex = findings.findIndex(f => f.toothNumber === toothNum && f.surface === targetSurface);
    
    let updated: ToothFinding[];
    if (selectedCondition === 'sano') {
      // Remove finding if sano
      updated = findings.filter(f => !(f.toothNumber === toothNum && (f.surface === targetSurface || targetSurface === 'pieza')));
    } else {
      const newFinding: ToothFinding = {
        id: 'find-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        toothNumber: toothNum,
        surface: targetSurface,
        condition: selectedCondition,
        date: new Date().toISOString().split('T')[0],
        notes: notesInput || CONDITION_METAS[selectedCondition]?.label || ''
      };

      if (existingIndex >= 0) {
        updated = [...findings];
        updated[existingIndex] = newFinding;
      } else {
        updated = [...findings, newFinding];
      }
    }

    onUpdateFindings(patient.id, updated);
  };

  const handleRemoveFinding = (findingId: string) => {
    const updated = findings.filter(f => f.id !== findingId);
    onUpdateFindings(patient.id, updated);
  };

  // Surface polygon color finder
  const getSurfaceColor = (toothNum: number, surface: ToothSurface) => {
    const finding = getFindingForSurface(toothNum, surface);
    if (!finding) return '#ffffff';
    return CONDITION_METAS[finding.condition]?.color || '#ffffff';
  };

  // Render individual Tooth SVG component
  const renderToothSVG = (toothNum: number) => {
    const toothLevel = getToothLevelFinding(toothNum);
    const isSelected = selectedTooth === toothNum;
    const isAusente = toothLevel?.condition === 'ausente';
    const isExtraido = toothLevel?.condition === 'extraido';
    const isCorona = toothLevel?.condition === 'corona';
    const isEndodoncia = toothLevel?.condition === 'endodoncia';
    const isExtraccionIndicada = toothLevel?.condition === 'extraccion_indicada';
    const isPuente = toothLevel?.condition === 'puente';
    const bridgeRole = toothLevel?.bridgeRole || (toothNum === toothLevel?.bridgeStart || toothNum === toothLevel?.bridgeEnd ? 'pilar' : 'pontico');
    const isBridgePilar = isPuente && bridgeRole === 'pilar';
    const isBridgePontico = isPuente && bridgeRole === 'pontico';
    const isBridgePendingStart = selectedCondition === 'puente' && bridgeStartTooth === toothNum;

    return (
      <div 
        key={toothNum} 
        onClick={() => setSelectedTooth(toothNum)}
        className={`relative flex flex-col items-center p-1.5 rounded-xl transition-all cursor-pointer select-none ${
          isSelected 
            ? 'bg-teal-50 ring-2 ring-teal-500 shadow-md scale-105 z-10' 
            : 'hover:bg-slate-100 hover:scale-102'
        }`}
      >
        <span className="text-xs font-extrabold text-slate-600 mb-1 tracking-wider flex items-center gap-1">
          {toothNum}
          {isPuente && <span className="text-[10px] text-blue-600">🌉</span>}
        </span>

        {/* Tooth SVG Diagram (5 interactive surfaces) */}
        <div className="relative w-11 h-11">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
            {/* Background Tooth Box */}
            <rect x="2" y="2" width="96" height="96" rx="12" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />

            {/* Surface 1: TOP (Vestibular / Lingual) */}
            <polygon 
              points="2,2 98,2 75,25 25,25" 
              fill={getSurfaceColor(toothNum, 'vestibular')} 
              stroke="#64748b" 
              strokeWidth="2.5"
              className="hover:opacity-80 transition-opacity"
              onClick={(e) => handleSurfaceClick(toothNum, 'vestibular', e)}
            >
              <title>Diente {toothNum} - Vestibular</title>
            </polygon>

            {/* Surface 2: BOTTOM (Lingual / Palatina) */}
            <polygon 
              points="25,75 75,75 98,98 2,98" 
              fill={getSurfaceColor(toothNum, 'lingual')} 
              stroke="#64748b" 
              strokeWidth="2.5"
              className="hover:opacity-80 transition-opacity"
              onClick={(e) => handleSurfaceClick(toothNum, 'lingual', e)}
            >
              <title>Diente {toothNum} - Lingual / Palatina</title>
            </polygon>

            {/* Surface 3: LEFT (Mesial / Distal) */}
            <polygon 
              points="2,2 25,25 25,75 2,98" 
              fill={getSurfaceColor(toothNum, 'mesial')} 
              stroke="#64748b" 
              strokeWidth="2.5"
              className="hover:opacity-80 transition-opacity"
              onClick={(e) => handleSurfaceClick(toothNum, 'mesial', e)}
            >
              <title>Diente {toothNum} - Mesial</title>
            </polygon>

            {/* Surface 4: RIGHT (Distal / Mesial) */}
            <polygon 
              points="98,2 98,98 75,75 75,25" 
              fill={getSurfaceColor(toothNum, 'distal')} 
              stroke="#64748b" 
              strokeWidth="2.5"
              className="hover:opacity-80 transition-opacity"
              onClick={(e) => handleSurfaceClick(toothNum, 'distal', e)}
            >
              <title>Diente {toothNum} - Distal</title>
            </polygon>

            {/* Surface 5: CENTER (Oclusal / Incisal) */}
            <polygon 
              points="25,25 75,25 75,75 25,75" 
              fill={getSurfaceColor(toothNum, 'oclusal')} 
              stroke="#64748b" 
              strokeWidth="2.5"
              className="hover:opacity-80 transition-opacity"
              onClick={(e) => handleSurfaceClick(toothNum, 'oclusal', e)}
            >
              <title>Diente {toothNum} - Oclusal / Incisal</title>
            </polygon>

            {/* Overlay: Pending Bridge Selection Highlight */}
            {isBridgePendingStart && (
              <rect x="4" y="4" width="92" height="92" rx="10" fill="none" stroke="#2563eb" strokeWidth="8" className="animate-pulse" />
            )}

            {/* Overlay: Corona (Blue Ring) */}
            {isCorona && (
              <rect x="6" y="6" width="88" height="88" rx="8" fill="none" stroke="#2563eb" strokeWidth="7" strokeDasharray="6 3" />
            )}

            {/* Overlay: Endodoncia (Vertical Line through root - Blue) */}
            {isEndodoncia && (
              <g>
                <line x1="50" y1="0" x2="50" y2="100" stroke="#2563eb" strokeWidth="9" />
                <circle cx="50" cy="50" r="10" fill="#2563eb" />
              </g>
            )}

            {/* Overlay: Extracción Indicada (2 parallel horizontal lines in RED) */}
            {isExtraccionIndicada && (
              <g>
                <line x1="6" y1="36" x2="94" y2="36" stroke="#dc2626" strokeWidth="8" strokeLinecap="round" />
                <line x1="6" y1="64" x2="94" y2="64" stroke="#dc2626" strokeWidth="8" strokeLinecap="round" />
              </g>
            )}

            {/* Overlay: Diente Ausente (RED Cross X) */}
            {isAusente && (
              <g>
                <line x1="10" y1="10" x2="90" y2="90" stroke="#dc2626" strokeWidth="10" strokeLinecap="round" />
                <line x1="90" y1="10" x2="10" y2="90" stroke="#dc2626" strokeWidth="10" strokeLinecap="round" />
              </g>
            )}

            {/* Overlay: Diente Extraído (BLUE Cross X) */}
            {isExtraido && (
              <g>
                <line x1="10" y1="10" x2="90" y2="90" stroke="#2563eb" strokeWidth="10" strokeLinecap="round" />
                <line x1="90" y1="10" x2="10" y2="90" stroke="#2563eb" strokeWidth="10" strokeLinecap="round" />
              </g>
            )}

            {/* Overlay: Puente Fijo Pilar (Crown Outline + Top Bridge Post) */}
            {isBridgePilar && (
              <g>
                <rect x="6" y="6" width="88" height="88" rx="8" fill="none" stroke="#2563eb" strokeWidth="7" strokeDasharray="6 3" />
                <rect x="0" y="0" width="100" height="12" fill="#2563eb" />
                <line x1="50" y1="0" x2="50" y2="24" stroke="#2563eb" strokeWidth="10" />
                <circle cx="50" cy="24" r="7" fill="#2563eb" />
              </g>
            )}

            {/* Overlay: Puente Fijo Póntico (Red Ausente Cross + Blue Top Connecting Bar) */}
            {isBridgePontico && (
              <g>
                <line x1="15" y1="20" x2="85" y2="90" stroke="#dc2626" strokeWidth="8" strokeLinecap="round" />
                <line x1="85" y1="20" x2="15" y2="90" stroke="#dc2626" strokeWidth="8" strokeLinecap="round" />
                <rect x="0" y="0" width="100" height="12" fill="#2563eb" />
                <line x1="0" y1="6" x2="100" y2="6" stroke="#1d4ed8" strokeWidth="4" />
              </g>
            )}
          </svg>
        </div>

        {/* Small badge if findings exist */}
        {findings.some(f => f.toothNumber === toothNum) && (
          <span className="mt-1 w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
        )}
      </div>
    );
  };

  const selectedToothFindings = findings.filter(f => f.toothNumber === selectedTooth);

  return (
    <div className="space-y-6">
      {/* Header & Patient Banner */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
            🦷
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              Odontograma Clínico FDI: <span className="text-teal-600">{patient.name}</span>
            </h2>
            <p className="text-sm text-slate-500">
              DNI: <span className="font-semibold text-slate-700">{patient.dni}</span> | Obra Social: <span className="font-semibold text-slate-700">{patient.healthInsurance} ({patient.insuranceNumber || 'N/A'})</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPrimaryTeethView(!isPrimaryTeethView)}
            className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-teal-600" />
            {isPrimaryTeethView ? 'Ver Dientes Adultos (32)' : 'Ver Dientes Temporales (20)'}
          </button>

          <button 
            onClick={() => window.print()}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-teal-600 text-white hover:bg-teal-700 shadow-sm transition flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Imprimir Odontograma
          </button>
        </div>
      </div>

      {/* Selector de Condición Clínico (Paleta de la facultad) */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-teal-600" />
          Herramienta de Diagnóstico Clínico (Haz clic en una condición y luego en la superficie dental):
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-2">
          {Object.values(CONDITION_METAS).map((cond) => {
            const isActive = selectedCondition === cond.id;
            return (
              <button
                key={cond.id}
                onClick={() => setSelectedCondition(cond.id as ConditionType)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isActive 
                    ? 'border-teal-500 bg-teal-50/50 shadow-md ring-2 ring-teal-400 font-semibold' 
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="w-4 h-4 rounded-full border border-slate-300 shadow-inner flex items-center justify-center text-[10px]" style={{ backgroundColor: cond.color }}>
                    {cond.id === 'extraccion_indicada' && (
                      <span className="font-extrabold text-white text-[10px] leading-none">=</span>
                    )}
                  </span>
                  {cond.id === 'extraccion_indicada' ? (
                    <span className="text-xs font-bold text-red-600 flex flex-col justify-center gap-0.5" title="2 Líneas Horizontales Rojas">
                      <span className="w-3.5 h-[2px] bg-red-600 rounded-full block"></span>
                      <span className="w-3.5 h-[2px] bg-red-600 rounded-full block"></span>
                    </span>
                  ) : cond.id === 'ausente' ? (
                    <span className="text-xs font-bold text-red-600">❌</span>
                  ) : cond.id === 'extraido' ? (
                    <span className="text-xs font-bold text-blue-600">❌</span>
                  ) : cond.symbol ? (
                    <span className="text-xs">{cond.symbol}</span>
                  ) : null}
                </div>
                <span className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight">{cond.label}</span>
              </button>
            );
          })}
        </div>

        {/* Banner de Instrucciones para Modo Puente Fijo */}
        {selectedCondition === 'puente' && (
          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between text-blue-800 text-xs font-medium animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-base">🌉</span>
              {bridgeStartTooth === null ? (
                <span><strong>Modo Puente Fijo Activo:</strong> Haz clic en la <u>Pieza Pilar 1</u> (primer diente del puente).</span>
              ) : (
                <span><strong>Pilar 1 seleccionado (#{bridgeStartTooth}):</strong> Ahora haz clic en la <u>Pieza Pilar 2</u> (último diente del puente) para enlazar el tramo.</span>
              )}
            </div>
            {bridgeStartTooth !== null && (
              <button 
                onClick={() => setBridgeStartTooth(null)} 
                className="px-2.5 py-1 bg-blue-200 hover:bg-blue-300 rounded-lg font-bold text-blue-900 transition"
              >
                Cancelar Selección
              </button>
            )}
          </div>
        )}
      </div>

      {/* Odontograma Visual (Cuadrantes FDI) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 overflow-x-auto">
        <div className="min-w-[720px] space-y-6">
          
          {/* Superior Arch */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200">
            <div className="text-center text-xs font-bold uppercase tracking-wider text-teal-700 mb-3 bg-teal-100/60 py-1 rounded-lg">
              MAXILAR SUPERIOR (Cuadrante 1 y Cuadrante 2)
            </div>

            {!isPrimaryTeethView ? (
              <div className="grid grid-cols-16 gap-1 justify-center items-center">
                {/* Upper Right 18..11 */}
                <div className="col-span-8 flex justify-end gap-1 border-r-2 border-dashed border-teal-300 pr-3">
                  {UPPER_RIGHT.map(num => renderToothSVG(num))}
                </div>
                {/* Upper Left 21..28 */}
                <div className="col-span-8 flex justify-start gap-1 pl-3">
                  {UPPER_LEFT.map(num => renderToothSVG(num))}
                </div>
              </div>
            ) : (
              <div className="flex justify-center gap-1">
                <div className="flex gap-1 border-r-2 border-dashed border-teal-300 pr-3">
                  {PRIMARY_UPPER_RIGHT.map(num => renderToothSVG(num))}
                </div>
                <div className="flex gap-1 pl-3">
                  {PRIMARY_UPPER_LEFT.map(num => renderToothSVG(num))}
                </div>
              </div>
            )}
          </div>

          {/* Line separator representing occlusal plane */}
          <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-400">
            <div className="h-px bg-slate-300 flex-1" />
            <span className="px-3 py-0.5 bg-slate-200 rounded-full text-slate-600">LÍNEA MEDIA / PLANO OCLUSAL</span>
            <div className="h-px bg-slate-300 flex-1" />
          </div>

          {/* Inferior Arch */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200">
            {!isPrimaryTeethView ? (
              <div className="grid grid-cols-16 gap-1 justify-center items-center">
                {/* Lower Right 48..41 */}
                <div className="col-span-8 flex justify-end gap-1 border-r-2 border-dashed border-teal-300 pr-3">
                  {LOWER_RIGHT.map(num => renderToothSVG(num))}
                </div>
                {/* Lower Left 31..38 */}
                <div className="col-span-8 flex justify-start gap-1 pl-3">
                  {LOWER_LEFT.map(num => renderToothSVG(num))}
                </div>
              </div>
            ) : (
              <div className="flex justify-center gap-1">
                <div className="flex gap-1 border-r-2 border-dashed border-teal-300 pr-3">
                  {PRIMARY_LOWER_RIGHT.map(num => renderToothSVG(num))}
                </div>
                <div className="flex gap-1 pl-3">
                  {PRIMARY_LOWER_LEFT.map(num => renderToothSVG(num))}
                </div>
              </div>
            )}

            <div className="text-center text-xs font-bold uppercase tracking-wider text-teal-700 mt-3 bg-teal-100/60 py-1 rounded-lg">
              MAXILAR INFERIOR (Cuadrante 4 y Cuadrante 3)
            </div>
          </div>

        </div>
      </div>

      {/* Dynamic Detail Panel for Selected Tooth & Complete Findings List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Selected Tooth Quick Inspector */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-base">
                Detalle Pieza Dental: <span className="text-2xl font-black text-teal-600">#{selectedTooth || '--'}</span>
              </h3>
              <span className="text-xs bg-slate-100 px-2.5 py-1 rounded-full text-slate-600 font-semibold">
                Nomenclatura FDI
              </span>
            </div>

            {selectedTooth ? (
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase">Nota / Observación para esta pieza:</label>
                  <input
                    type="text"
                    placeholder="Ej. Sensibilidad al frío, cavidad en extensión..."
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Hallazgos registrados en pieza #{selectedTooth}:</h4>
                  {selectedToothFindings.length === 0 ? (
                    <p className="text-sm text-slate-400 italic py-2">Sin lesiones ni restauraciones registradas.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedToothFindings.map(f => {
                        const meta = CONDITION_METAS[f.condition];
                        return (
                          <div key={f.id} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                            <div className="flex items-center space-x-2">
                              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: meta?.color }} />
                              <div>
                                <span className="font-bold text-slate-800">{meta?.label}</span>
                                <span className="text-slate-500 ml-2">({f.surface})</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleRemoveFinding(f.id)}
                              className="text-slate-400 hover:text-red-600 transition p-1"
                              title="Eliminar registro"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-sm">Selecciona una pieza dental en el gráfico superior para ver o modificar su diagnóstico.</p>
            )}
          </div>
        </div>

        {/* Global Patient Findings Table */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600" />
              Resumen Clínico General de Hallazgos ({findings.length})
            </h3>
          </div>

          {findings.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">Odontograma Sano</p>
              <p className="text-xs text-slate-400">No se han marcado hallazgos patológicos en la dentadura.</p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[280px]">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase sticky top-0">
                  <tr>
                    <th className="p-2.5 rounded-l-lg">Pieza</th>
                    <th className="p-2.5">Superficie</th>
                    <th className="p-2.5">Condición</th>
                    <th className="p-2.5">Fecha</th>
                    <th className="p-2.5">Notas</th>
                    <th className="p-2.5 text-right rounded-r-lg">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {findings.map(f => {
                    const meta = CONDITION_METAS[f.condition];
                    return (
                      <tr key={f.id} className="hover:bg-slate-50 transition">
                        <td className="p-2.5 font-black text-teal-700 text-sm">#{f.toothNumber}</td>
                        <td className="p-2.5 font-semibold capitalize text-slate-700">{f.surface}</td>
                        <td className="p-2.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold ${meta?.bgClass} ${meta?.textClass}`}>
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta?.color }} />
                            {meta?.label}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-500">{f.date}</td>
                        <td className="p-2.5 text-slate-600 max-w-[180px] truncate">{f.notes || '-'}</td>
                        <td className="p-2.5 text-right">
                          <button 
                            onClick={() => handleRemoveFinding(f.id)}
                            className="text-slate-400 hover:text-red-600 transition"
                            title="Eliminar hallazgo"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
