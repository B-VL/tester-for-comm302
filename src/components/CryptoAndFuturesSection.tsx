import React from 'react';
import { SymbolItem } from '../types/market';
import { Star, ChevronRight } from 'lucide-react';

interface CryptoAndFuturesProps {
  symbols: SymbolItem[];
  onSelectSymbol: (symbol: SymbolItem) => void;
  onViewCrypto: () => void;
  onViewFutures: () => void;
  watchlist: string[];
  onToggleWatchlist: (id: string) => void;
  flashingIds: Record<string, 'up' | 'down'>;
}

export const CryptoAndFuturesSection: React.FC<CryptoAndFuturesProps> = ({
  symbols,
  onSelectSymbol,
  onViewCrypto,
  onViewFutures,
  watchlist,
  onToggleWatchlist,
  flashingIds,
}) => {
  const btc = symbols.find((s) => s.id === 'btc');
  const eth = symbols.find((s) => s.id === 'eth');
  const sol = symbols.find((s) => s.id === 'sol');
  const cryptos = [btc, eth, sol].filter(Boolean) as SymbolItem[];

  const gc = symbols.find((s) => s.id === 'gc1');
  const cl = symbols.find((s) => s.id === 'cl1');
  const eurusd = symbols.find((s) => s.id === 'eurusd');
  const futures = [gc, cl, eurusd].filter(Boolean) as SymbolItem[];

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4" data-purpose="crypto-commodities">
      
      {/* Crypto Column */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onViewCrypto}
            className="group inline-flex items-center gap-1 text-2xl font-bold text-[#131722] hover:text-[#2962ff] cursor-pointer"
          >
            <span>Crypto</span>
            <svg
              className="w-5 h-5 stroke-[2.5] transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>
          <span className="text-xs font-semibold text-[#6a6d78] font-mono">
            Market Cap: $2.42T (+2.1%)
          </span>
        </div>

        <div className="border border-[#e0e3eb] rounded-xl p-4 bg-white space-y-2 hover:shadow-md transition-shadow">
          {cryptos.map((coin) => {
            const isUp = coin.change >= 0;
            const flash = flashingIds[coin.id];
            const isFavorited = watchlist.includes(coin.id);

            return (
              <div
                key={coin.id}
                onClick={() => onSelectSymbol(coin)}
                className={`flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group ${
                  flash === 'up' ? 'flash-up' : flash === 'down' ? 'flash-down' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {coin.id === 'sol' ? (
                    <span className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#9945FF] to-[#14F195] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                      SOL
                    </span>
                  ) : (
                    <span
                      className="w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0"
                      style={{ backgroundColor: coin.badgeBgColor || '#f7931a' }}
                    >
                      {coin.badgeText}
                    </span>
                  )}
                  <div>
                    <span className="font-bold text-[#131722] block group-hover:text-[#2962ff] transition-colors">
                      {coin.symbol}
                    </span>
                    <span className="text-xs text-[#6a6d78] font-mono">{coin.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWatchlist(coin.id);
                    }}
                    className="text-[#787b86] hover:text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    title={isFavorited ? 'Remove from watchlist' : 'Add to watchlist'}
                  >
                    <Star className={`w-3.5 h-3.5 ${isFavorited ? 'fill-amber-400 text-amber-500 opacity-100' : ''}`} />
                  </button>
                  <div className="text-right">
                    <span className="font-bold text-base block text-[#131722] font-mono tabular-nums">
                      ${coin.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span
                      className={`text-xs font-bold font-mono tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? `+${coin.changePercent.toFixed(2)}%` : `${coin.changePercent.toFixed(2)}%`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Commodities & Forex Column */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onViewFutures}
            className="group inline-flex items-center gap-1 text-2xl font-bold text-[#131722] hover:text-[#2962ff] cursor-pointer"
          >
            <span>Futures & Currencies</span>
            <svg
              className="w-5 h-5 stroke-[2.5] transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>
          <span className="text-xs font-semibold text-[#6a6d78]">Real-time Futures</span>
        </div>

        <div className="border border-[#e0e3eb] rounded-xl p-4 bg-white space-y-2 hover:shadow-md transition-shadow">
          {futures.map((item) => {
            const isUp = item.change >= 0;
            const flash = flashingIds[item.id];
            const isFavorited = watchlist.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => onSelectSymbol(item)}
                className={`flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group ${
                  flash === 'up' ? 'flash-up' : flash === 'down' ? 'flash-down' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                    style={{
                      backgroundColor: item.badgeBgColor || '#f5f5f4',
                      color: item.badgeTextColor || '#44403c',
                    }}
                  >
                    {item.badgeText}
                  </div>
                  <div>
                    <span className="font-bold text-[#131722] block group-hover:text-[#2962ff] transition-colors">
                      {item.symbol}
                    </span>
                    <span className="text-xs text-[#6a6d78] font-mono">{item.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWatchlist(item.id);
                    }}
                    className="text-[#787b86] hover:text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    title={isFavorited ? 'Remove from watchlist' : 'Add to watchlist'}
                  >
                    <Star className={`w-3.5 h-3.5 ${isFavorited ? 'fill-amber-400 text-amber-500 opacity-100' : ''}`} />
                  </button>
                  <div className="text-right">
                    <span className="font-bold text-base block text-[#131722] font-mono tabular-nums">
                      {item.price.toLocaleString('en-US', {
                        minimumFractionDigits: item.price < 5 ? 4 : 2,
                        maximumFractionDigits: item.price < 5 ? 4 : 2,
                      })}
                    </span>
                    <span
                      className={`text-xs font-bold font-mono tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};
