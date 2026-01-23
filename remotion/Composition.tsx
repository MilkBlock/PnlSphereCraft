
import React, { useMemo } from 'react';
import { useCurrentFrame, AbsoluteFill, interpolate, spring, useVideoConfig } from 'remotion';
import { Wallet, ProfitDot } from '../types';
import { WALLET_DATA, COLORS, VIDEO_WIDTH, VIDEO_HEIGHT } from '../constants';
import { Blob } from '../components/Blob';
import { Background } from '../components/Background';
import { getWalletPosition, getDotPosition, getDistance, normalize } from '../utils/physics';

const FloatingReward: React.FC<{ x: number; y: number; value: number; startFrame: number }> = ({ x, y, value, startFrame }) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0 || relativeFrame > 20) return null;

  const opacity = interpolate(relativeFrame, [0, 15, 20], [1, 1, 0]);
  const translateY = interpolate(relativeFrame, [0, 20], [0, -40]);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + translateY,
        opacity,
        color: '#4ade80',
        fontWeight: 'bold',
        fontSize: '18px',
        textShadow: '0 0 10px rgba(0,0,0,0.5)',
        zIndex: 100,
        pointerEvents: 'none'
      }}
    >
      +${Math.floor(value)}
    </div>
  );
};

export const WalletBattleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const initialData = useMemo(() => {
    const wallets: Wallet[] = WALLET_DATA.map((addr, i) => ({
      id: `w-${i}`,
      address: addr,
      initialPnL: i === 0 ? 50 : 1500 + i * 800,
      color: COLORS[i % COLORS.length],
      initialPos: {
        x: i === 0 ? 100 : (i * 300 + 400) % VIDEO_WIDTH,
        y: i === 0 ? 100 : (i * 200 + 200) % VIDEO_HEIGHT
      },
      velocity: {
        x: (Math.random() - 0.5) * 3,
        y: (Math.random() - 0.5) * 3
      }
    }));

    const dots: ProfitDot[] = Array.from({ length: 80 }).map((_, i) => ({
      id: `${i}`,
      value: 100 + Math.random() * 400,
      pos: {
        x: Math.random() * VIDEO_WIDTH,
        y: Math.random() * VIDEO_HEIGHT
      },
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    }));

    return { wallets, dots };
  }, []);

  const simulation = useMemo(() => {
    const history: Array<{ 
      wallets: any[], 
      dots: {id: string, pos: {x: number, y: number}, color: string}[],
      rewards: Array<{id: string, x: number, y: number, value: number, frame: number}> 
    }> = [];
    
    let heroPos = { ...initialData.wallets[0].initialPos };
    let heroPnL = initialData.wallets[0].initialPnL;
    let eatenDotIds = new Set<string>();
    let rewards: any[] = [];
    let currentVelocity = { x: 5, y: 5 };

    for (let f = 0; f <= 300; f++) {
      const heroSize = (100 * (1 + heroPnL / 4000)) / 2;
      
      // Speed inversely proportional to size (min 3, max 12)
      const baseSpeed = Math.max(3, 12 - (heroPnL / 1500));
      
      const visibleDots = initialData.dots
        .filter(d => !eatenDotIds.has(d.id))
        .map(d => ({ ...d, currentPos: getDotPosition(d, f) }));

      if (visibleDots.length > 0) {
        // Find nearest target
        let nearest = visibleDots[0];
        let minDist = Infinity;
        visibleDots.forEach(dot => {
          const dist = getDistance(heroPos, dot.currentPos);
          if (dist < minDist) {
            minDist = dist;
            nearest = dot;
          }
        });

        // Calculate direction to target
        const dir = normalize({
          x: nearest.currentPos.x - heroPos.x,
          y: nearest.currentPos.y - heroPos.y
        });

        // Smooth steering
        currentVelocity.x += (dir.x * baseSpeed - currentVelocity.x) * 0.15;
        currentVelocity.y += (dir.y * baseSpeed - currentVelocity.y) * 0.15;

        heroPos.x += currentVelocity.x;
        heroPos.y += currentVelocity.y;

        // Collision Check
        if (minDist < heroSize + 10) {
          eatenDotIds.add(nearest.id);
          heroPnL += nearest.value;
          rewards.push({
            id: `r-${nearest.id}`,
            x: nearest.currentPos.x,
            y: nearest.currentPos.y,
            value: nearest.value,
            frame: f
          });
        }

        // Magnetic Effect: Move nearby dots towards hero
        visibleDots.forEach(dot => {
          const dist = getDistance(heroPos, dot.currentPos);
          if (dist < heroSize + 100 && dist > heroSize) {
            const pull = normalize({ x: heroPos.x - dot.currentPos.x, y: heroPos.y - dot.currentPos.y });
            dot.currentPos.x += pull.x * 4;
            dot.currentPos.y += pull.y * 4;
          }
        });
      }

      history.push({
        wallets: initialData.wallets.map((w, i) => {
          if (i === 0) return { ...w, pos: { ...heroPos }, pnl: heroPnL };
          return { ...w, pos: getWalletPosition(w, f), pnl: w.initialPnL };
        }),
        dots: visibleDots.map(d => ({ id: d.id, pos: d.currentPos, color: d.color })),
        rewards: [...rewards]
      });
    }
    return history;
  }, [initialData]);

  const state = simulation[frame] || simulation[simulation.length - 1];

  return (
    <AbsoluteFill className="bg-black">
      <Background />
      
      {/* Profit Dots */}
      {state.dots.map(dot => (
        <div
          key={dot.id}
          style={{
            position: 'absolute',
            left: dot.pos.x,
            top: dot.pos.y,
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: dot.color,
            boxShadow: `0 0 15px ${dot.color}`,
            border: '2px solid rgba(255,255,255,0.4)',
            transform: `scale(${interpolate(frame % 15, [0, 7, 15], [1, 1.3, 1])})`
          }}
        />
      ))}

      {/* Eating Rewards */}
      {state.rewards.map(r => (
        <FloatingReward key={r.id} {...r} startFrame={r.frame} />
      ))}

      {/* Wallets */}
      {state.wallets.map((wallet, i) => (
        <Blob
          key={wallet.id}
          address={wallet.address}
          pnl={wallet.pnl}
          color={wallet.color}
          x={wallet.pos.x}
          y={wallet.pos.y}
          isMain={i === 0}
        />
      ))}

      {/* Ranking UI */}
      <div className="absolute top-10 right-10 bg-black/60 backdrop-blur-md p-6 rounded-3xl border border-white/20 w-80 z-[100] shadow-2xl">
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
          <span className="text-white font-black italic tracking-widest text-xl">LEADERBOARD</span>
          <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded font-bold">ONLINE</span>
        </div>
        <div className="space-y-2">
          {[...state.wallets].sort((a,b) => b.pnl - a.pnl).map((w, idx) => (
            <div 
              key={w.id} 
              className={`flex items-center justify-between p-2 rounded-xl transition-all ${w.id === 'w-0' ? 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-105' : 'opacity-80'}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-white/50 font-mono text-xs">{idx + 1}</span>
                <span className={`text-sm font-bold text-white`}>{w.address}</span>
              </div>
              <span className="text-sm font-mono text-white font-black">${Math.floor(w.pnl).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-10 right-10 flex flex-col items-end z-[100]">
        <div className="text-white font-black text-4xl italic mb-1">STAGE 1</div>
        <div className="text-blue-400 font-mono text-sm">HUNTING IN PROGRESS...</div>
      </div>
    </AbsoluteFill>
  );
};
