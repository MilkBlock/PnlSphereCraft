
import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface BlobProps {
  address: string;
  pnl: number;
  color: string;
  x: number;
  y: number;
  isMain?: boolean;
}

export const Blob: React.FC<BlobProps> = ({ address, pnl, color, x, y, isMain }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dynamic sizing based on PnL
  const baseSize = isMain ? 110 : 70;
  const growthScale = isMain ? 3500 : 8000;
  const sizeFactor = Math.max(0.6, 1 + pnl / growthScale);
  const size = baseSize * sizeFactor;

  // Breathing effect + Eat pop effect
  const pulse = Math.sin(frame / 6) * (isMain ? 10 : 4);
  
  const entrance = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 100 },
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: x - (size + pulse) / 2,
        top: y - (size + pulse) / 2,
        width: size + pulse,
        height: size + pulse,
        borderRadius: '50%',
        backgroundColor: color,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isMain 
          ? `0 0 80px ${color}88, inset 0 0 40px rgba(255,255,255,0.4)`
          : `0 0 30px ${color}44`,
        border: isMain ? '8px solid rgba(255,255,255,0.9)' : '3px solid rgba(255,255,255,0.6)',
        transform: `scale(${entrance})`,
        zIndex: isMain ? 50 : 10,
        transition: 'width 0.1s ease-out, height 0.1s ease-out',
      }}
      className="text-white font-bold text-center overflow-hidden"
    >
      <div className={`opacity-80 font-mono tracking-tighter drop-shadow-md uppercase ${size > 200 ? 'text-sm' : 'text-[10px]'}`}>
        {address}
      </div>
      <div className={`font-black drop-shadow-2xl leading-none ${size > 250 ? 'text-5xl' : size > 150 ? 'text-3xl' : 'text-xl'}`}>
        ${Math.floor(pnl).toLocaleString()}
      </div>
      
      {isMain && size > 180 && (
        <div className="mt-2 px-4 py-1 bg-white text-blue-600 text-[12px] font-black rounded-full shadow-lg animate-bounce uppercase italic">
          Whale Alert
        </div>
      )}

      {/* Hero-specific glow and rings */}
      {isMain && (
        <>
          <div className="absolute inset-0 rounded-full border-[15px] border-white/5 animate-ping" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
        </>
      )}
    </div>
  );
};
