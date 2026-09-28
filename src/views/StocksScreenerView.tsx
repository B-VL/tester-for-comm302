import React, { useState } from 'react';
import { SymbolItem } from '../types/market';
import { ArrowLeft, Search, ArrowUpDown, Star, TrendingUp, Filter } from 'lucide-react';

interface StocksScreenerViewProps {
  symbols: SymbolItem[];
  onSelectSymbol: (symbol: SymbolItem) => void;
  onBack: () => void;
  watchlist: string[];
  onToggleWatchlist: (id: string) => void;
  flashingIds: Record<string, 'up' | 'down'>;
  initialFilter?: string;
}

export const StocksScreenerView: React.FC<StocksScreenerViewProps> = ({
  symbols,
  onSelectSymbol,
  onBack,
  watchlist,
  onToggleWatchlist,
  flashingIds,
  initialFilter = 'all',
}) => {
  const [filterType, setFilterType] = useState<string>(initialFilter);
  const [sectorFilter, setSectorFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'changePercent' | 'volumeRaw' | 'symbol'>('changePercent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const stockList = symbols.filter((s) => s.category === 'stock');

  const filtered = stockList
    .filter((stock) => {
      let matchType = true;
      if (filterType === 'trending') {
        matchType = ['nvda', 'tsla', 'aapl'].includes(stock.id);
      } else if (filterType === 'volume') {
        matchType = ['amd', 'intc', 'pltr', 'nvda'].includes(stock.id);
      } else if (filterType === 'gainers') {
        matchType = stock.changePercent > 3;
      }

      const matchSector = sectorFilter === 'All' || stock.sector?.includes(sectorFilter);
      const matchSearch =
        stock.symbol.toLowerCase().includes(search.toLowerCase()) ||
        stock.name.toLowerCase().includes(search.toLowerCase());

      return matchType && matchSector && matchSearch;
    })
    .sort((a, b) => {
      let valA = a[sortBy] ?? 0;
      let valB = b[sortBy] ?? 0;
      if (typeof valA === 'string') {
        return sortOrder === 'asc'
          ? (valA as string).localeCompare(valB as string)
          : (valB as string).localeCompare(valA as string);
      }
      return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });

  const handleSort = (field: 'price' | 'changePercent' | 'volumeRaw' | 'symbol') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const sectors = ['All', 'Semiconductors', 'Software', 'Automotive', 'Consumer', 'AdTech'];

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
          <h1 className="text-3xl font-black text-[#131722]">US Stocks Screener</h1>
          <p className="text-xs text-[#6a6d78] mt-1">
            Real-time equity quotes, community sentiment trends, high-volume movers, and breakout daily gainers.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#787b86]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stocks by symbol or company..."
            className="w-full pl-9 pr-3 py-2 bg-[#f0f3fa] rounded-full text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#2962ff]"
          />
        </div>
      </div>

      {/* Filter tabs & Sector dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {(
            [
              { id: 'all', label: 'All US Stocks' },
              { id: 'trending', label: 'Community Trends' },
              { id: 'volume', label: 'Highest Volume' },
              { id: 'gainers', label: 'Top Gainers (>3%)' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer shrink-0 transition-colors ${
                filterType === tab.id
                  ? 'bg-[#131722] text-white shadow-2xs'
                  : 'bg-[#f0f3f8] hover:bg-[#e3e6ed] text-[#131722]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-[#787b86]" />
          <span className="text-[#6a6d78] font-medium">Sector:</span>
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="bg-white border border-[#e0e3eb] rounded-lg px-2.5 py-1 text-xs font-semibold text-[#131722] focus:outline-none"
          >
            {sectors.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stocks Table */}
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
                    <span>Ticker & Company</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('price')}
                  className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-[#131722]"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Last Price</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold text-right">Change ($)</th>
                <th
                  onClick={() => handleSort('changePercent')}
                  className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-[#131722]"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>% Change</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('volumeRaw')}
                  className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-[#131722]"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Volume</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold text-right hidden sm:table-cell">Market Cap</th>
                <th className="py-3 px-4 font-semibold text-right hidden md:table-cell">P/E Ratio</th>
                <th className="py-3 px-4 font-semibold text-right hidden lg:table-cell">Sector</th>
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
                    {/* Ticker & Name */}
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg font-black text-xs flex items-center justify-center border shrink-0 shadow-2xs"
                        style={{
                          backgroundColor: item.badgeBgColor || '#f8fafc',
                          color: item.badgeTextColor || '#0f172a',
                          borderColor: `${item.badgeTextColor}30`,
                        }}
                      >
                        {item.symbol}
                      </div>
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
                      ${item.price.toFixed(2)}
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

                    {/* Volume */}
                    <td className="py-3.5 px-4 text-right text-[#131722] font-mono tabular-nums">
                      {item.volume}
                    </td>

                    {/* Market Cap */}
                    <td className="py-3.5 px-4 text-right text-[#6a6d78] font-mono tabular-nums hidden sm:table-cell">
                      {item.marketCap || '—'}
                    </td>

                    {/* P/E */}
                    <td className="py-3.5 px-4 text-right text-[#6a6d78] font-mono tabular-nums hidden md:table-cell">
                      {item.peRatio ? item.peRatio.toFixed(1) : '—'}
                    </td>

                    {/* Sector */}
                    <td className="py-3.5 px-4 text-right text-xs text-[#787b86] hidden lg:table-cell">
                      {item.sector || 'Equities'}
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
