import React from 'react';
import { SymbolItem } from '../types/market';
import { X, Trash2, ExternalLink, Bookmark, Download, Plus } from 'lucide-react';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  symbols: SymbolItem[];
  watchlistIds: string[];
  onSelectSymbol: (symbol: SymbolItem) => void;
  onRemoveFromWatchlist: (id: string) => void;
  onOpenSearch: () => void;
  flashingIds: Record<string, 'up' | 'down'>;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  symbols,
  watchlistIds,
  onSelectSymbol,
  onRemoveFromWatchlist,
  onOpenSearch,
  flashingIds,
}) => {
  if (!isOpen) return null;

  const savedSymbols = symbols.filter((s) => watchlistIds.includes(s.id));

  const exportCSV = () => {
    const headers = 'Symbol,Name,Category,Price,Change,ChangePercent\n';
    const rows = savedSymbols
      .map((s) => `"${s.symbol}","${s.name}","${s.category}",${s.price},${s.change},${s.changePercent}%`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tradingview_watchlist_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-[#e0e3eb] flex flex-col animate-in slide-in-from-right duration-200">
          
          {/* Header */}
          <div className="p-4 border-b border-[#f0f3fa] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-[#2962ff]" />
              <h3 className="font-black text-lg text-[#131722]">Watchlist</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 font-mono font-bold text-[#6a6d78]">
                {savedSymbols.length}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {savedSymbols.length > 0 && (
                <button
                  onClick={exportCSV}
                  title="Export Watchlist to CSV"
                  className="p-1.5 rounded-lg text-[#787b86] hover:bg-slate-100 hover:text-[#131722] transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#787b86] hover:bg-slate-100 hover:text-[#131722] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Action to add ticker */}
          <div className="p-3 border-b border-[#f0f3fa] bg-slate-50/50">
            <button
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              className="w-full py-2 px-3 border border-dashed border-[#2962ff]/40 bg-[#eff6ff]/60 hover:bg-[#eff6ff] rounded-xl text-xs font-bold text-[#2962ff] flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Symbol to Watchlist
            </button>
          </div>

          {/* Watchlist Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#f0f3fa]">
            {savedSymbols.length === 0 ? (
              <div className="p-8 text-center text-[#6a6d78] space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-[#787b86]">
                  <Bookmark className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#131722]">Your watchlist is empty</p>
                  <p className="text-xs text-[#787b86] mt-1">
                    Click the star icon on any stock, index, or cryptocurrency to track it here in real-time.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenSearch();
                  }}
                  className="px-4 py-2 bg-[#131722] hover:bg-black text-white text-xs font-semibold rounded-full shadow-xs"
                >
                  Browse Markets
                </button>
              </div>
            ) : (
              savedSymbols.map((item) => {
                const isUp = item.change >= 0;
                const flash = flashingIds[item.id];

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectSymbol(item);
                      onClose();
                    }}
                    className={`p-3.5 flex items-center justify-between hover:bg-[#f8f9fd] transition-colors cursor-pointer group ${
                      flash === 'up' ? 'flash-up' : flash === 'down' ? 'flash-down' : ''
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
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-[#131722] group-hover:text-[#2962ff] transition-colors">
                            {item.symbol}
                          </span>
                          <span className="text-[10px] font-mono text-[#787b86] uppercase">
                            {item.exchange}
                          </span>
                        </div>
                        <span className="text-xs text-[#6a6d78] block truncate max-w-[150px]">
                          {item.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
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
                          onRemoveFromWatchlist(item.id);
                        }}
                        className="p-1.5 rounded-lg text-[#787b86] hover:text-[#f23645] hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                        title="Remove from watchlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-[#f0f3fa] bg-slate-50 text-[11px] text-[#787b86] flex items-center justify-between font-mono">
            <span>Market Feed: Simulated Live</span>
            <span className="text-[#089981] font-bold">● Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
