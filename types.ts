export interface WalletHistoryItem {
  symbol: string;
  name: string;
  roi: string;
  usd_pnl: string;
  bvu: string;
  svu: string;
  bamt: string;
  samt: string;
  icon: string;
}

export interface ApiResponse {
  code: number;
  msg: string;
  data: WalletHistoryItem[];
}

export interface BallProps {
  item: WalletHistoryItem;
  x: number;
  y: number;
  size: number;
  opacity: number;
}
