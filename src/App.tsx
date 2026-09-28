import React, { useState, useEffect, useCallback } from 'react';
import { INITIAL_SYMBOLS } from './data/marketData';
import { SymbolItem, ActiveScreen } from './types/market';
import { Navbar } from './components/Navbar';
import { HeroHeader } from './components/HeroHeader';
import { IndicesSection } from './components/IndicesSection';
import { StocksSection } from './components/StocksSection';
import { CryptoAndFuturesSection } from './components/CryptoAndFuturesSection';
import { ChartModal } from './components/ChartModal';
import { SearchModal } from './components/SearchModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { WorldIndicesView } from './views/WorldIndicesView';
import { StocksScreenerView } from './views/StocksScreenerView';
import { CryptoAndFXView } from './views/CryptoAndFXView';
import { Footer } from './components/Footer';

export default function App() {
  const [symbols, setSymbols] = useState<SymbolItem[]>(INITIAL_SYMBOLS);
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('markets');
  const [selectedRegion, setSelectedRegion] = useState('Everywhere');
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolItem | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [watchlistOpen, setWatchlistOpen] = useState(false);
  const [stockScreenerFilter, setStockScreenerFilter] = useState('all');
  const [isSimulating, setIsSimulating] = useState(true);
  const [flashingIds, setFlashingIds] = useState<Record<string, 'up' | 'down'>>({});

  // Persistent watchlist
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tv_watchlist');
      return saved ? JSON.parse(saved) : ['spx', 'nvda', 'btc'];
    } catch {
      return ['spx', 'nvda', 'btc'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tv_watchlist', JSON.stringify(watchlist));
    } catch {
      // Ignore
    }
  }, [watchlist]);

  const toggleWatchlist = useCallback((id: string) => {
    setWatchlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Simulated live market ticks
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // pick 1-2 random symbols to tick
      const randomCount = Math.floor(Math.random() * 2) + 1;
      const updatedFlashes: Record<string, 'up' | 'down'> = {};

      setSymbols((prev) => {
        const next = [...prev];
        for (let i = 0; i < randomCount; i++) {
          const randomIndex = Math.floor(Math.random() * next.length);
          const target = next[randomIndex];
          const pctDelta = (Math.random() - 0.48) * 0.003; // small subtle tick
          const priceDelta = target.price * pctDelta;
          const newPrice = Number((target.price + priceDelta).toFixed(target.price < 5 ? 4 : 2));
          const newChange = Number((target.change + priceDelta).toFixed(2));
          const newPct = Number(((newChange / (target.prevClose || target.price)) * 100).toFixed(2));
          const direction = priceDelta >= 0 ? 'up' : 'down';

          updatedFlashes[target.id] = direction;

          next[randomIndex] = {
            ...target,
            price: newPrice,
            change: newChange,
            changePercent: newPct,
            high: Math.max(target.high, newPrice),
            low: Math.min(target.low, newPrice),
          };

          // If currently open in modal, keep it updated
          if (selectedSymbol && selectedSymbol.id === target.id) {
            setSelectedSymbol(next[randomIndex]);
          }
        }
        return next;
      });

      setFlashingIds(updatedFlashes);

      // clear flash after 800ms
      setTimeout(() => {
        setFlashingIds({});
      }, 800);
    }, 3200);

    return () => clearInterval(interval);
  }, [isSimulating, selectedSymbol]);

  return (
    <div className="bg-white text-[#131722] min-h-screen flex flex-col selection:bg-[#2962ff] selection:text-white font-sans antialiased">
      {/* Top Navbar */}
      <Navbar
        activeScreen={activeScreen}
        onSelectScreen={(screen) => {
          setActiveScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenWatchlist={() => setWatchlistOpen(true)}
        watchlistCount={watchlist.length}
        isSimulating={isSimulating}
        onToggleSimulation={() => setIsSimulating(!isSimulating)}
      />

      {/* Main View Container */}
      <main className="flex-grow max-w-[1360px] w-full mx-auto px-4 lg:px-8 py-8 md:py-12 space-y-14">
        {activeScreen === 'markets' && (
          <>
            {/* Hero Headline */}
            <HeroHeader
              selectedRegion={selectedRegion}
              onSelectRegion={setSelectedRegion}
            />

            {/* Indices Section (Exact match to screenshot) */}
            <IndicesSection
              symbols={symbols}
              onSelectSymbol={(sym) => setSelectedSymbol(sym)}
              onViewAllIndices={() => {
                setActiveScreen('indices');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              watchlist={watchlist}
              onToggleWatchlist={toggleWatchlist}
              flashingIds={flashingIds}
            />

            {/* US Stocks Section (Exact match to screenshot) */}
            <StocksSection
              symbols={symbols}
              onSelectSymbol={(sym) => setSelectedSymbol(sym)}
              onViewAllStocks={(filter) => {
                setStockScreenerFilter(filter || 'all');
                setActiveScreen('stocks');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              watchlist={watchlist}
              onToggleWatchlist={toggleWatchlist}
              flashingIds={flashingIds}
            />

            {/* Crypto & Commodities/Forex Section (Exact match to screenshot) */}
            <CryptoAndFuturesSection
              symbols={symbols}
              onSelectSymbol={(sym) => setSelectedSymbol(sym)}
              onViewCrypto={() => {
                setActiveScreen('crypto');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onViewFutures={() => {
                setActiveScreen('futures');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              watchlist={watchlist}
              onToggleWatchlist={toggleWatchlist}
              flashingIds={flashingIds}
            />
          </>
        )}

        {/* Dedicated Screen 2: World Indices */}
        {activeScreen === 'indices' && (
          <WorldIndicesView
            symbols={symbols}
            onSelectSymbol={(sym) => setSelectedSymbol(sym)}
            onBack={() => setActiveScreen('markets')}
            watchlist={watchlist}
            onToggleWatchlist={toggleWatchlist}
            flashingIds={flashingIds}
          />
        )}

        {/* Dedicated Screen 3: US Stocks Screener */}
        {activeScreen === 'stocks' && (
          <StocksScreenerView
            symbols={symbols}
            onSelectSymbol={(sym) => setSelectedSymbol(sym)}
            onBack={() => setActiveScreen('markets')}
            watchlist={watchlist}
            onToggleWatchlist={toggleWatchlist}
            flashingIds={flashingIds}
            initialFilter={stockScreenerFilter}
          />
        )}

        {/* Dedicated Screen 4: Crypto & FX Screener */}
        {(activeScreen === 'crypto' || activeScreen === 'futures') && (
          <CryptoAndFXView
            symbols={symbols}
            onSelectSymbol={(sym) => setSelectedSymbol(sym)}
            onBack={() => setActiveScreen('markets')}
            watchlist={watchlist}
            onToggleWatchlist={toggleWatchlist}
            flashingIds={flashingIds}
          />
        )}
      </main>

      {/* Global Interactive TradingView Chart Modal */}
      <ChartModal
        symbol={selectedSymbol}
        onClose={() => setSelectedSymbol(null)}
        isFavorited={selectedSymbol ? watchlist.includes(selectedSymbol.id) : false}
        onToggleWatchlist={toggleWatchlist}
      />

      {/* Quick Search Modal (Ctrl+K) */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        symbols={symbols}
        onSelectSymbol={(sym) => setSelectedSymbol(sym)}
        watchlist={watchlist}
        onToggleWatchlist={toggleWatchlist}
      />

      {/* Slide-over Watchlist Drawer */}
      <WatchlistDrawer
        isOpen={watchlistOpen}
        onClose={() => setWatchlistOpen(false)}
        symbols={symbols}
        watchlistIds={watchlist}
        onSelectSymbol={(sym) => setSelectedSymbol(sym)}
        onRemoveFromWatchlist={toggleWatchlist}
        onOpenSearch={() => setSearchOpen(true)}
        flashingIds={flashingIds}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
