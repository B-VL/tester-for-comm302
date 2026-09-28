import React, { useState, useEffect, useRef } from 'react';
import { SymbolItem } from '../types/market';
import { Search, X, TrendingUp, Star, ChevronRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbols: SymbolItem[];
  onSelectSymbol: (symbol: SymbolItem) => void;
  watchlist: string[];
  onToggleWatchlist: (id: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  symbols,
  onSelectSymbol,
  watchlist,
  onToggleWatchlist,
}) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | 'stock' | 'index' | 'crypto' | 'futures'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = symbols.filter((s) => {
    const matchesCat = category === 'all' || s.category === category;
    const q = query.toLowerCase().trim();
    if (!q) return matchesCat;
    return (
      matchesCat &&
      (s.symbol.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.exchange.toLowerCase().includes(q) ||
        (s.sector && s.sector.toLowerCase().includes(q)))
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        onSelectSymbol(filtered[selectedIndex]);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-black/50 backdrop-blur-xs p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-[#e0e3eb] overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#f0f3fa] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#787b86]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search symbol, company name, index, or crypto..."
            className="w-full text-base font-medium text-[#131722] placeholder-[#787b86] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-[#787b86] hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-[#787b86] border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* Category Tabs */}
        <div className="px-4 py-2 border-b border-[#f0f3fa] flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-slate-50/50">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'stock', label: 'Stocks' },
              { id: 'index', label: 'Indices' },
              { id: 'crypto', label: 'Crypto' },
              { id: 'futures', label: 'Futures & FX' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setCategory(tab.id);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                category === tab.id
                  ? 'bg-[#131722] text-white shadow-2xs'
                  : 'bg-white text-[#6a6d78] hover:text-[#131722] border border-[#e0e3eb]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-[#f0f3fa]">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-[#6a6d78]">
              <p className="text-sm font-semibold">No symbols found for "{query}"</p>
              <p className="text-xs text-[#787b86] mt-1">
                Try searching for 'NVDA', 'Apple', 'S&P 500', or 'Bitcoin'
              </p>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const isUp = item.change >= 0;
              const isFavorited = watchlist.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectSymbol(item);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-4 py-3 flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#f0f3fa]' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-lg text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs"
                      style={{ backgroundColor: item.badgeBgColor || '#2962ff' }}
                    >
                      {item.badgeText || item.symbol.slice(0, 3)}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#131722]">{item.symbol}</span>
                        <span className="text-[11px] font-mono text-[#787b86] uppercase">
                          {item.exchange}
                        </span>
                      </div>
                      <span className="text-xs text-[#6a6d78] block truncate max-w-[220px] sm:max-w-[320px]">
                        {item.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-sm text-[#131722] font-mono tabular-nums">
                        ${item.price.toLocaleString('en-US', {
                          minimumFractionDigits: item.price < 5 ? 4 : 2,
                          maximumFractionDigits: item.price < 5 ? 4 : 2,
                        })}
                      </div>
                      <span
                        className={`text-xs font-bold font-mono tabular-nums ${
                          isUp ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isUp ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatchlist(item.id);
                      }}
                      className="p-1 rounded text-[#787b86] hover:text-amber-500 transition-colors"
                      title={isFavorited ? 'Remove from watchlist' : 'Add to watchlist'}
                    >
                      <Star
                        className={`w-4 h-4 ${isFavorited ? 'fill-amber-400 text-amber-500' : ''}`}
                      />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-slate-50 border-t border-[#f0f3fa] text-[11px] text-[#787b86] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 bg-white border rounded font-mono">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-white border rounded font-mono">↵</kbd> Select</span>
            <span><kbd className="px-1.5 py-0.5 bg-white border rounded font-mono">ESC</kbd> Close</span>
          </div>
          <span className="font-medium text-[#2962ff]">Real-time quotes</span>
        </div>
      </div>
    </div>
  );
};
