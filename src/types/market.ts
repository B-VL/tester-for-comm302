export type AssetCategory = 'index' | 'stock' | 'crypto' | 'futures' | 'forex';

export interface ChartPoint {
  time: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface SymbolItem {
  id: string;
  symbol: string;
  name: string;
  category: AssetCategory;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  prevClose: number;
  openPrice: number;
  volume: string;
  volumeRaw: number;
  marketCap?: string;
  peRatio?: number;
  week52High: number;
  week52Low: number;
  sparkline: number[];
  badgeText?: string;
  badgeBgColor?: string;
  badgeTextColor?: string;
  country?: string;
  description: string;
  sector?: string;
  history: Record<'1D' | '5D' | '1M' | '6M' | '1Y' | 'ALL', ChartPoint[]>;
}

export interface MarketRegion {
  id: string;
  name: string;
  status: 'Open' | 'Closed' | 'Pre-Market' | 'After-Hours';
  description: string;
}

export type ActiveScreen = 'markets' | 'indices' | 'stocks' | 'crypto' | 'futures' | 'watchlist';
