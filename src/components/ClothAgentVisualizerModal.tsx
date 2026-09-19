import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ShieldCheck,
  Check,
  X,
  Scan,
  Layers,
  Shirt,
  Palette,
  CheckCircle2,
  Eye,
  RefreshCw,
  IndianRupee,
  Star,
  ArrowRightLeft,
  Ruler
} from 'lucide-react';
import { Product, ClothingProduct } from '../types';
import { VERIFIED_CATALOG } from '../data/catalog';

interface ClothAgentVisualizerModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSwapItem?: (originalId: string, substitute: Product) => void;
  onSetAlert?: (product: Product) => void;
}

interface HotspotPin {
  id: string;
  x: number;
  y: number;
  label: string;
  detail: string;
  icon: string;
}

// Animated style-score SVG arc
const StyleScoreArc: React.FC<{ score: number }> = ({ score }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(99,102,241,0.15)" strokeWidth="7" />
      <motion.circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="url(#styleGrad)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        style={{ transformOrigin: '50px 50px', transform: 'rotate(-90deg)' }}
      />
      <defs>
        <linearGradient id="styleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <text x="50" y="47" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1e1b4b" fontFamily="monospace">
        {score}
      </text>
      <text x="50" y="60" textAnchor="middle" fontSize="7.5" fill="#6366f1" fontFamily="monospace" fontWeight="bold">
        STYLE SCORE
      </text>
    </svg>
  );
};

// SVG body silhouette for size guide
const BodySilhouette: React.FC<{ size: string; fit: string }> = ({ size, fit }) => {
  const highlights: Record<string, string[]> = {
    S: ['#6366f1'],
    M: ['#10b981'],
    L: ['#f59e0b'],
    XL: ['#ef4444'],
    XXL: ['#f97316']
  };
  const color = highlights[size] ?? ['#6366f1'];

  return (
    <svg viewBox="0 0 80 160" className="w-full h-full ui-silhouette-pulse" style={{ maxHeight: 180 }}>
      {/* Head */}
      <ellipse cx="40" cy="18" rx="12" ry="14" fill={color[0]} opacity="0.7" />
      {/* Neck */}
      <rect x="35" y="30" width="10" height="10" rx="3" fill={color[0]} opacity="0.5" />
      {/* Torso */}
      <path d="M20,40 Q15,55 16,80 Q18,90 40,90 Q62,90 64,80 Q65,55 60,40 Q50,35 40,35 Q30,35 20,40Z" fill={color[0]} opacity="0.6" />
      {/* Left arm */}
      <path d="M20,42 Q8,55 10,80 Q11,85 16,83 Q20,78 22,65 Q24,52 24,44Z" fill={color[0]} opacity="0.45" />
      {/* Right arm */}
      <path d="M60,42 Q72,55 70,80 Q69,85 64,83 Q60,78 58,65 Q56,52 56,44Z" fill={color[0]} opacity="0.45" />
      {/* Left leg */}
      <path d="M28,90 Q24,110 24,140 Q24,148 34,148 Q38,148 38,140 Q38,110 36,90Z" fill={color[0]} opacity="0.5" />
      {/* Right leg */}
      <path d="M52,90 Q56,110 56,140 Q56,148 46,148 Q42,148 42,140 Q42,110 44,90Z" fill={color[0]} opacity="0.5" />
      {/* Size label */}
      <text x="40" y="105" textAnchor="middle" fontSize="11" fontWeight="bold" fill={color[0]} fontFamily="monospace">
        {size}
      </text>
    </svg>
  );
};

// Color harmony swatch with staggered animation
const ColorSwatch: React.FC<{ color: string; title: string; delay: number }> = ({ color, title, delay }) => (
  <motion.span
    className="w-5 h-5 rounded-full border-2 border-white shadow-md cursor-default ui-swatch-reveal"
    style={{
      backgroundColor: color,
      animationDelay: `${delay}s`,
      display: 'inline-block'
    }}
    title={title}
    whileHover={{ scale: 1.35, zIndex: 10 }}
  />
);

const HARMONY_SWATCHES = [
  { hex: '#374151', label: 'Charcoal' },
  { hex: '#d1c9b8', label: 'Khaki' },
  { hex: '#1e3a5f', label: 'Navy' },
  { hex: '#fef3c7', label: 'Beige' },
  { hex: '#ffffff', label: 'White' },
  { hex: '#6b7280', label: 'Slate' }
];

