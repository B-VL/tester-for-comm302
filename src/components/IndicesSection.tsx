import React, { useState } from 'react';
import { SymbolItem } from '../types/market';
import { ExternalLink, Star, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';

interface IndicesSectionProps {
  symbols: SymbolItem[];
  onSelectSymbol: (symbol: SymbolItem) => void;
  onViewAllIndices: () => void;
  watchlist: string[];
  onToggleWatchlist: (id: string) => void;
  flashingIds: Record<string, 'up' | 'down'>;
}

export const IndicesSection: React.FC<IndicesSectionProps> = ({
  symbols,
  onSelectSymbol,
  onViewAllIndices,
  watchlist,
  onToggleWatchlist,
  flashingIds,
}) => {
  const [selectedPill, setSelectedPill] = useState<string | null>(null);
  const [hoveredCardPoint, setHoveredCardPoint] = useState<{ id: string; price: number } | null>(null);

  // Filter 3 primary cards: SPX, NDX, DJI
  const spx = symbols.find((s) => s.id === 'spx') || symbols[0];
  const ndx = symbols.find((s) => s.id === 'ndx') || symbols[1];
  const dji = symbols.find((s) => s.id === 'dji') || symbols[2];

  // Quick pills
  const pillSymbols = [
    symbols.find((s) => s.id === 'spx'),
    symbols.find((s) => s.id === 'ndx'),
    symbols.find((s) => s.id === 'dji'),
    symbols.find((s) => s.id === 'rut'),
    symbols.find((s) => s.id === 'dax'),
  ].filter(Boolean) as SymbolItem[];

  // World indices table: NI225, UKX, DAX (+ CAC, HSI)
  const worldIndices = symbols.filter(
    (s) => ['ni225', 'ukx', 'dax', 'cac40', 'hsi', 'asx200'].includes(s.id)
  );

  return (
    <section className="space-y-6" data-purpose="indices-overview">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onViewAllIndices}
          className="group inline-flex items-center gap-1.5 text-2xl md:text-3xl font-bold text-[#131722] hover:text-[#2962ff] transition-colors cursor-pointer"
        >
          <span>Indices</span>
          <svg
            className="w-6 h-6 stroke-[3] transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#6a6d78]">
          <span className="inline-block w-2 h-2 rounded-full bg-[#089981] animate-pulse"></span>
          <span>US Markets Open</span>
        </div>
      </div>

      {/* Quick Ticker Horizontal Pills (Exact match to TV snapshot badges) */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
        {pillSymbols.map((item) => {
          const isUp = item.change >= 0;
          const flash = flashingIds[item.id];
          return (
            <button
              key={item.id}
              onClick={() => onSelectSymbol(item)}
              className={`flex items-center gap-2.5 px-4 py-2 bg-[#f0f3f8] hover:bg-[#e3e6ed] rounded-full transition-all shrink-0 cursor-pointer ${
                flash === 'up' ? 'flash-up' : flash === 'down' ? 'flash-down' : ''
              }`}
            >
              <span
                className="w-6 h-6 rounded-full text-white text-[11px] font-bold flex items-center justify-center shrink-0 shadow-2xs"
                style={{ backgroundColor: item.badgeBgColor || '#2962ff' }}
              >
                {item.badgeText}
              </span>
              <span className="text-sm font-semibold text-[#131722]">{item.symbol}</span>
              <span
                className={`text-xs font-bold ml-1 font-mono tabular-nums ${
                  isUp ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                {isUp ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3 Indices Cards Grid with Sparklines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {[spx, ndx, dji].map((item) => {
          if (!item) return null;
          const isUp = item.change >= 0;
          const flash = flashingIds[item.id];
          const isFavorited = watchlist.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => onSelectSymbol(item)}
              className={`border border-[#e0e3eb] rounded-2xl p-5 hover:shadow-lg transition-all duration-200 relative overflow-hidden bg-white group cursor-pointer ${
                flash === 'up' ? 'ring-2 ring-[#089981]/50' : flash === 'down' ? 'ring-2 ring-[#f23645]/50' : ''
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="w-9 h-9 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-xs"
                    style={{ backgroundColor: item.badgeBgColor || '#0288d1' }}
                  >
                    {item.badgeText}
                  </span>
                  <div>
                    <h3 className="font-bold text-base text-[#131722] leading-tight group-hover:text-[#2962ff] transition-colors flex items-center gap-1.5">
                      {item.symbol}
                      <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-70 transition-opacity" />
                    </h3>
                    <span className="text-xs text-[#6a6d78] font-medium">{item.exchange}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWatchlist(item.id);
                    }}
                    title={isFavorited ? 'Remove from watchlist' : 'Add to watchlist'}
                    className="p-1 rounded-full text-[#787b86] hover:text-[#2962ff] hover:bg-slate-100 opacity-60 group-hover:opacity-100 transition-opacity"
                  >
                    <Star className={`w-4 h-4 ${isFavorited ? 'fill-amber-400 text-amber-500' : ''}`} />
                  </button>
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded font-mono tabular-nums ${
                      isUp ? 'bg-[#e6f7f4] text-[#089981]' : 'bg-[#fdecee] text-[#f23645]'
                    }`}
                  >
                    {isUp ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`}
                  </span>
                </div>
              </div>

              {/* Price & Change */}
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#131722] font-mono tabular-nums">
                  {item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span
                  className={`text-xs font-semibold font-mono tabular-nums ${
                    isUp ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isUp ? `+${item.change.toFixed(2)}` : item.change.toFixed(2)}
                </span>
              </div>

              {/* Sparkline Chart */}
              <div className="mt-4 h-16 w-full relative">
                {isUp ? (
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 280 60">
                    <defs>
                      <linearGradient id={`grad-${item.id}`} x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="#089981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#089981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,45 Q35,50 70,35 T140,25 T210,15 T280,8 L280,60 L0,60 Z"
                      fill={`url(#grad-${item.id})`}
                    />
                    <path
                      d="M0,45 Q35,50 70,35 T140,25 T210,15 T280,8"
                      fill="none"
                      stroke="#089981"
                      strokeLinecap="round"
                      strokeWidth="2"
                    />
                  </svg>
                ) : (
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 280 60">
                    <defs>
                      <linearGradient id={`grad-${item.id}`} x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="#f23645" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#f23645" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,15 Q50,10 90,30 T180,35 T250,48 T280,52 L280,60 L0,60 Z"
                      fill={`url(#grad-${item.id})`}
                    />
                    <path
                      d="M0,15 Q50,10 90,30 T180,35 T250,48 T280,52"
                      fill="none"
                      stroke="#f23645"
                      strokeLinecap="round"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* World Indices Quote Table */}
      <div className="border border-[#e0e3eb] rounded-xl overflow-hidden mt-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] bg-white">
        <div className="px-4 py-3 bg-slate-50/70 border-b border-[#e0e3eb] flex items-center justify-between">
          <span className="text-xs font-bold text-[#131722] uppercase tracking-wider">
            Major World Indices
          </span>
          <button
            onClick={onViewAllIndices}
            className="text-xs font-semibold text-[#2962ff] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>View all world indices</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="text-[12px] text-[#6a6d78] border-b border-[#f0f3fa] bg-white">
                <th className="py-2.5 px-4 font-semibold">Symbol</th>
                <th className="py-2.5 px-4 font-semibold text-right">Price</th>
                <th className="py-2.5 px-4 font-semibold text-right">Change</th>
                <th className="py-2.5 px-4 font-semibold text-right">% Change</th>
                <th className="py-2.5 px-4 font-semibold text-right hidden md:table-cell">High</th>
                <th className="py-2.5 px-4 font-semibold text-right hidden md:table-cell">Low</th>
                <th className="py-2.5 px-4 font-semibold text-right">Trend (1D)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f3fa] bg-white font-medium">
              {worldIndices.map((row) => {
                const isUp = row.change >= 0;
                const flash = flashingIds[row.id];

                return (
                  <tr
                    key={row.id}
                    onClick={() => onSelectSymbol(row)}
                    className={`row-hover transition-colors cursor-pointer ${
                      flash === 'up' ? 'flash-up' : flash === 'down' ? 'flash-down' : ''
                    }`}
                  >
                    {/* Symbol */}
                    <td className="py-3 px-4 flex items-center gap-2.5">
                      <span
                        className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: row.badgeBgColor || '#fee2e2',
                          color: row.badgeTextColor || '#dc2626',
                        }}
                      >
                        {row.badgeText || row.country}
                      </span>
                      <div>
                        <span className="font-bold text-[#131722] block hover:text-[#2962ff]">
                          {row.symbol}
                        </span>
                        <span className="text-xs text-[#6a6d78]">{row.name}</span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 text-right font-semibold font-mono tabular-nums text-[#131722]">
                      {row.price.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    {/* Change */}
                    <td
                      className={`py-3 px-4 text-right font-mono tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? `+${row.change.toFixed(2)}` : row.change.toFixed(2)}
                    </td>

                    {/* % Change */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${
                          isUp ? 'bg-[#e6f7f4] text-[#089981]' : 'bg-[#fdecee] text-[#f23645]'
                        }`}
                      >
                        {isUp ? `+${row.changePercent.toFixed(2)}%` : `${row.changePercent.toFixed(2)}%`}
                      </span>
                    </td>

                    {/* High */}
                    <td className="py-3 px-4 text-right text-[#6a6d78] font-mono tabular-nums hidden md:table-cell">
                      {row.high.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    {/* Low */}
                    <td className="py-3 px-4 text-right text-[#6a6d78] font-mono tabular-nums hidden md:table-cell">
                      {row.low.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    {/* Trend Sparkline */}
                    <td className="py-3 px-4 text-right">
                      {isUp ? (
                        <svg className="w-20 h-5 inline-block" viewBox="0 0 80 20">
                          <path
                            d="M0,15 L20,12 L40,16 L60,8 L80,3"
                            fill="none"
                            stroke="#089981"
                            strokeWidth="1.8"
                          />
                        </svg>
                      ) : (
                        <svg className="w-20 h-5 inline-block" viewBox="0 0 80 20">
                          <path
                            d="M0,4 L25,6 L45,15 L65,11 L80,18"
                            fill="none"
                            stroke="#f23645"
                            strokeWidth="1.8"
                          />
                        </svg>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
