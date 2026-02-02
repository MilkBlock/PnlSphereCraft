import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, Img } from 'remotion';
import { WalletHistoryItem } from '../types';
import { Ball } from './Ball';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { translations, Language } from '../utils/i18n';

interface AurapnlIoCompositionProps {
  data: WalletHistoryItem[];
  xHandle?: string;
  showWallet?: boolean;
  walletAddress?: string;
  language?: Language;
}

// Pseudo-random number generator
const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export const AurapnlIoComposition: React.FC<AurapnlIoCompositionProps> = ({ data, xHandle, showWallet, walletAddress, language = 'en' }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const t = translations[language];

  // --- Animation Timing Configuration (Total 300 frames / 10s) ---
  const DRIFT_DURATION = 60; // 2 seconds of chaos
  const AGGREGATE_DURATION = 75; // 2.5 seconds to form the ball
  const ZOOM_DURATION = 45; // 1.5 seconds to pan/zoom

  const startAggregation = DRIFT_DURATION;
  const startZoom = startAggregation + AGGREGATE_DURATION;
  const showStatsFrame = startZoom + 15;

  // --- Data Processing & Layout Calculation ---
  const { balls, stats } = useMemo(() => {
    // 1. Calculate Stats
    let totalPnl = 0;
    let totalVolume = 0;
    let winCount = 0;
    let maxRoi = -Infinity;
    let bestToken = '';

    data.forEach(item => {
      const pnl = parseFloat(item.usd_pnl);
      const vol = parseFloat(item.bamt) + parseFloat(item.samt);
      const roi = parseFloat(item.roi);

      totalPnl += pnl;
      totalVolume += vol;
      if (roi > 0) winCount++;
      if (roi > maxRoi) {
        maxRoi = roi;
        bestToken = item.symbol;
      }
    });

    const winRate = data.length > 0 ? (winCount / data.length) * 100 : 0;

    // 2. Prepare Ball Objects with Layouts
    // Sort by size (proxy: absolute PnL) descending for the spiral core
    const sortedData = [...data].sort((a, b) => {
      const valA = Math.abs(parseFloat(a.usd_pnl));
      const valB = Math.abs(parseFloat(b.usd_pnl));
      return valB - valA;
    });

    const processedBalls = sortedData.map((item, i) => {
      // --- Size Calculation ---
      const value = Math.abs(parseFloat(item.usd_pnl)) + 10;
      const baseSize = Math.log(value) * 25;
      const size = Math.max(60, Math.min(baseSize, 180));

      // --- Layout 1: Random Drift (Chaos) ---
      // Random start position
      const r1 = seededRandom(i * 123);
      const r2 = seededRandom(i * 456);
      const initialX = r1 * width;
      const initialY = r2 * height;

      // Random velocity
      const speedX = (seededRandom(i * 789) - 0.5) * 3;
      const speedY = (seededRandom(i * 999) - 0.5) * 3;

      // --- Layout 2: Spiral Cluster (Order) ---
      // Phyllotaxis spiral packing
      // Angle in radians (Golden Angle approx 2.4)
      const angle = i * 2.4;
      // Radius grows with index. 
      // We adjust the spacing factor (45) based on average ball size to prevent too much overlap
      const radius = 45 * Math.sqrt(i);

      const clusterX = (width / 2) + (radius * Math.cos(angle));
      const clusterY = (height / 2) + (radius * Math.sin(angle));

      return {
        item,
        size,
        initialX,
        initialY,
        speedX,
        speedY,
        clusterX,
        clusterY,
        phase: r1 * Math.PI * 2, // For floating effect
      };
    });

    return {
      balls: processedBalls,
      stats: {
        totalPnl,
        totalVolume,
        winRate,
        bestToken,
        maxRoi,
        count: data.length
      }
    };
  }, [data, width, height]);

  // --- Camera / Container Transform ---
  // 1. Aggregation Interpolation (0 to 1)
  const aggregationProgress = interpolate(
    frame,
    [startAggregation, startAggregation + AGGREGATE_DURATION],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.25, 0.1, 0.25, 1) }
  );

  // 2. Zoom/Pan Interpolation
  // Move center from 50% to 30% (Left 3/5 center)
  // Scale up slightly to fill the space
  const panProgress = interpolate(
    frame,
    [startZoom, startZoom + ZOOM_DURATION],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.ease) }
  );

  const containerScale = 1 + (panProgress * 0.3); // Zoom in 30%
  const containerX = -panProgress * (width * 0.2); // Shift left by 20% of width

  // --- Stats Panel Animation ---
  const statsOpacity = interpolate(
    frame,
    [showStatsFrame, showStatsFrame + 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const statsSlide = interpolate(
    frame,
    [showStatsFrame, showStatsFrame + 20],
    [50, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.ease) }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#020617', overflow: 'hidden' }}>
      {/* Background Grid - Moves with camera slightly for parallax */}
      <div
        style={{
          position: 'absolute',
          inset: -100,
          backgroundImage: `
            radial-gradient(circle at 50% 50%, #1e293b 1px, transparent 1px)
          `,
          backgroundSize: `40px 40px`,
          opacity: 0.2,
          transform: `translateX(${containerX * 0.5}px) scale(${containerScale})`,
        }}
      />

      {/* Balls Container */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: `translateX(${containerX}px) scale(${containerScale})`,
          transformOrigin: 'center center',
        }}
      >
        {balls.map((ball, i) => {
          // 1. Calculate Drift Position
          // Wrap logic for drift phase
          let driftX = ball.initialX + (ball.speedX * frame);
          let driftY = ball.initialY + (ball.speedY * frame);

          // Floating effect
          const floatX = Math.sin((frame / fps) + ball.phase) * 10;
          const floatY = Math.cos((frame / fps) + ball.phase) * 10;

          // Wrap around screen during drift
          const buffer = ball.size;
          driftX = ((driftX % (width + buffer * 2)) + (width + buffer * 2)) % (width + buffer * 2) - buffer;
          driftY = ((driftY % (height + buffer * 2)) + (height + buffer * 2)) % (height + buffer * 2) - buffer;

          // 2. Interpolate to Cluster Position
          const currentX = interpolate(aggregationProgress, [0, 1], [driftX, ball.clusterX]) + floatX;
          const currentY = interpolate(aggregationProgress, [0, 1], [driftY, ball.clusterY]) + floatY;

          // Entrance Scale
          const entranceScale = interpolate(
            frame - (i * 1.5),
            [0, 20],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.elastic(1) }
          );

          return (
            <Ball
              key={`${ball.item.symbol}-${i}`}
              item={ball.item}
              x={currentX}
              y={currentY}
              size={ball.size}
              scale={entranceScale}
            />
          );
        })}
      </div>

      {/* Stats Panel - Right Side */}
      <div
        style={{
          position: 'absolute',
          right: '5%',
          top: '5%', // Adjusted top to fit larger avatar
          bottom: '5%',
          width: '35%',
          opacity: statsOpacity,
          transform: `translateX(${statsSlide}px)`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '20px',
          zIndex: 100,
        }}
      >
        {/* User Avatar Section */}
        {xHandle && (
          <div className="flex flex-col items-center mb-4 animate-fade-in">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full blur opacity-75"></div>
              <Img
                src={`https://corsproxy.io/?${encodeURIComponent(`https://unavatar.io/twitter/${xHandle}`)}`}
                crossOrigin="anonymous"
                className="relative w-32 h-32 rounded-full border-4 border-slate-900 shadow-2xl object-cover bg-slate-800"
                onError={(e: any) => {
                  // Fallback if image fails
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <span className="mt-4 text-2xl font-bold text-white drop-shadow-lg">@{xHandle}</span>
          </div>
        )}

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-6">
            {t.analysisTitle}
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {/* Total PnL */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3 text-slate-400">
                <DollarSign className="w-6 h-6 text-emerald-400" />
                <span className="text-lg">{t.totalPnl}</span>
              </div>
              <span className={`text-2xl font-mono font-bold ${stats.totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {stats.totalPnl >= 0 ? '+' : ''}{stats.totalPnl.toFixed(2)} USD
              </span>
            </div>

            {/* Win Rate */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3 text-slate-400">
                <Activity className="w-6 h-6 text-blue-400" />
                <span className="text-lg">{t.winRate}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-2xl font-mono font-bold text-white">
                  {stats.winRate.toFixed(1)}%
                </span>
                <span className="text-xs text-slate-500">{stats.count} {t.tokens}</span>
              </div>
            </div>

            {/* Best Performer */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3 text-slate-400">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                <span className="text-lg">{t.bestGem}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-2xl font-bold text-white uppercase">
                  {stats.bestToken || 'N/A'}
                </span>
                <span className="text-sm text-emerald-400 font-mono">
                  +{stats.maxRoi.toFixed(0)}% ROI
                </span>
              </div>
            </div>

            {/* Total Volume */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-400">
                <TrendingDown className="w-6 h-6 text-orange-400" />
                <span className="text-lg">{t.volume}</span>
              </div>
              <span className="text-2xl font-mono font-bold text-white">
                ${(stats.totalVolume / 1000).toFixed(1)}k
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Address Overlay */}
      {showWallet && walletAddress && (
        <div
          style={{
            position: 'absolute',
            bottom: '3%',
            left: '3%',
            fontFamily: 'monospace',
            fontSize: '1.5rem',
            fontWeight: 600,
            color: 'rgba(148, 163, 184, 0.5)', // slate-400 with opacity
            zIndex: 50,
            pointerEvents: 'none',
          }}
        >
          {walletAddress}
        </div>
      )}
    </AbsoluteFill>
  );
};
