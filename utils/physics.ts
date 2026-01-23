
import { Wallet, ProfitDot } from '../types';
import { VIDEO_WIDTH, VIDEO_HEIGHT } from '../constants';

export const getDistance = (p1: {x: number, y: number}, p2: {x: number, y: number}) => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

export const normalize = (v: {x: number, y: number}) => {
  const mag = Math.sqrt(v.x * v.x + v.y * v.y);
  if (mag === 0) return { x: 0, y: 0 };
  return { x: v.x / mag, y: v.y / mag };
};

export const getWalletPosition = (wallet: Wallet, frame: number) => {
  // Constant velocity movement for background wallets
  const x = (wallet.initialPos.x + wallet.velocity.x * frame) % VIDEO_WIDTH;
  const y = (wallet.initialPos.y + wallet.velocity.y * frame) % VIDEO_HEIGHT;
  return {
    x: x < 0 ? x + VIDEO_WIDTH : x,
    y: y < 0 ? y + VIDEO_HEIGHT : y
  };
};

export const getDotPosition = (dot: ProfitDot, frame: number) => {
  const driftX = Math.sin(frame / 20 + parseInt(dot.id) * 0.5) * 5;
  const driftY = Math.cos(frame / 25 + parseInt(dot.id) * 0.7) * 5;
  return {
    x: dot.pos.x + driftX,
    y: dot.pos.y + driftY
  };
};
