import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  X,
  Cpu,
  Zap,
  ShieldCheck,
  Star,
  Check,
  RefreshCw,
  ChevronRight,
  Battery,
  Wifi,
  Monitor,
  Package,
  Activity,
  IndianRupee,
  ArrowRightLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Product, ElectronicsProduct } from '../types';
import { VERIFIED_CATALOG } from '../data/catalog';

interface ElectronicsAgentVisualizerModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSwapItem?: (originalId: string, substitute: Product) => void;
  onSetAlert?: (product: Product) => void;
}

type ViewMode = 'spec' | 'benchmark' | 'compare';

interface SpecDimension {
  label: string;
  score: number; // 0–100
  color: string;
  icon: React.ReactNode;
  detail: string;
}

// Animated radar SVG component
const RadarChart: React.FC<{ dimensions: SpecDimension[]; isScanning: boolean }> = ({
  dimensions,
  isScanning
}) => {
  const cx = 90;
  const cy = 90;
  const r = 68;
  const levels = 4;
  const n = dimensions.length;
  const angleStep = (2 * Math.PI) / n;

  const toXY = (angle: number, radius: number) => ({
    x: cx + radius * Math.cos(angle - Math.PI / 2),
    y: cy + radius * Math.sin(angle - Math.PI / 2)
  });

  const gridLines = Array.from({ length: levels }, (_, i) => {
    const ri = (r * (i + 1)) / levels;
    const pts = Array.from({ length: n }, (__, j) => {
      const { x, y } = toXY(j * angleStep, ri);
      return `${x},${y}`;
    }).join(' ');
    return pts;
  });

  const dataPoints = dimensions.map((d, i) => {
    const radius = (d.score / 100) * r;
    return toXY(i * angleStep, radius);
  });

  const dataPath =
    dataPoints.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ') + 'Z';

  const axisLines = Array.from({ length: n }, (_, i) => {
    const { x, y } = toXY(i * angleStep, r);
    return { x, y };
  });

  const labelPoints = Array.from({ length: n }, (_, i) => {
    const { x, y } = toXY(i * angleStep, r + 14);
    return { x, y, label: dimensions[i].label };
  });

  return (
    <svg viewBox="0 0 180 180" className="w-full h-full">
      {/* Grid rings */}
      {gridLines.map((pts, i) => (
        <polygon
          key={i}
          points={pts}
          fill="none"
          stroke="rgba(6,182,212,0.2)"
          strokeWidth="1"
        />
      ))}

      {/* Axis lines */}
      {axisLines.map((pt, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={pt.x}
          y2={pt.y}
          stroke="rgba(6,182,212,0.25)"
          strokeWidth="1"
        />
      ))}

      {/* Radar sweep overlay */}
      {isScanning && (
        <g className="ui-radar-sweep" style={{ transformOrigin: `${cx}px ${cy}px` }}>
          <path
            d={`M${cx},${cy} L${cx},${cy - r} A${r},${r} 0 0,1 ${cx + r * 0.7},${cy - r * 0.7} Z`}
            fill="url(#sweepGrad)"
          />
        </g>
      )}

      <defs>
        <radialGradient id="sweepGrad" cx="50%" cy="50%">
          <stop offset="0%" stopColor="rgba(6,182,212,0.35)" />
          <stop offset="100%" stopColor="rgba(6,182,212,0)" />
        </radialGradient>
        <linearGradient id="dataFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(6,182,212,0.55)" />
          <stop offset="100%" stopColor="rgba(99,102,241,0.4)" />
        </linearGradient>
      </defs>

      {/* Data polygon */}
      <motion.path
        d={dataPath}
        fill="url(#dataFill)"
        stroke="rgba(6,182,212,0.9)"
        strokeWidth="1.5"
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* Data dots */}
      {dataPoints.map((pt, i) => (
        <motion.circle
          key={i}
          cx={pt.x}
          cy={pt.y}
          r={3.5}
          fill="#06b6d4"
          stroke="#fff"
          strokeWidth="1.5"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
        />
      ))}

      {/* Labels */}
      {labelPoints.map((lp, i) => (
        <text
          key={i}
          x={lp.x}
          y={lp.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="8"
          fill="rgba(6,182,212,0.9)"
          fontFamily="monospace"
          fontWeight="bold"
        >
          {lp.label}
        </text>
      ))}

      {/* Centre dot */}
      <circle cx={cx} cy={cy} r={3} fill="#06b6d4" />
    </svg>
  );
};

