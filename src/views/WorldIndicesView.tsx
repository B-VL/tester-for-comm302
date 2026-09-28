import React, { useState } from 'react';
import { SymbolItem } from '../types/market';
import { ArrowLeft, Search, ArrowUpDown, Star, TrendingUp, TrendingDown } from 'lucide-react';

interface WorldIndicesViewProps {
  symbols: SymbolItem[];
  onSelectSymbol: (symbol: SymbolItem) => void;
  onBack: () => void;
  watchlist: string[];
  onToggleWatchlist: (id: string) => void;
  flashingIds: Record<string, 'up' | 'down'>;
}

export const WorldIndicesView: React.FC<WorldIndicesViewProps> = ({
  symbols,
  onSelectSymbol,
  onBack,
  watchlist,
  onToggleWatchlist,
  flashingIds,
}) => {
  const [regionFilter, setRegionFilter] = useState<'all' | 'US' | 'Europe' | 'Asia'>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'changePercent' | 'symbol'>('changePercent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const indices = symbols.filter((s) => s.category === 'index');

  const filtered = indices
    .filter((idx) => {
      const matchRegion =
        regionFilter === 'all' ||
        (regionFilter === 'US' && ['US'].includes(idx.country || '')) ||
        (regionFilter === 'Europe' && ['DE', 'UK', 'FR'].includes(idx.country || '')) ||
        (regionFilter === 'Asia' && ['JP', 'HK', 'AU', 'CN'].includes(idx.country || ''));

      const matchSearch =
        idx.symbol.toLowerCase().includes(search.toLowerCase()) ||
        idx.name.toLowerCase().includes(search.toLowerCase());

      return matchRegion && matchSearch;
    })
    .sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (typeof valA === 'string') {
        return sortOrder === 'asc'
          ? (valA as string).localeCompare(valB as string)
          : (valB as string).localeCompare(valA as string);
      }
      return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });

  const handleSort = (field: 'price' | 'changePercent' | 'symbol') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

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
          <h1 className="text-3xl font-black text-[#131722]">World Indices Screener</h1>
          <p className="text-xs text-[#6a6d78] mt-1">
            Global economic benchmarks tracking primary market exchanges and liquid country indices.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#787b86]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter indices..."
            className="w-full pl-9 pr-3 py-2 bg-[#f0f3fa] rounded-full text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#2962ff]"
          />
        </div>
      </div>

      {/* Region tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {(
          [
            { id: 'all', label: 'All Global Indices' },
            { id: 'US', label: 'Americas (US)' },
            { id: 'Europe', label: 'Europe (DAX, FTSE, CAC)' },
            { id: 'Asia', label: 'Asia-Pacific (Nikkei, Hang Seng, ASX)' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setRegionFilter(tab.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer shrink-0 transition-colors ${
              regionFilter === tab.id
                ? 'bg-[#131722] text-white shadow-2xs'
                : 'bg-[#f0f3f8] hover:bg-[#e3e6ed] text-[#131722]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Indices Table */}
      <div className="border border-[#e0e3eb] rounded-2xl overflow-hidden shadow-xs bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="text-[12px] text-[#6a6d78] border-b border-[#f0f3fa] bg-slate-50/70">
                <th
                  onClick={() => handleSort('symbol')}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-[#131722]"
                >
                  <div className="flex items-center gap-1">
                    <span>Index Symbol</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('price')}
                  className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-[#131722]"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Value</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold text-right">Change</th>
                <th
                  onClick={() => handleSort('changePercent')}
                  className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-[#131722]"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>% Change</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold text-right hidden sm:table-cell">Day High</th>
                <th className="py-3 px-4 font-semibold text-right hidden sm:table-cell">Day Low</th>
                <th className="py-3 px-4 font-semibold text-right hidden md:table-cell">52W Range</th>
                <th className="py-3 px-4 font-semibold text-right">1D Trend</th>
                <th className="py-3 px-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f3fa] font-medium">
              {filtered.map((item) => {
                const isUp = item.change >= 0;
                const flash = flashingIds[item.id];
                const isFavorited = watchlist.includes(item.id);

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectSymbol(item)}
                    className={`row-hover transition-colors cursor-pointer ${
                      flash === 'up' ? 'flash-up' : flash === 'down' ? 'flash-down' : ''
                    }`}
                  >
                    {/* Symbol */}
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <span
                        className="w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 shadow-2xs"
                        style={{
                          backgroundColor: item.badgeBgColor || '#e2e8f0',
                          color: item.badgeTextColor || '#0f172a',
                        }}
                      >
                        {item.badgeText || item.country || item.symbol.slice(0, 2)}
                      </span>
                      <div>
                        <span className="font-bold text-[#131722] block hover:text-[#2962ff]">
                          {item.symbol}
                        </span>
                        <span className="text-xs text-[#6a6d78] block truncate max-w-[180px]">
                          {item.name}
                        </span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 text-right font-semibold font-mono tabular-nums text-[#131722]">
                      {item.price.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    {/* Change */}
                    <td
                      className={`py-3.5 px-4 text-right font-mono tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? `+${item.change.toFixed(2)}` : item.change.toFixed(2)}
                    </td>

                    {/* % Change */}
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-xs font-bold rounded ${
                          isUp ? 'bg-[#e6f7f4] text-[#089981]' : 'bg-[#fdecee] text-[#f23645]'
                        }`}
                      >
                        {isUp ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`}
                      </span>
                    </td>

                    {/* High */}
                    <td className="py-3.5 px-4 text-right text-[#6a6d78] font-mono tabular-nums hidden sm:table-cell">
                      {item.high.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>

                    {/* Low */}
                    <td className="py-3.5 px-4 text-right text-[#6a6d78] font-mono tabular-nums hidden sm:table-cell">
                      {item.low.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>

                    {/* 52W Range mini progress */}
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums hidden md:table-cell">
                      <div className="w-24 ml-auto">
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#2962ff] rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.max(
                                  10,
                                  ((item.price - item.week52Low) /
                                    (item.week52High - item.week52Low || 1)) *
                                    100
                                )
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Trend Sparkline */}
                    <td className="py-3.5 px-4 text-right">
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

                    {/* Watchlist toggle */}
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWatchlist(item.id);
                        }}
                        className="p-1 rounded text-[#787b86] hover:text-amber-500"
                        title={isFavorited ? 'Remove from watchlist' : 'Add to watchlist'}
                      >
                        <Star
                          className={`w-4 h-4 ${isFavorited ? 'fill-amber-400 text-amber-500' : ''}`}
                        />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
