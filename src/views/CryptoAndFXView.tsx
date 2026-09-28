import React, { useState } from 'react';
import { SymbolItem } from '../types/market';
import { ArrowLeft, Search, Star, ArrowUpDown } from 'lucide-react';

interface CryptoAndFXViewProps {
  symbols: SymbolItem[];
  onSelectSymbol: (symbol: SymbolItem) => void;
  onBack: () => void;
  watchlist: string[];
  onToggleWatchlist: (id: string) => void;
  flashingIds: Record<string, 'up' | 'down'>;
}

export const CryptoAndFXView: React.FC<CryptoAndFXViewProps> = ({
  symbols,
  onSelectSymbol,
  onBack,
  watchlist,
  onToggleWatchlist,
  flashingIds,
}) => {
  const [tab, setTab] = useState<'all' | 'crypto' | 'futures'>('all');
  const [search, setSearch] = useState('');

  const items = symbols.filter(
    (s) => s.category === 'crypto' || s.category === 'futures' || s.category === 'forex'
  );

  const filtered = items.filter((item) => {
    const matchTab =
      tab === 'all' ||
      (tab === 'crypto' && item.category === 'crypto') ||
      (tab === 'futures' && (item.category === 'futures' || item.category === 'forex'));

    const matchSearch =
      item.symbol.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase());

    return matchTab && matchSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e0e3eb]">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2962ff] hover:underline mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Markets Overview
          </button>
          <h1 className="text-3xl font-black text-[#131722]">Crypto, Futures & Forex</h1>
          <p className="text-xs text-[#6a6d78] mt-1">
            24/7 global cryptocurrency trading, commodity derivatives, and international currency exchange rates.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#787b86]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search crypto or forex pair..."
            className="w-full pl-9 pr-3 py-2 bg-[#f0f3fa] rounded-full text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#2962ff]"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {(
          [
            { id: 'all', label: 'All Digital & Derivatives' },
            { id: 'crypto', label: 'Cryptocurrencies' },
            { id: 'futures', label: 'Commodities & Forex' },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer shrink-0 transition-colors ${
              tab === t.id
                ? 'bg-[#131722] text-white shadow-2xs'
                : 'bg-[#f0f3f8] hover:bg-[#e3e6ed] text-[#131722]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const isUp = item.change >= 0;
          const flash = flashingIds[item.id];
          const isFavorited = watchlist.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => onSelectSymbol(item)}
              className={`border border-[#e0e3eb] rounded-2xl p-5 hover:shadow-lg transition-all duration-200 bg-white group cursor-pointer ${
                flash === 'up' ? 'flash-up ring-2 ring-[#089981]/50' : flash === 'down' ? 'flash-down ring-2 ring-[#f23645]/50' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {item.id === 'sol' ? (
                    <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9945FF] to-[#14F195] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      SOL
                    </span>
                  ) : (
                    <span
                      className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-bold text-sm shadow-xs"
                      style={{ backgroundColor: item.badgeBgColor || '#f7931a' }}
                    >
                      {item.badgeText}
                    </span>
                  )}
                  <div>
                    <h3 className="font-bold text-base text-[#131722] leading-tight group-hover:text-[#2962ff] transition-colors">
                      {item.symbol}
                    </h3>
                    <span className="text-xs text-[#6a6d78] font-mono">{item.name}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWatchlist(item.id);
                  }}
                  className="p-1 rounded-full text-[#787b86] hover:text-[#2962ff] opacity-60 group-hover:opacity-100 transition-opacity"
                  title={isFavorited ? 'Remove from watchlist' : 'Add to watchlist'}
                >
                  <Star className={`w-4 h-4 ${isFavorited ? 'fill-amber-400 text-amber-500' : ''}`} />
                </button>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-black text-[#131722] font-mono tabular-nums block">
                    ${item.price.toLocaleString('en-US', {
                      minimumFractionDigits: item.price < 5 ? 4 : 2,
                      maximumFractionDigits: item.price < 5 ? 4 : 2,
                    })}
                  </span>
                  <span className="text-xs text-[#787b86] font-mono">
                    24h Vol: {item.volume}
                  </span>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-2.5 py-1 text-xs font-bold rounded font-mono tabular-nums ${
                      isUp ? 'bg-[#e6f7f4] text-[#089981]' : 'bg-[#fdecee] text-[#f23645]'
                    }`}
                  >
                    {isUp ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`}
                  </span>
                </div>
              </div>

              {/* Sparkline */}
              <div className="mt-4 h-12 w-full">
                {isUp ? (
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 40">
                    <path
                      d="M0,35 Q30,30 60,25 T120,18 T180,8 L200,4"
                      fill="none"
                      stroke="#089981"
                      strokeWidth="2"
                    />
                  </svg>
                ) : (
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 40">
                    <path
                      d="M0,10 Q40,15 80,22 T140,28 T180,36 L200,38"
                      fill="none"
                      stroke="#f23645"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