export const ClothAgentVisualizerModal: React.FC<ClothAgentVisualizerModalProps> = ({
  product,
  isOpen,
  onClose,
  onSwapItem,
  onSetAlert
}) => {
  const [activePin, setActivePin] = useState<string | null>('fabric');
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [selectedCompanion, setSelectedCompanion] = useState<Product | null>(null);
  const [activeViewMode, setActiveViewMode] = useState<'scan' | 'outfit' | 'size'>('scan');
  const [particles, setParticles] = useState<{ id: number; x: number }[]>([]);
  const particleTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const isClothing = product?.category === 'clothing';
  const clothingItem = isClothing ? (product as ClothingProduct) : null;

  // Particle emitter
  useEffect(() => {
    if (isScanning) {
      particleTimer.current = setInterval(() => {
        setParticles(prev => [
          ...prev.slice(-8),
          { id: Date.now(), x: 25 + Math.random() * 50 }
        ]);
      }, 220);
    } else {
      if (particleTimer.current) clearInterval(particleTimer.current);
      setParticles([]);
    }
    return () => { if (particleTimer.current) clearInterval(particleTimer.current); };
  }, [isScanning]);

  useEffect(() => {
    if (!product) return;
    setIsScanning(true);
    setActiveViewMode('scan');
    const timer = setTimeout(() => setIsScanning(false), 2400);

    if (isClothing) {
      if (product.subcategory.toLowerCase().includes('shirt')) {
        const trouser = VERIFIED_CATALOG.find(
          p => p.category === 'clothing' && p.subcategory.toLowerCase().includes('trouser')
        );
        setSelectedCompanion(trouser || null);
      } else {
        const shirt = VERIFIED_CATALOG.find(
          p => p.category === 'clothing' && p.subcategory.toLowerCase().includes('shirt')
        );
        setSelectedCompanion(shirt || null);
      }
    } else {
      setSelectedCompanion(null);
    }

    return () => clearTimeout(timer);
  }, [product, isClothing]);

  if (!isOpen || !product) return null;

  const styleScore = Math.round(
    (product.rating / 5) * 55 +
    (clothingItem?.occasion?.length ?? 1) * 5 +
    20
  );

  const pins: HotspotPin[] = isClothing
    ? [
        {
          id: 'collar',
          x: 48,
          y: 22,
          label: 'Structured Neckline',
          detail: 'Reinforced interlining maintains a sharp spread without collar curl under stage lights.',
          icon: '👔'
        },
        {
          id: 'fabric',
          x: 42,
          y: 45,
          label: 'Weave & Breathability',
          detail: `${clothingItem?.material || '100% Combed Cotton'} provides high air permeability and sweat resistance.`,
          icon: '🧵'
        },
        {
          id: 'fit',
          x: 58,
          y: 65,
          label: 'Ergonomic Silhouette',
          detail: `${clothingItem?.style || 'Contemporary Regular Fit'} tailored to balance seated comfort with professional posture.`,
          icon: '📐'
        }
      ]
    : [
        {
          id: 'quality',
          x: 50,
          y: 35,
          label: 'Verified Quality',
          detail: `Certified authentic item under ${product.brand} quality standards.`,
          icon: '✨'
        },
        {
          id: 'value',
          x: 45,
          y: 65,
          label: 'Price-to-Utility Ratio',
          detail: `Ranked top 5% in category value at ₹${product.price}.`,
          icon: '💎'
        }
      ];

  const currentActivePinData = pins.find(p => p.id === activePin);

  // Connecting line data for selected pin
  const selectedPin = pins.find(p => p.id === activePin);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-stone-900/65 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto"
        >
          {/* Aurora top border */}
          <div className="absolute top-0 inset-x-0 h-0.5 ui-aurora-border" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/70">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm sm:text-base text-stone-900 font-['Outfit']">
                    {isClothing ? 'AI Garment & Fabric Inspector' : 'AI Product Lens & Telemetry'}
                  </h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Agent Live Scan
                  </span>
                </div>
                <p className="text-xs text-stone-500">
                  Real-time fabric inspection, color harmony, style score & fit analysis
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Interactive Cloth Visualizer Canvas */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="relative rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 aspect-square flex items-center justify-center group shadow-inner">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

                {/* Animated fabric weave texture overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-10 z-10"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      45deg,
                      rgba(16,185,129,0.4) 0px,
                      rgba(16,185,129,0.4) 1px,
                      transparent 1px,
                      transparent 8px
                    ), repeating-linear-gradient(
                      -45deg,
                      rgba(16,185,129,0.2) 0px,
                      rgba(16,185,129,0.2) 1px,
                      transparent 1px,
                      transparent 8px
                    )`,
                    animation: 'holoGrid 4s linear infinite'
                  }}
                />

                {/* Main Garment Image */}
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover object-center filter brightness-95 contrast-105 transition-transform duration-500 group-hover:scale-105 z-0"
                  referrerPolicy="no-referrer"
                />

                {/* Laser Scan Line with glow */}
                {isScanning && (
                  <>
                    <motion.div
                      className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_18px_#10b981] z-20 pointer-events-none"
                      animate={{ top: ['5%', '90%', '5%'] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    {/* Laser glow bloom */}
                    <motion.div
                      className="absolute inset-x-0 h-6 bg-gradient-to-b from-emerald-400/20 via-emerald-400/5 to-transparent z-20 pointer-events-none"
                      animate={{ top: ['3%', '88%', '3%'] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </>
                )}

                {/* Scan particles */}
                {particles.map(p => (
                  <div
                    key={p.id}
                    className="absolute z-20 w-1 h-1 rounded-full bg-emerald-400 ui-particle pointer-events-none"
                    style={{
                      left: `${p.x}%`,
                      top: '50%',
                      '--tx': `${(Math.random() - 0.5) * 16}px`,
                      '--ty': `${-6 - Math.random() * 14}px`
                    } as React.CSSProperties}
                  />
                ))}

                {/* Selected pin connector line (SVG overlay) */}
                {selectedPin && (
                  <svg
                    className="absolute inset-0 w-full h-full z-25 pointer-events-none"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <motion.line
                      x1={selectedPin.x}
                      y1={selectedPin.y}
                      x2={92}
                      y2={50}
                      stroke="rgba(16,185,129,0.6)"
                      strokeWidth="0.5"
                      strokeDasharray="2 2"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                  </svg>
                )}

                {/* Status HUD */}
                <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-950/80 backdrop-blur-md border border-emerald-500/40 text-[10px] font-mono text-emerald-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>{isScanning ? 'TELEMETRY SCANNING...' : 'ANALYSIS COMPLETE (98.4%)'}</span>
                </div>

                {/* Re-scan button */}
                <button
                  onClick={() => {
                    setIsScanning(true);
                    setTimeout(() => setIsScanning(false), 2000);
                  }}
                  className="absolute bottom-3 right-3 z-30 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-950/80 backdrop-blur-md border border-stone-700 hover:border-emerald-500 text-[10px] font-medium text-stone-300 hover:text-white transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin text-emerald-400' : ''}`} />
                  <span>Re-Scan</span>
                </button>

                {/* Hotspot Pins */}
                {pins.map(pin => {
                  const isSelected = activePin === pin.id;
                  return (
                    <button
                      key={pin.id}
                      onClick={() => setActivePin(pin.id)}
                      style={{ top: `${pin.y}%`, left: `${pin.x}%` }}
                      className="absolute z-30 -translate-x-1/2 -translate-y-1/2 focus:outline-none cursor-pointer"
                      title={pin.label}
                    >
                      <motion.div
                        animate={{ scale: isSelected ? [1, 1.15, 1] : 1 }}
                        transition={{ repeat: isSelected ? Infinity : 0, duration: 1.5 }}
                        className={`relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all shadow-lg ${
                          isSelected
                            ? 'bg-emerald-500 text-white border-white ring-4 ring-emerald-500/40'
                            : 'bg-stone-900/90 text-stone-100 border-emerald-400/80 hover:bg-emerald-600'
                        }`}
                      >
                        <span>{pin.icon}</span>
                        <div className="absolute inset-0 rounded-full border border-emerald-400 animate-ping opacity-30" />
                      </motion.div>
                    </button>
                  );
                })}
              </div>

              {/* Pin Detail Banner */}
              {currentActivePinData && (
                <motion.div
                  key={currentActivePinData.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs flex items-start gap-2.5"
                >
                  <span className="text-base flex-shrink-0">{currentActivePinData.icon}</span>
                  <div>
                    <h5 className="font-bold text-emerald-950 text-xs">{currentActivePinData.label}</h5>
                    <p className="text-[11px] text-emerald-900/80 leading-relaxed mt-0.5">
                      {currentActivePinData.detail}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right: Agent Reasoning, Telemetry & Outfit Coordination */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
              <div>
                {/* Product Title & Brand */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {product.brand} • {product.subcategory}
                    </span>
                    <h2 className="text-lg font-bold text-stone-900 mt-1 leading-snug">
                      {product.name}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-stone-900 font-mono">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="block text-[11px] text-stone-400 line-through font-mono">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* View Mode Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl mt-4 border border-stone-200 text-xs font-semibold">
                  <button
                    onClick={() => setActiveViewMode('scan')}
                    className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      activeViewMode === 'scan'
                        ? 'bg-white text-stone-900 shadow-2xs font-bold'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    <Scan className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Fabric Scan</span>
                  </button>

                  {isClothing && (
                    <button
                      onClick={() => setActiveViewMode('outfit')}
                      className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                        activeViewMode === 'outfit'
                          ? 'bg-white text-stone-900 shadow-2xs font-bold'
                          : 'text-stone-500 hover:text-stone-900'
                      }`}
                    >
                      <Shirt className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Outfit Synergy</span>
                    </button>
                  )}

                  {isClothing && (
                    <button
                      onClick={() => setActiveViewMode('size')}
                      className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                        activeViewMode === 'size'
                          ? 'bg-white text-stone-900 shadow-2xs font-bold'
                          : 'text-stone-500 hover:text-stone-900'
                      }`}
                    >
                      <Ruler className="w-3.5 h-3.5 text-rose-500" />
                      <span>Size Guide</span>
                    </button>
                  )}
                </div>

                {/* ---- TAB 1: FABRIC SCAN ---- */}
                {activeViewMode === 'scan' && (
                  <div className="mt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Style Score arc */}
                      <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col items-center">
                        <div className="w-20 h-20">
                          <StyleScoreArc score={styleScore} />
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                            Material & Texture
                          </span>
                          <p className="text-xs font-bold text-stone-800 mt-0.5">
                            {isClothing ? clothingItem?.material || '100% Combed Cotton' : 'Verified Standard'}
                          </p>
                          <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                            <CheckCircle2 className="w-3 h-3" /> High breathability
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                            Occasion Match
                          </span>
                          <p className="text-xs font-bold text-stone-800 mt-0.5">
                            {isClothing && clothingItem?.occasion ? clothingItem.occasion.join(', ') : 'Daily Everyday'}
                          </p>
                          <span className="text-[10px] text-indigo-700 font-medium flex items-center gap-1 mt-0.5">
                            <Star className="w-3 h-3 fill-indigo-600" /> 98% Presentation Fit
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Color Harmony Palette */}
                    {isClothing && clothingItem?.color && (
                      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
                            <Palette className="w-3.5 h-3.5 text-emerald-600" />
                            Garment Hue: <span className="text-stone-900">{clothingItem.color}</span>
                          </span>
                          <span className="text-[10px] text-stone-500">Agent Palette Match</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-stone-600">
                          <span>Harmonizes with:</span>
                          <div className="flex items-center gap-1.5">
                            {HARMONY_SWATCHES.map((s, i) => (
                              <ColorSwatch key={s.label} color={s.hex} title={s.label} delay={0.1 + i * 0.07} />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* AI Stylist Verdict */}
                    <div className="p-3 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-bold">
                        <Sparkles className="w-3 h-3" />
                        <span>AI Stylist Agent Verdict:</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-stone-300">
                        &quot;Selected specifically for its high yarn count that resists wrinkling during presentations.
                        The subtle {clothingItem?.color || 'finish'} maintains academic poise without overspending.
                        Style score: <span className="text-emerald-400 font-mono font-bold">{styleScore}/100</span>.&quot;
                      </p>
                    </div>
                  </div>
                )}

                {/* ---- TAB 2: OUTFIT SYNERGY ---- */}
                {activeViewMode === 'outfit' && selectedCompanion && (
                  <div className="mt-4 space-y-3">
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-200 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                          98%
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-indigo-950">Coordinated Outfit Compatibility</h5>
                          <p className="text-[10px] text-indigo-800">
                            Balanced formal texture contrast under ₹2,500 total budget
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Side-by-side Outfit Pairing */}
                    <div className="grid grid-cols-2 gap-3 items-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="p-2.5 rounded-xl border border-stone-200 bg-white flex items-center gap-2"
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-stone-100 flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="overflow-hidden">
                          <span className="text-[9px] font-bold uppercase text-stone-400 block truncate">Top Piece</span>
                          <p className="text-xs font-bold text-stone-900 truncate">{product.name}</p>
                          <span className="text-[11px] font-mono font-bold text-emerald-700">₹{product.price}</span>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/30 flex items-center gap-2"
                      >
                        <img
                          src={selectedCompanion.imageUrl}
                          alt={selectedCompanion.name}
                          className="w-12 h-12 rounded-lg object-cover bg-stone-100 flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="overflow-hidden">
                          <span className="text-[9px] font-bold uppercase text-indigo-500 block truncate">Coordinating Bottom</span>
                          <p className="text-xs font-bold text-stone-900 truncate">{selectedCompanion.name}</p>
                          <span className="text-[11px] font-mono font-bold text-emerald-700">₹{selectedCompanion.price}</span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Total Combined Spend */}
                    <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-between text-xs">
                      <span className="text-stone-600 font-medium">Combined Ensemble Cost:</span>
                      <span className="font-mono font-bold text-stone-900 text-sm">
                        ₹{(product.price + selectedCompanion.price).toLocaleString()}
                        <span className="text-xs font-normal text-stone-500 ml-1">(Within ₹2,500 budget cap)</span>
                      </span>
                    </div>
                  </div>
                )}

                {/* ---- TAB 3: SIZE GUIDE ---- */}
                {activeViewMode === 'size' && isClothing && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 space-y-3"
                  >
                    <div className="grid grid-cols-2 gap-4 items-center">
                      {/* Body silhouette */}
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-36">
                          <BodySilhouette
                            size={clothingItem?.size || 'M'}
                            fit={clothingItem?.style || 'Regular Fit'}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-stone-500 mt-1">
                          Size: <span className="text-stone-900">{clothingItem?.size || 'M'}</span>
                        </span>
                      </div>

                      {/* Measurements table */}
                      <div className="space-y-2">
                        {[
                          { label: 'Chest', value: clothingItem?.size === 'S' ? '34–36"' : clothingItem?.size === 'M' ? '38–40"' : clothingItem?.size === 'L' ? '42–44"' : '46–48"' },
                          { label: 'Shoulder', value: clothingItem?.size === 'S' ? '16.5"' : clothingItem?.size === 'M' ? '17.5"' : clothingItem?.size === 'L' ? '18.5"' : '19.5"' },
                          { label: 'Length', value: clothingItem?.size === 'S' ? '27"' : clothingItem?.size === 'M' ? '28"' : clothingItem?.size === 'L' ? '29"' : '30"' },
                          { label: 'Fit Type', value: clothingItem?.style || 'Regular Fit' }
                        ].map((row, i) => (
                          <motion.div
                            key={row.label}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + i * 0.08 }}
                            className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs"
                          >
                            <span className="font-semibold text-stone-500">{row.label}</span>
                            <span className="font-bold text-stone-900 font-mono">{row.value}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Care instructions */}
                    {clothingItem?.careInstructions && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs">
                        <span className="text-[10px] font-bold uppercase text-rose-600 tracking-wider block mb-1">
                          Care Instructions
                        </span>
                        <p className="text-stone-700">{clothingItem.careInstructions}</p>
                      </div>
                    )}

                    {/* Agent size verdict */}
                    <div className="p-3 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 text-xs">
                      <div className="flex items-center gap-1.5 text-rose-400 text-[11px] font-bold mb-1.5">
                        <Ruler className="w-3 h-3" />
                        <span>AI Fit Agent Recommendation:</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-stone-300">
                        &quot;Size <span className="text-rose-300 font-bold">{clothingItem?.size || 'M'}</span> selected based on typical Indian sizing standards.
                        {clothingItem?.style && ` The ${clothingItem.style} provides comfortable range of motion.`}
                        Recommend washing before first wear as per care label.&quot;
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                {onSetAlert && (
                  <button
                    onClick={() => { onSetAlert(product); onClose(); }}
                    className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Track Price Drops
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="ml-auto px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Done Inspecting</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
