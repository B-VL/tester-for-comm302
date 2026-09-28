import React, { useState } from 'react';
import { Search, Globe, User, Bookmark, Menu, X, Play, Pause, ExternalLink } from 'lucide-react';
import { ActiveScreen } from '../types/market';

interface NavbarProps {
  activeScreen: ActiveScreen;
  onSelectScreen: (screen: ActiveScreen) => void;
  onOpenSearch: () => void;
  onOpenWatchlist: () => void;
  watchlistCount: number;
  isSimulating: boolean;
  onToggleSimulation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeScreen,
  onSelectScreen,
  onOpenSearch,
  onOpenWatchlist,
  watchlistCount,
  isSimulating,
  onToggleSimulation,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');
  const [profileOpen, setProfileOpen] = useState(false);
  const [getStartedOpen, setGetStartedOpen] = useState(false);

  const languages = [
    { code: 'EN', name: 'English (US)' },
    { code: 'ES', name: 'Español' },
    { code: 'DE', name: 'Deutsch' },
    { code: 'FR', name: 'Français' },
    { code: 'JA', name: '日本語' },
    { code: 'ZH', name: '简体中文' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#f0f3fa] h-[64px] flex items-center px-4 lg:px-8 transition-all">
        <div className="max-w-[1360px] w-full mx-auto flex items-center justify-between gap-4">
          
          {/* Left side: TradingView Logo and Search Pill */}
          <div className="flex items-center gap-5 md:gap-6">
            {/* TV Logo Mark */}
            <button
              onClick={() => onSelectScreen('markets')}
              aria-label="TradingView Home"
              className="flex items-center gap-2 group cursor-pointer focus:outline-none"
            >
              <svg
                className="w-9 h-7 text-black transition-transform group-hover:scale-105"
                fill="currentColor"
                viewBox="0 0 36 28"
              >
                <path d="M14 22H7V6h7v16zm15 0h-7V0h7v22zM0 22h4.5V11H0v11z"></path>
                <rect fill="currentColor" height="4" rx="2" width="36" x="0" y="24"></rect>
              </svg>
            </button>

            {/* Global Search Input Pill */}
            <div className="relative w-52 md:w-64 lg:w-72 hidden sm:block">
              <button
                type="button"
                onClick={onOpenSearch}
                className="w-full flex items-center justify-between px-3.5 py-1.5 bg-[#f0f3fa] hover:bg-[#e4e7f0] rounded-full text-sm text-[#6a6d78] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-[#787b86] group-hover:text-black transition-colors" />
                  <span className="text-xs md:text-sm font-medium">Search markets, stocks...</span>
                </div>
                <kbd className="text-[11px] font-semibold bg-white/80 px-1.5 py-0.5 rounded border border-black/5 text-[#787b86] shadow-2xs">
                  Ctrl+K
                </kbd>
              </button>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[15px] font-medium text-[#131722]">
            <button
              onClick={() => onSelectScreen('markets')}
              className={`transition-colors py-2 cursor-pointer relative ${
                activeScreen === 'markets'
                  ? 'text-[#2962ff] font-semibold after:absolute after:bottom-[-16px] after:left-0 after:right-0 after:h-[2.5px] after:bg-[#2962ff] after:rounded-full'
                  : 'text-[#131722] hover:text-[#2962ff]'
              }`}
            >
              Markets
            </button>
            <button
              onClick={() => onSelectScreen('indices')}
              className={`transition-colors py-2 cursor-pointer relative ${
                activeScreen === 'indices'
                  ? 'text-[#2962ff] font-semibold after:absolute after:bottom-[-16px] after:left-0 after:right-0 after:h-[2.5px] after:bg-[#2962ff] after:rounded-full'
                  : 'text-[#131722] hover:text-[#2962ff]'
              }`}
            >
              Indices
            </button>
            <button
              onClick={() => onSelectScreen('stocks')}
              className={`transition-colors py-2 cursor-pointer relative ${
                activeScreen === 'stocks'
                  ? 'text-[#2962ff] font-semibold after:absolute after:bottom-[-16px] after:left-0 after:right-0 after:h-[2.5px] after:bg-[#2962ff] after:rounded-full'
                  : 'text-[#131722] hover:text-[#2962ff]'
              }`}
            >
              US Stocks
            </button>
            <button
              onClick={() => onSelectScreen('crypto')}
              className={`transition-colors py-2 cursor-pointer relative ${
                activeScreen === 'crypto'
                  ? 'text-[#2962ff] font-semibold after:absolute after:bottom-[-16px] after:left-0 after:right-0 after:h-[2.5px] after:bg-[#2962ff] after:rounded-full'
                  : 'text-[#131722] hover:text-[#2962ff]'
              }`}
            >
              Crypto
            </button>
            <button
              onClick={() => onSelectScreen('futures')}
              className={`transition-colors py-2 cursor-pointer relative ${
                activeScreen === 'futures'
                  ? 'text-[#2962ff] font-semibold after:absolute after:bottom-[-16px] after:left-0 after:right-0 after:h-[2.5px] after:bg-[#2962ff] after:rounded-full'
                  : 'text-[#131722] hover:text-[#2962ff]'
              }`}
            >
              Futures & FX
            </button>
          </nav>

          {/* Right side controls */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Live Feed Play/Pause toggle */}
            <button
              onClick={onToggleSimulation}
              title={isSimulating ? 'Pause live market ticks' : 'Resume live market ticks'}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-[#f0f3fa] hover:bg-[#e4e7f0] text-[#434651] transition-colors"
            >
              {isSimulating ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#089981] animate-pulse"></span>
                  <span className="font-mono text-[11px]">LIVE</span>
                  <Pause className="w-3 h-3 text-[#787b86]" />
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  <span className="font-mono text-[11px] text-[#787b86]">PAUSED</span>
                  <Play className="w-3 h-3 text-[#089981]" />
                </>
              )}
            </button>

            {/* Watchlist button with badge */}
            <button
              onClick={onOpenWatchlist}
              aria-label="Open Watchlist"
              className="relative p-2 text-[#434651] hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              title="View Watchlist"
            >
              <Bookmark className="w-5 h-5" />
              {watchlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#2962ff] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {watchlistCount}
                </span>
              )}
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLanguageOpen(!languageOpen)}
                aria-label="Change language"
                className="flex items-center gap-1.5 text-sm font-semibold text-[#131722] hover:bg-slate-100 py-1.5 px-2.5 rounded-full transition-colors cursor-pointer"
              >
                <Globe className="w-4 h-4 text-[#434651]" />
                <span className="text-xs font-bold uppercase tracking-wider">{currentLang}</span>
              </button>

              {languageOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-[#e0e3eb] rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in">
                  <div className="px-3 py-1 text-[11px] font-bold text-[#6a6d78] uppercase border-b border-[#f0f3fa]">
                    Select Language
                  </div>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCurrentLang(lang.code);
                        setLanguageOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-[#f0f3fa] transition-colors ${
                        currentLang === lang.code ? 'text-[#2962ff] font-bold bg-[#f0f3fa]' : 'text-[#131722]'
                      }`}
                    >
                      <span>{lang.name}</span>
                      <span className="text-[10px] text-[#787b86] font-mono">{lang.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                aria-label="Account profile"
                className="p-2 text-[#434651] hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <User className="w-5 h-5" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#e0e3eb] rounded-xl shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-[#f0f3fa]">
                    <p className="text-xs font-bold text-[#131722]">Guest Trader</p>
                    <p className="text-[11px] text-[#6a6d78]">Free Basic Plan</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onOpenWatchlist();
                        setProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#131722] hover:bg-[#f0f3fa] flex items-center justify-between"
                    >
                      <span>My Watchlist</span>
                      <span className="text-[11px] text-[#6a6d78] font-mono">{watchlistCount} symbols</span>
                    </button>
                    <button
                      onClick={() => {
                        onOpenSearch();
                        setProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#131722] hover:bg-[#f0f3fa]"
                    >
                      Symbol Search
                    </button>
                    <button
                      onClick={() => {
                        onToggleSimulation();
                        setProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#131722] hover:bg-[#f0f3fa]"
                    >
                      Toggle Live Price Simulation
                    </button>
                  </div>
                  <div className="pt-1 border-t border-[#f0f3fa]">
                    <button
                      onClick={() => {
                        setGetStartedOpen(true);
                        setProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-[#2962ff] hover:bg-[#eff6ff]"
                    >
                      Upgrade to TradingView Pro
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Vibrant CTA Button */}
            <button
              onClick={() => setGetStartedOpen(true)}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#0052ff] to-[#7928ca] hover:opacity-95 shadow-sm transition-all transform active:scale-95 cursor-pointer whitespace-nowrap"
            >
              Get started
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#434651] hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-[64px] left-0 right-0 bg-white border-b border-[#e0e3eb] shadow-xl p-4 flex flex-col gap-3 z-50">
            <button
              onClick={() => {
                onOpenSearch();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#f0f3fa] rounded-xl text-sm text-[#6a6d78]"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Search markets & tickers
              </span>
              <kbd className="text-[11px] bg-white px-2 py-0.5 rounded border border-black/5 font-mono">Ctrl+K</kbd>
            </button>

            <div className="flex flex-col gap-1 pt-2">
              <button
                onClick={() => {
                  onSelectScreen('markets');
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  activeScreen === 'markets' ? 'bg-[#eff6ff] text-[#2962ff] font-bold' : 'text-[#131722]'
                }`}
              >
                Markets Overview
              </button>
              <button
                onClick={() => {
                  onSelectScreen('indices');
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  activeScreen === 'indices' ? 'bg-[#eff6ff] text-[#2962ff] font-bold' : 'text-[#131722]'
                }`}
              >
                World Indices
              </button>
              <button
                onClick={() => {
                  onSelectScreen('stocks');
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  activeScreen === 'stocks' ? 'bg-[#eff6ff] text-[#2962ff] font-bold' : 'text-[#131722]'
                }`}
              >
                US Stocks Screener
              </button>
              <button
                onClick={() => {
                  onSelectScreen('crypto');
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  activeScreen === 'crypto' ? 'bg-[#eff6ff] text-[#2962ff] font-bold' : 'text-[#131722]'
                }`}
              >
                Crypto & DeFi
              </button>
              <button
                onClick={() => {
                  onSelectScreen('futures');
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  activeScreen === 'futures' ? 'bg-[#eff6ff] text-[#2962ff] font-bold' : 'text-[#131722]'
                }`}
              >
                Futures & Currencies
              </button>
              <button
                onClick={() => {
                  onOpenWatchlist();
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg text-sm font-medium text-[#131722] flex items-center justify-between"
              >
                <span>My Watchlist</span>
                <span className="px-2 py-0.5 text-xs bg-slate-100 rounded-full font-mono font-bold">
                  {watchlistCount}
                </span>
              </button>
            </div>

            <button
              onClick={() => {
                setGetStartedOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl text-center text-sm font-semibold text-white bg-gradient-to-r from-[#0052ff] to-[#7928ca] mt-2 shadow-sm"
            >
              Get started free
            </button>
          </div>
        )}
      </header>

      {/* Get Started / Sign Up Modal */}
      {getStartedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-[#e0e3eb]">
            <button
              onClick={() => setGetStartedOpen(false)}
              className="absolute top-4 right-4 text-[#787b86] hover:text-[#131722] p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-8 h-6 text-black" fill="currentColor" viewBox="0 0 36 28">
                <path d="M14 22H7V6h7v16zm15 0h-7V0h7v22zM0 22h4.5V11H0v11z"></path>
                <rect fill="currentColor" height="4" rx="2" width="36" x="0" y="24"></rect>
              </svg>
              <h3 className="text-xl font-black text-[#131722]">Join 60M+ Traders</h3>
            </div>
            <p className="text-xs text-[#6a6d78] mb-6">
              Track global markets, chart advanced multi-timeframe securities, and unlock institutional indicators.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Welcome to TradingView Pro! Real-time alerts and streaming data are active.');
                setGetStartedOpen(false);
              }}
              className="space-y-3.5"
            >
              <div>
                <label className="block text-xs font-semibold text-[#131722] mb-1">Email address</label>
                <input
                  type="email"
                  required
                  placeholder="trader@example.com"
                  className="w-full px-3.5 py-2.5 border border-[#e0e3eb] rounded-xl text-sm focus:outline-none focus:border-[#2962ff] focus:ring-1 focus:ring-[#2962ff]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#131722] mb-1">Create Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 border border-[#e0e3eb] rounded-xl text-sm focus:outline-none focus:border-[#2962ff] focus:ring-1 focus:ring-[#2962ff]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#0052ff] to-[#7928ca] shadow hover:opacity-95 transition-opacity"
              >
                Create Free Account
              </button>
            </form>
            <p className="text-[11px] text-[#787b86] text-center mt-4">
              By joining you agree to TradingView's Terms of Use & Privacy Policy.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
