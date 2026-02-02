import React from 'react';
import { WalletHistoryItem } from '../types';
import { Img } from 'remotion';

interface BallProps {
  item: WalletHistoryItem;
  x: number;
  y: number;
  size: number;
  scale: number;
}

export const Ball: React.FC<BallProps> = ({ item, x, y, size, scale }) => {
  const roi = parseFloat(item.roi);
  const isPositive = roi >= 0;

  // Determine border color based on ROI
  const borderColor = isPositive ? '#4ade80' : '#f87171'; // green-400 : red-400

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        transform: `scale(${scale}) translate(-50%, -50%)`,
        borderRadius: '50%',
        border: `4px solid ${borderColor}`,
        backgroundColor: '#1e293b', // Fallback color
        boxShadow: `0 0 15px ${isPositive ? 'rgba(74, 222, 128, 0.5)' : 'rgba(248, 113, 113, 0.5)'}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden', // Ensures the image stays within the circle
        zIndex: Math.floor(size),
      }}
    >
      {/* Full Skin Image - aurapnl.io style */}
      {item.icon ? (
        <Img
          src={`https://corsproxy.io/?${encodeURIComponent(item.icon)}`}
          crossOrigin="anonymous"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
        />
      ) : null}

      {/* Dark overlay to ensure text readability over the image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        }}
      />

      {/* Text Info */}
      <div className="relative z-10 text-center flex flex-col items-center justify-center pointer-events-none">
        <span
          style={{
            fontSize: `${Math.max(12, size * 0.18)}px`,
            fontWeight: '800',
            color: '#fff',
            textShadow: '0 2px 4px rgba(0,0,0,0.9), 0 0 2px #000',
            lineHeight: 1,
            marginBottom: '2px',
            fontFamily: 'sans-serif'
          }}
        >
          {item.symbol}
        </span>
        <span
          style={{
            fontSize: `${Math.max(10, size * 0.14)}px`,
            color: isPositive ? '#86efac' : '#fca5a5',
            fontWeight: '700',
            textShadow: '0 2px 4px rgba(0,0,0,0.9), 0 0 2px #000'
          }}
        >
          {roi.toFixed(0)}%
        </span>
      </div>
    </div>
  );
};
