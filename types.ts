
export interface Wallet {
  id: string;
  address: string;
  initialPnL: number;
  color: string;
  velocity: { x: number; y: number };
  initialPos: { x: number; y: number };
}

export interface ProfitDot {
  id: string;
  value: number;
  pos: { x: number; y: number };
  color: string;
}

export interface BattleState {
  wallets: Wallet[];
  dots: ProfitDot[];
}
