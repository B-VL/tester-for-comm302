import React, { useState } from 'react';
import { ChevronDown, Check, TrendingUp, Activity, BarChart2 } from 'lucide-react';

interface HeroHeaderProps {
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({
  selectedRegion,
  onSelectRegion,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const regions = [
    { id: 'Everywhere', label: 'Markets, everywhere', tag: 'Global Macro' },
    { id: 'Americas', label: 'Markets, Americas', tag: 'NYSE • NASDAQ • TSX' },
    { id: 'Europe', label: 'Markets, Europe', tag: 'LSE • DAX • Euronext' },
    { id: 'Asia-Pacific', label: 'Markets, Asia-Pacific', tag: 'TSE • HKEX • SSE' },
  ];

  const currentLabel = regions.find((r) => r.id === selectedRegion)?.label || 'Markets, everywhere';

  return (
    <div className="flex flex-col items-center justify-center text-center pt-2 pb-6 relative">
      <div className="relative inline-block">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          aria-expanded={dropdownOpen}
          className="inline-flex items-center gap-3 cursor-pointer group select-none text-left focus:outline-none"
        >
          <h1 className="text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight text-[#131722] group-hover:text-black transition-colors">
            {currentLabel}
          </h1>
          <div className="p-1 rounded-full group-hover:bg-slate-100 transition-colors mt-1">
            <svg
              className={`w-7 h-7 text-[#131722] transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </div>
        </button>

        {/* Region selection dropdown */}
        {dropdownOpen && (
          <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-72 bg-white border border-[#e0e3eb] rounded-2xl shadow-2xl py-2 z-30 animate-in fade-in zoom-in-95 text-left">
            <div className="px-4 py-2 border-b border-[#f0f3fa] text-[11px] font-bold text-[#6a6d78] uppercase tracking-wider">
              Select Market View
            </div>
            {regions.map((reg) => (
              <button
                key={reg.id}
                onClick={() => {
                  onSelectRegion(reg.id);
                  setDropdownOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-[#f8f9fd] transition-colors flex items-center justify-between cursor-pointer ${
                  selectedRegion === reg.id ? 'bg-[#f0f3fa] font-bold text-[#2962ff]' : 'text-[#131722]'
                }`}
              >
                <div>
                  <div className="text-sm font-semibold">{reg.label}</div>
                  <div className="text-[11px] text-[#787b86]">{reg.tag}</div>
                </div>
                {selectedRegion === reg.id && <Check className="w-4 h-4 text-[#2962ff]" />}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-[#6a6d78] mt-2 text-sm md:text-base font-medium max-w-xl">
        Real-time market insights, global economic indexes, and trending securities.
      </p>

      {/* Subtle market context pills */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs text-[#787b86]">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-[#089981]" />
          <span>VIX: <strong className="text-[#131722] font-mono">15.24</strong> (-2.18%)</span>
        </div>
        <span className="hidden sm:inline text-slate-300">•</span>
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-[#2962ff]" />
          <span>Market Breadth: <strong className="text-[#089981] font-mono">68% Advancing</strong></span>
        </div>
        <span className="hidden sm:inline text-slate-300">•</span>
        <div className="flex items-center gap-1.5">
          <BarChart2 className="w-3.5 h-3.5 text-purple-600" />
          <span>Fear & Greed: <strong className="text-[#131722]">64 (Greed)</strong></span>
        </div>
      </div>
    </div>
  );
};
