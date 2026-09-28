import React, { useState } from 'react';
import { SymbolItem } from '../types/market';
import { Star, ChevronRight, TrendingUp, Info } from 'lucide-react';

interface StocksSectionProps {
  symbols: SymbolItem[];
  onSelectSymbol: (symbol: SymbolItem) => void;
  onViewAllStocks: (category?: string) => void;
  watchlist: string[];
  onToggleWatchlist: (id: string) => void;
  flashingIds: Record<string, 'up' | 'down'>;
}

export const StocksSection: React.FC<StocksSectionProps> = ({
  symbols,
  onSelectSymbol,
  onViewAllStocks,
  watchlist,
  onToggleWatchlist,
  flashingIds,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('Overview');

  // Filter tabs
  const filterTabs = [
    { label: 'Overview', id: 'all' },
    { label: 'NVIDIA (NVDA)', id: 'nvda' },
    { label: 'Apple (AAPL)', id: 'aapl' },
    { label: 'Tesla (TSLA)', id: 'tsla' },
    { label: 'Microsoft (MSFT)', id: 'msft' },
    { label: 'Amazon (AMZN)', id: 'amzn' },
    { label: 'Meta (META)', id: 'meta' },
  ];

  // Specific groups
  const communityTrends = [
    symbols.find((s) => s.id === 'nvda'),
    symbols.find((s) => s.id === 'tsla'),
    symbols.find((s) => s.id === 'aapl'),
  ].filter(Boolean) as SymbolItem[];

  const highestVolume = [
    symbols.find((s) => s.id === 'amd'),
    symbols.find((s) => s.id === 'intc'),
    symbols.find((s) => s.id === 'pltr'),
  ].filter(Boolean) as SymbolItem[];

  const topGainers = [
    symbols.find((s) => s.id === 'app'),
    symbols.find((s) => s.id === 'cvna'),
    symbols.find((s) => s.id === 'coin'),
  ].filter(Boolean) as SymbolItem[];

  // If a specific stock is selected in the tabs (not overview), show that stock highlighted
  const selectedMegaCap = filterTabs.find((t) => t.label === activeFilter && t.id !== 'all');
  const highlightedSymbol = selectedMegaCap ? symbols.find((s) => s.id === selectedMegaCap.id) : null;

  return (
    <section className="space-y-6 pt-6" data-purpose="us-stocks">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onViewAllStocks('all')}
          className="group inline-flex items-center gap-1.5 text-2xl md:text-3xl font-bold text-[#131722] hover:text-[#2962ff] transition-colors cursor-pointer"
        >
          <span>US stocks</span>
          <svg
            className="w-6 h-6 stroke-[3] transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>
      </div>

      {/* Quick Ticker Horizontal Pills for mega-cap stocks */}
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.label;
          return (
            <button
              key={tab.label}
              onClick={() => {
                setActiveFilter(tab.label);
                if (tab.id !== 'all') {
                  const target = symbols.find((s) => s.id === tab.id);
                  if (target) onSelectSymbol(target);
                }
              }}
              className={`px-4 py-1.5 rounded-full text-xs transition-colors shrink-0 cursor-pointer ${
                isActive
                  ? 'font-bold bg-[#131722] text-white shadow-xs'
                  : 'font-semibold bg-[#f0f3f8] hover:bg-[#e3e6ed] text-[#131722]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 3-Column Stock Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Community Trends */}
        <div className="border border-[#e0e3eb] rounded-xl p-4 bg-white flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#f0f3fa]">
              <h4 className="font-bold text-sm text-[#131722] flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#2962ff]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z"></path>
                </svg>
                Community trends
              </h4>
              <span className="text-[11px] font-semibold text-[#6a6d78] uppercase font-mono">
                24h mentions
              </span>
            </div>

            <ul className="divide-y divide-[#f0f3fa] text-sm">
              {communityTrends.map((stock) => {
                const isUp = stock.change >= 0;
                const flash = flashingIds[stock.id];
                const isFavorited = watchlist.includes(stock.id);

                return (
                  <li
                    key={stock.id}
                    onClick={() => onSelectSymbol(stock)}
                    className={`py-3 flex items-center justify-between row-hover px-2 rounded-lg transition-colors cursor-pointer group ${
                      flash === 'up' ? 'flash-up' : flash === 'down' ? 'flash-down' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-lg font-black text-xs flex items-center justify-center border shrink-0"
                        style={{
                          backgroundColor: stock.badgeBgColor || '#f8fafc',
                          color: stock.badgeTextColor || '#0f172a',
                          borderColor: `${stock.badgeTextColor}30`,
                        }}
                      >
                        {stock.symbol}
                      </div>
                      <div>
                        <span className="font-bold text-[#131722] block group-hover:text-[#2962ff] transition-colors">
                          {stock.symbol}
                        </span>
                        <span className="text-xs text-[#6a6d78] block truncate max-w-[120px]">
                          {stock.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWatchlist(stock.id);
                        }}
                        className="text-[#787b86] hover:text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                        title={isFavorited ? 'Remove from watchlist' : 'Add to watchlist'}
                      >
                        <Star className={`w-3.5 h-3.5 ${isFavorited ? 'fill-amber-400 text-amber-500 opacity-100' : ''}`} />
                      </button>
                      <div className="text-right">
                        <div className="font-bold text-[#131722] font-mono tabular-nums">
                          ${stock.price.toFixed(2)}
                        </div>
                        <span
                          className={`text-xs font-bold font-mono tabular-nums ${
                            isUp ? 'text-[#089981]' : 'text-[#f23645]'
                          }`}
                        >
                          {isUp ? `+${stock.changePercent.toFixed(2)}%` : `${stock.changePercent.toFixed(2)}%`}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <button
            onClick={() => onViewAllStocks('trending')}
            className="mt-2 text-xs font-bold text-[#2962ff] hover:underline flex items-center gap-1 pt-2 border-t border-[#f0f3fa] text-left cursor-pointer"
          >
            <span>See all trending stocks</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Column 2: Highest Volume */}
        <div className="border border-[#e0e3eb] rounded-xl p-4 bg-white flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#f0f3fa]">
              <h4 className="font-bold text-sm text-[#131722] flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
                Highest volume
              </h4>
              <span className="text-[11px] font-semibold text-[#6a6d78] uppercase font-mono">
                Vol
              </span>
            </div>

            <ul className="divide-y divide-[#f0f3fa] text-sm">
              {highestVolume.map((stock) => {
                const isUp = stock.change >= 0;
                const flash = flashingIds[stock.id];
                const isFavorited = watchlist.includes(stock.id);

                return (
                  <li
                    key={stock.id}
                    onClick={() => onSelectSymbol(stock)}
                    className={`py-3 flex items-center justify-between row-hover px-2 rounded-lg transition-colors cursor-pointer group ${
                      flash === 'up' ? 'flash-up' : flash === 'down' ? 'flash-down' : ''
                    }`}
                  >
                    <div>
                      <span className="font-bold text-[#131722] block group-hover:text-[#2962ff] transition-colors">
                        {stock.symbol}
                      </span>
                      <span className="text-xs text-[#6a6d78] block truncate max-w-[150px]">
                        {stock.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWatchlist(stock.id);
                        }}
                        className="text-[#787b86] hover:text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                        title={isFavorited ? 'Remove from watchlist' : 'Add to watchlist'}
                      >
                        <Star className={`w-3.5 h-3.5 ${isFavorited ? 'fill-amber-400 text-amber-500 opacity-100' : ''}`} />
                      </button>
                      <div className="text-right">
                        <div className="font-bold text-[#131722] font-mono tabular-nums">
                          {stock.volume}
                        </div>
                        <span
                          className={`text-xs font-bold font-mono tabular-nums ${
                            isUp ? 'text-[#089981]' : 'text-[#f23645]'
                          }`}
                        >
                          {isUp ? `+${stock.changePercent.toFixed(2)}%` : `${stock.changePercent.toFixed(2)}%`}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <button
            onClick={() => onViewAllStocks('volume')}
            className="mt-2 text-xs font-bold text-[#2962ff] hover:underline flex items-center gap-1 pt-2 border-t border-[#f0f3fa] text-left cursor-pointer"
          >
            <span>Explore all volume leaders</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Column 3: Top Gainers */}
        <div className="border border-[#e0e3eb] rounded-xl p-4 bg-white flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#f0f3fa]">
              <h4 className="font-bold text-sm text-[#131722] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#089981]"></span>
                Top US gainers
              </h4>
              <span className="text-[11px] font-semibold text-[#6a6d78] uppercase font-mono">
                Today
              </span>
            </div>

            <ul className="divide-y divide-[#f0f3fa] text-sm">
              {topGainers.map((stock) => {
                const flash = flashingIds[stock.id];
                const isFavorited = watchlist.includes(stock.id);

                return (
                  <li
                    key={stock.id}
                    onClick={() => onSelectSymbol(stock)}
                    className={`py-3 flex items-center justify-between row-hover px-2 rounded-lg transition-colors cursor-pointer group ${
                      flash === 'up' ? 'flash-up' : flash === 'down' ? 'flash-down' : ''
                    }`}
                  >
                    <div>
                      <span className="font-bold text-[#131722] block group-hover:text-[#2962ff] transition-colors">
                        {stock.symbol}
                      </span>
                      <span className="text-xs text-[#6a6d78] block truncate max-w-[150px]">
                        {stock.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWatchlist(stock.id);
                        }}
                        className="text-[#787b86] hover:text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                        title={isFavorited ? 'Remove from watchlist' : 'Add to watchlist'}
                      >
                        <Star className={`w-3.5 h-3.5 ${isFavorited ? 'fill-amber-400 text-amber-500 opacity-100' : ''}`} />
                      </button>
                      <div className="text-right">
                        <div className="font-bold text-[#131722] font-mono tabular-nums">
                          ${stock.price.toFixed(2)}
                        </div>
                        <span className="inline-block px-1.5 py-0.5 text-xs font-bold rounded bg-[#e6f7f4] text-[#089981] font-mono tabular-nums">
                          +{stock.changePercent.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <button
            onClick={() => onViewAllStocks('gainers')}
            className="mt-2 text-xs font-bold text-[#2962ff] hover:underline flex items-center gap-1 pt-2 border-t border-[#f0f3fa] text-left cursor-pointer"
          >
            <span>View all daily gainers</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </section>
  );
};