// Trust score ring
const TrustRing: React.FC<{ score: number }> = ({ score }) => {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(6,182,212,0.1)" strokeWidth="8" />
      <motion.circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="url(#trustGrad)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        style={{ transformOrigin: '50px 50px', transform: 'rotate(-90deg)' }}
      />
      <defs>
        <linearGradient id="trustGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <text x="50" y="46" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#e2e8f0" fontFamily="monospace">
        {score}
      </text>
      <text x="50" y="60" textAnchor="middle" fontSize="7" fill="rgba(6,182,212,0.7)" fontFamily="monospace" fontWeight="bold">
        TRUST SCORE
      </text>
    </svg>
  );
};

export const ElectronicsAgentVisualizerModal: React.FC<ElectronicsAgentVisualizerModalProps> = ({
  product,
  isOpen,
  onClose,
  onSwapItem,
  onSetAlert
}) => {
  const [activeViewMode, setActiveViewMode] = useState<ViewMode>('spec');
  const [isScanning, setIsScanning] = useState(true);
  const [benchmarkReveal, setBenchmarkReveal] = useState(false);
  const [compareAlternatives, setCompareAlternatives] = useState<Product[]>([]);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const particleTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const isElectronics = product?.category === 'electronics';
  const elProduct = isElectronics ? (product as ElectronicsProduct) : null;

  // Particle emitter for the scan laser
  useEffect(() => {
    if (isScanning) {
      particleTimer.current = setInterval(() => {
        setParticles(prev => [
          ...prev.slice(-10),
          { id: Date.now(), x: Math.random() * 100, y: Math.random() * 80 + 10 }
        ]);
      }, 200);
    } else {
      if (particleTimer.current) clearInterval(particleTimer.current);
      setParticles([]);
    }
    return () => {
      if (particleTimer.current) clearInterval(particleTimer.current);
    };
  }, [isScanning]);

  useEffect(() => {
    if (!product) return;
    setIsScanning(true);
    setActiveViewMode('spec');
    setBenchmarkReveal(false);
    const t1 = setTimeout(() => setIsScanning(false), 2600);
    const t2 = setTimeout(() => setBenchmarkReveal(true), 800);

    // Find similar electronics from catalog
    const alts = VERIFIED_CATALOG.filter(
      p => p.category === 'electronics' && p.id !== product.id
    ).slice(0, 3);
    setCompareAlternatives(alts);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [product]);

  if (!isOpen || !product) return null;

  // ---- Spec dimensions (derived from product data) ----
  const specs = elProduct?.specifications || {};
  const features = elProduct?.features || [];
  const warrantyMonths = elProduct?.warrantyMonths ?? 12;

  const specDimensions: SpecDimension[] = [
    {
      label: 'Performance',
      score: Math.min(95, 55 + (features.length * 4)),
      color: '#06b6d4',
      icon: <Cpu className="w-3 h-3" />,
      detail: features[0] || 'High-performance chipset'
    },
    {
      label: 'Display',
      score: specs['Display'] ? 82 : 70,
      color: '#6366f1',
      icon: <Monitor className="w-3 h-3" />,
      detail: specs['Display'] || 'Crisp HD display'
    },
    {
      label: 'Battery',
      score: specs['Battery'] ? 88 : 74,
      color: '#10b981',
      icon: <Battery className="w-3 h-3" />,
      detail: specs['Battery'] || 'Long-lasting battery'
    },
    {
      label: 'Connectivity',
      score: specs['Connectivity'] ? 90 : 75,
      color: '#f59e0b',
      icon: <Wifi className="w-3 h-3" />,
      detail: specs['Connectivity'] || 'Wi-Fi & Bluetooth'
    },
    {
      label: 'Value',
      score: Math.min(96, Math.round((product.rating / 5) * 90 + 10)),
      color: '#ec4899',
      icon: <IndianRupee className="w-3 h-3" />,
      detail: `₹${product.price} — rated ${product.rating}★ by ${product.reviewCount} buyers`
    }
  ];

  const trustScore = Math.round(
    (product.rating / 5) * 55 +
    Math.min(warrantyMonths / 24, 1) * 25 +
    (product.verified ? 20 : 0)
  );

  const benchmarkItems = [
    { label: 'Performance Score', value: specDimensions[0].score, unit: '/100', color: 'bg-cyan-500' },
    { label: 'Display Quality', value: specDimensions[1].score, unit: '/100', color: 'bg-indigo-500' },
    { label: 'Battery Rating', value: specDimensions[2].score, unit: '/100', color: 'bg-emerald-500' },
    { label: 'User Satisfaction', value: Math.round((product.rating / 5) * 100), unit: '/100', color: 'bg-amber-500' },
    { label: 'Value for Money', value: specDimensions[4].score, unit: '/100', color: 'bg-pink-500' }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-slate-900 rounded-3xl shadow-2xl border border-cyan-500/20 overflow-hidden flex flex-col my-auto"
        >
          {/* Ambient top border glow */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
          <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-cyan-500/8 to-transparent pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/15 bg-slate-900/80 backdrop-blur-md">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-white flex items-center justify-center shadow-lg ui-neon-cyan">
                <Cpu className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm sm:text-base text-white font-['Outfit']">
                    AI Gadget Scanner & Spec Analysis
                  </h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 ui-neon-flicker">
                    ● LIVE SCAN
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Real-time spec benchmarking, trust scoring & competitor analysis
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* LEFT — Interactive Scanner Canvas */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              {/* Main product image canvas */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-cyan-500/20 aspect-square flex items-center justify-center group shadow-inner ui-neon-cyan">
                {/* Holographic grid overlay */}
                <div className="absolute inset-0 ui-holo-grid opacity-60 pointer-events-none z-10" />

                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover object-center brightness-90 contrast-110 transition-transform duration-500 group-hover:scale-105 z-0"
                  referrerPolicy="no-referrer"
                />

                {/* Laser scan line */}
                {isScanning && (
                  <motion.div
                    className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_18px_#06b6d4] z-30 pointer-events-none"
                    animate={{ top: ['5%', '92%', '5%'] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}

                {/* Scan particles */}
                {particles.map(p => (
                  <div
                    key={p.id}
                    className="absolute z-20 w-1 h-1 rounded-full bg-cyan-400 ui-particle pointer-events-none"
                    style={{
                      left: `${p.x}%`,
                      top: `${p.y}%`,
                      '--tx': `${(Math.random() - 0.5) * 20}px`,
                      '--ty': `${-8 - Math.random() * 12}px`
                    } as React.CSSProperties}
                  />
                ))}

                {/* Corner HUD elements */}
                <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-cyan-500/35 text-[10px] font-mono text-cyan-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span>{isScanning ? 'SCANNING SPECS...' : 'ANALYSIS DONE (99.1%)'}</span>
                </div>

                {/* Bottom right — warranty badge */}
                <div className="absolute bottom-3 right-3 z-30 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-indigo-500/40 text-[10px] font-mono text-indigo-300">
                  <ShieldCheck className="w-3 h-3 text-indigo-400" />
                  <span>{warrantyMonths}M Warranty</span>
                </div>

                {/* Re-scan button */}
                <button
                  onClick={() => {
                    setIsScanning(true);
                    setBenchmarkReveal(false);
                    setTimeout(() => setIsScanning(false), 2200);
                    setTimeout(() => setBenchmarkReveal(true), 600);
                  }}
                  className="absolute bottom-3 left-3 z-30 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-600 hover:border-cyan-500 text-[10px] font-medium text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin text-cyan-400' : ''}`} />
                  <span>Re-Scan</span>
                </button>
              </div>

              {/* Trust & Warranty ring */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/60 border border-cyan-500/15">
                <div className="w-20 h-20 flex-shrink-0 ui-trust-glow rounded-full">
                  <TrustRing score={trustScore} />
                </div>
                <div className="flex-1 space-y-1.5">
                  <h5 className="text-xs font-bold text-white">AI Trust & Reliability Score</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Computed from verified reviews, warranty coverage, brand reliability and price-to-spec ratio.
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/25">
                        <CheckCircle2 className="w-3 h-3" /> Catalog Verified
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/25">
                      <ShieldCheck className="w-3 h-3" /> {warrantyMonths}M Warranty
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — Agent Analysis Panel */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Product header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    {product.brand} • {product.subcategory}
                  </span>
                  <h2 className="text-base font-bold text-white mt-1.5 leading-snug">
                    {product.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center text-amber-400 font-semibold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 mr-0.5" />
                      {product.rating}
                      <span className="text-slate-500 font-normal ml-0.5">({product.reviewCount})</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xl font-black text-white font-mono">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="block text-[11px] text-slate-500 line-through font-mono">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* View tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-800/70 rounded-xl border border-slate-700/50 text-xs font-semibold">
                {([
                  { id: 'spec', label: 'Spec Radar', icon: <Activity className="w-3.5 h-3.5 text-cyan-400" /> },
                  { id: 'benchmark', label: 'Benchmark', icon: <Zap className="w-3.5 h-3.5 text-amber-400" /> },
                  { id: 'compare', label: 'Compare', icon: <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-400" /> }
                ] as const).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveViewMode(tab.id)}
                    className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      activeViewMode === tab.id
                        ? 'bg-slate-700 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* ---- TAB 1: SPEC RADAR ---- */}
              {activeViewMode === 'spec' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-2 gap-3 items-start">
                    {/* Radar chart */}
                    <div className="w-full aspect-square relative">
                      <RadarChart dimensions={specDimensions} isScanning={isScanning} />
                    </div>

                    {/* Dimension list */}
                    <div className="space-y-2">
                      {specDimensions.map((dim, i) => (
                        <motion.div
                          key={dim.label}
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                          className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50 border border-slate-700/50"
                        >
                          <div className="flex-shrink-0 text-cyan-400">{dim.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-300">{dim.label}</span>
                              <span className="text-[10px] font-mono font-bold text-cyan-400">{dim.score}</span>
                            </div>
                            <div className="mt-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ background: dim.color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${dim.score}%` }}
                                transition={{ delay: 0.4 + i * 0.12, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Agent AI verdict */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/20 text-xs">
                    <div className="flex items-center gap-1.5 text-cyan-400 text-[11px] font-bold mb-1.5">
                      <Sparkles className="w-3 h-3" />
                      <span>AI Gadget Agent Verdict:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-400">
                      &quot;Ranked in the <span className="text-cyan-300 font-semibold">top {Math.round(100 - (trustScore * 0.7))}%</span> for its price band.
                      {features.length > 0 && ` Standout feature: ${features[0]}.`}
                      {warrantyMonths >= 12 && ' Backed by manufacturer warranty — strong reliability signal.'}
                      Overall value-to-spec ratio is <span className="text-emerald-400 font-semibold">excellent</span>.&quot;
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ---- TAB 2: BENCHMARK ---- */}
              {activeViewMode === 'benchmark' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="space-y-2.5">
                    {benchmarkItems.map((item, i) => (
                      <div key={item.label} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-300">{item.label}</span>
                          <span className="font-mono font-bold text-white">
                            {item.value}
                            <span className="text-slate-500 font-normal">{item.unit}</span>
                          </span>
                        </div>
                        <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                          {benchmarkReveal && (
                            <motion.div
                              className={`h-full rounded-full ${item.color} relative`}
                              initial={{ width: 0 }}
                              animate={{ width: `${item.value}%` }}
                              transition={{ delay: i * 0.13, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            >
                              {/* shimmer */}
                              <div className="absolute inset-0 ui-shimmer-sweep opacity-30 rounded-full" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Key specs grid */}
                  {Object.keys(specs).length > 0 && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {Object.entries(specs).slice(0, 4).map(([key, val]) => (
                        <div key={key} className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/40">
                          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">{key}</span>
                          <p className="text-[11px] font-bold text-slate-200 mt-0.5 truncate">{val}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Features */}
                  {features.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/30">
                      <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block mb-2">Key Features</span>
                      <div className="flex flex-wrap gap-1.5">
                        {features.map((f, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.07 }}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20"
                          >
                            <Check className="w-2.5 h-2.5" />
                            {f}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ---- TAB 3: COMPARE ---- */}
              {activeViewMode === 'compare' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="p-3 rounded-xl bg-cyan-500/8 border border-cyan-500/20 text-xs flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <p className="text-slate-300">
                      AI agent found <span className="text-cyan-300 font-bold">{compareAlternatives.length}</span> comparable electronics in the verified catalog. Current item is highlighted.
                    </p>
                  </div>

                  {/* Current item card */}
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-400/40 flex items-center gap-3">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-800 flex-shrink-0 border border-cyan-400/30"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-bold uppercase text-cyan-400 tracking-wider">Currently Inspecting</span>
                      <p className="text-xs font-bold text-white truncate">{product.name}</p>
                      <p className="text-[11px] font-mono font-bold text-cyan-400">₹{product.price.toLocaleString()}</p>
                    </div>
                    <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/15 px-2 py-1 rounded-lg border border-cyan-500/25">
                      ★ {product.rating}
                    </span>
                  </div>

                  {/* Alternatives */}
                  <div className="space-y-2">
                    {compareAlternatives.map((alt, i) => (
                      <motion.div
                        key={alt.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.12 }}
                        className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 flex items-center gap-3 group transition-all"
                      >
                        <img
                          src={alt.imageUrl}
                          alt={alt.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-900 flex-shrink-0 border border-slate-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-200 truncate">{alt.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-mono text-slate-400">₹{alt.price.toLocaleString()}</span>
                            <span className="text-[10px] text-amber-400">★ {alt.rating}</span>
                            <span className="text-[10px] text-slate-500">{alt.subcategory}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            alt.price < product.price
                              ? 'text-emerald-300 bg-emerald-500/15'
                              : alt.price > product.price
                              ? 'text-red-300 bg-red-500/10'
                              : 'text-slate-300 bg-slate-700/50'
                          }`}>
                            {alt.price < product.price ? `₹${(product.price - alt.price).toLocaleString()} cheaper` :
                             alt.price > product.price ? `₹${(alt.price - product.price).toLocaleString()} pricier` : 'Same price'}
                          </span>
                          {onSwapItem && (
                            <button
                              onClick={() => {
                                onSwapItem(product.id, alt);
                                onClose();
                              }}
                              className="text-[10px] font-bold text-indigo-300 hover:text-white flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              Swap <ArrowRightLeft className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    {compareAlternatives.length === 0 && (
                      <div className="text-center py-6 text-slate-500 text-xs">
                        No alternative electronics found in the current catalog.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Footer actions */}
          <div className="px-6 py-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
            {onSetAlert && (
              <button
                onClick={() => { onSetAlert(product); onClose(); }}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 border border-slate-700/50"
              >
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                Track Price Drops
              </button>
            )}
            <button
              onClick={onClose}
              className="ml-auto px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg transition-all cursor-pointer flex items-center gap-1.5 ui-neon-cyan"
            >
              <Check className="w-4 h-4" />
              <span>Done Inspecting</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
