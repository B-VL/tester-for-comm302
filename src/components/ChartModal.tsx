import React, { useState, useRef } from 'react';
import { SymbolItem } from '../types/market';
import { X, Star, Maximize2, Share2, TrendingUp, TrendingDown, Layers, BarChart } from 'lucide-react';

interface ChartModalProps {
  symbol: SymbolItem | null;
  onClose: () => void;
  isFavorited: boolean;
  onToggleWatchlist: (id: string) => void;
}

export const ChartModal: React.FC<ChartModalProps> = ({
  symbol,
  onClose,
  isFavorited,
  onToggleWatchlist,
}) => {
  if (!symbol) return null;

  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '6M' | '1Y' | 'ALL'>('1D');
  const [chartType, setChartType] = useState<'area' | 'candles'>('area');
  const [showSMA, setShowSMA] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const points = symbol.history[timeframe] || symbol.history['1D'];
  const isUp = symbol.change >= 0;

  // Compute min and max for chart scaling
  const prices = points.map((p) => p.price);
  const minPrice = Math.min(...prices) * 0.998;
  const maxPrice = Math.max(...prices) * 1.002;
  const priceRange = maxPrice - minPrice || 1;

  // Dimensions for SVG canvas
  const svgWidth = 800;
  const svgHeight = 320;
  const paddingX = 20;
  const paddingY = 25;
  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  // Calculate coordinates
  const coords = points.map((pt, i) => {
    const x = paddingX + (i / (points.length - 1)) * chartWidth;
    const y = paddingY + chartHeight - ((pt.price - minPrice) / priceRange) * chartHeight;
    return { x, y, pt };
  });

  // Calculate SMA(10) line
  const smaPoints = coords.map((c, i) => {
    const windowSize = 5;
    const start = Math.max(0, i - windowSize + 1);
    const subset = points.slice(start, i + 1);
    const avg = subset.reduce((acc, curr) => acc + curr.price, 0) / subset.length;
    const y = paddingY + chartHeight - ((avg - minPrice) / priceRange) * chartHeight;
    return { x: c.x, y };
  });

  const pathD = coords.reduce(
    (acc, c, i) => (i === 0 ? `M ${c.x} ${c.y}` : `${acc} L ${c.x} ${c.y}`),
    ''
  );

  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${paddingY + chartHeight} L ${coords[0].x} ${paddingY + chartHeight} Z`;

  const smaD = smaPoints.reduce(
    (acc, c, i) => (i === 0 ? `M ${c.x} ${c.y}` : `${acc} L ${c.x} ${c.y}`),
    ''
  );

  // Active hover point
  const activePt = hoverIndex !== null && coords[hoverIndex] ? coords[hoverIndex].pt : points[points.length - 1];

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, (mouseX - paddingX) / chartWidth));
    const idx = Math.round(ratio * (points.length - 1));
    setHoverIndex(idx);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-[#e0e3eb] flex flex-col">
        
        {/* Header bar */}
        <div className="p-4 sm:p-6 border-b border-[#f0f3fa] flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="w-10 h-10 rounded-xl text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0"
              style={{ backgroundColor: symbol.badgeBgColor || '#2962ff' }}
            >
              {symbol.badgeText || symbol.symbol.slice(0, 3)}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-[#131722]">{symbol.symbol}</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-[#6a6d78] uppercase font-mono">
                  {symbol.exchange}
                </span>
                {symbol.sector && (
                  <span className="text-xs text-[#787b86] hidden sm:inline">• {symbol.sector}</span>
                )}
              </div>
              <p className="text-xs text-[#6a6d78] mt-0.5">{symbol.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWatchlist(symbol.id)}
              className="p-2 rounded-full text-[#787b86] hover:bg-slate-100 transition-colors"
              title={isFavorited ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              <Star className={`w-5 h-5 ${isFavorited ? 'fill-amber-400 text-amber-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#787b86] hover:text-[#131722] hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current Price & Stats Banner */}
        <div className="px-4 sm:px-6 py-3 bg-[#f8f9fd] border-b border-[#f0f3fa] flex flex-wrap items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-[#131722] font-mono tabular-nums">
              ${activePt.price.toLocaleString('en-US', {
                minimumFractionDigits: activePt.price < 5 ? 4 : 2,
                maximumFractionDigits: activePt.price < 5 ? 4 : 2,
              })}
            </span>
            <div
              className={`flex items-center gap-1 text-sm font-bold font-mono tabular-nums ${
                isUp ? 'text-[#089981]' : 'text-[#f23645]'
              }`}
            >
              {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{isUp ? `+${symbol.change.toFixed(2)}` : symbol.change.toFixed(2)}</span>
              <span>({isUp ? `+${symbol.changePercent.toFixed(2)}%` : `${symbol.changePercent.toFixed(2)}%`})</span>
            </div>
            {hoverIndex !== null && (
              <span className="text-xs text-[#787b86] font-mono bg-white px-2 py-0.5 rounded border border-[#e0e3eb]">
                {activePt.time}
              </span>
            )}
          </div>

          {/* Timeframe selector tabs */}
          <div className="flex items-center gap-1 p-1 bg-white rounded-lg border border-[#e0e3eb]">
            {(['1D', '5D', '1M', '6M', '1Y', 'ALL'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  timeframe === tf
                    ? 'bg-[#131722] text-white shadow-xs'
                    : 'text-[#6a6d78] hover:text-[#131722] hover:bg-slate-100'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Toolbar */}
        <div className="px-4 sm:px-6 py-2 border-b border-[#f0f3fa] flex items-center justify-between text-xs text-[#6a6d78]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setChartType('area')}
                className={`px-2 py-1 rounded font-medium ${
                  chartType === 'area' ? 'text-[#2962ff] font-bold bg-[#eff6ff]' : 'hover:bg-slate-100'
                }`}
              >
                Area Line
              </button>
              <button
                onClick={() => setChartType('candles')}
                className={`px-2 py-1 rounded font-medium ${
                  chartType === 'candles' ? 'text-[#2962ff] font-bold bg-[#eff6ff]' : 'hover:bg-slate-100'
                }`}
              >
                Candlesticks
              </button>
            </div>

            <span className="text-slate-300">|</span>

            <button
              onClick={() => setShowSMA(!showSMA)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded ${
                showSMA ? 'text-amber-600 bg-amber-50 font-semibold' : 'text-slate-500'
              }`}
            >
              <span className="w-2 h-0.5 bg-amber-500 rounded"></span>
              SMA (10)
            </button>

            <button
              onClick={() => setShowVolume(!showVolume)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded ${
                showVolume ? 'text-[#2962ff] bg-blue-50 font-semibold' : 'text-slate-500'
              }`}
            >
              <BarChart className="w-3 h-3" />
              Volume
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-3 font-mono text-[11px]">
            <span>H: ${symbol.high.toFixed(2)}</span>
            <span>L: ${symbol.low.toFixed(2)}</span>
            <span>Vol: {symbol.volume}</span>
          </div>
        </div>

        {/* Interactive Chart Canvas */}
        <div className="p-4 sm:p-6 relative select-none">
          <svg
            className="w-full h-[280px] sm:h-[320px] cursor-crosshair overflow-visible"
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="none"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <defs>
              <linearGradient id="chartGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor={isUp ? '#089981' : '#f23645'} stopOpacity="0.25" />
                <stop offset="100%" stopColor={isUp ? '#089981' : '#f23645'} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
              const y = paddingY + chartHeight * pct;
              const pVal = maxPrice - pct * priceRange;
              return (
                <g key={idx}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={svgWidth - paddingX}
                    y2={y}
                    stroke="#f0f3fa"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={svgWidth - paddingX + 5}
                    y={y + 3}
                    fill="#787b86"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="start"
                  >
                    {pVal.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* Volume Histogram at bottom */}
            {showVolume &&
              points.map((pt, i) => {
                const x = paddingX + (i / (points.length - 1)) * chartWidth;
                const barWidth = Math.max(2, chartWidth / points.length - 2);
                const volHeight = Math.min(45, (pt.volume / 600000) * 40);
                const y = paddingY + chartHeight - volHeight;
                const isVolGreen = pt.close >= pt.open;

                return (
                  <rect
                    key={i}
                    x={x - barWidth / 2}
                    y={y}
                    width={barWidth}
                    height={volHeight}
                    fill={isVolGreen ? 'rgba(8, 153, 129, 0.2)' : 'rgba(242, 54, 69, 0.2)'}
                  />
                );
              })}

            {/* Area & Line */}
            {chartType === 'area' ? (
              <>
                <path d={areaD} fill="url(#chartGradient)" />
                <path
                  d={pathD}
                  fill="none"
                  stroke={isUp ? '#089981' : '#f23645'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </>
            ) : (
              /* Candlestick Rendering */
              points.map((pt, i) => {
                const x = paddingX + (i / (points.length - 1)) * chartWidth;
                const highY = paddingY + chartHeight - ((pt.high - minPrice) / priceRange) * chartHeight;
                const lowY = paddingY + chartHeight - ((pt.low - minPrice) / priceRange) * chartHeight;
                const openY = paddingY + chartHeight - ((pt.open - minPrice) / priceRange) * chartHeight;
                const closeY = paddingY + chartHeight - ((pt.close - minPrice) / priceRange) * chartHeight;
                const isGreen = pt.close >= pt.open;
                const candleWidth = Math.max(3, chartWidth / points.length - 3);

                return (
                  <g key={i}>
                    <line
                      x1={x}
                      y1={highY}
                      x2={x}
                      y2={lowY}
                      stroke={isGreen ? '#089981' : '#f23645'}
                      strokeWidth="1.2"
                    />
                    <rect
                      x={x - candleWidth / 2}
                      y={Math.min(openY, closeY)}
                      width={candleWidth}
                      height={Math.max(2, Math.abs(closeY - openY))}
                      fill={isGreen ? '#089981' : '#f23645'}
                    />
                  </g>
                );
              })
            )}

            {/* SMA Line */}
            {showSMA && (
              <path
                d={smaD}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
            )}

            {/* Crosshair Cursor */}
            {hoverIndex !== null && coords[hoverIndex] && (
              <g>
                {/* Vertical hair */}
                <line
                  x1={coords[hoverIndex].x}
                  y1={paddingY}
                  x2={coords[hoverIndex].x}
                  y2={paddingY + chartHeight}
                  stroke="#2962ff"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                {/* Horizontal hair */}
                <line
                  x1={paddingX}
                  y1={coords[hoverIndex].y}
                  x2={svgWidth - paddingX}
                  y2={coords[hoverIndex].y}
                  stroke="#2962ff"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                {/* Dot */}
                <circle
                  cx={coords[hoverIndex].x}
                  cy={coords[hoverIndex].y}
                  r="5"
                  fill="#2962ff"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </g>
            )}
          </svg>
        </div>

        {/* Key Metrics Grid */}
        <div className="p-4 sm:p-6 border-t border-[#f0f3fa] bg-slate-50/50">
          <h4 className="text-xs font-bold text-[#131722] uppercase tracking-wider mb-3">
            Key Statistics & Financials
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium">
            <div className="bg-white p-3 rounded-xl border border-[#e0e3eb]">
              <span className="text-[#6a6d78] block">Previous Close</span>
              <span className="text-sm font-bold text-[#131722] font-mono tabular-nums">
                ${symbol.prevClose.toFixed(2)}
              </span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#e0e3eb]">
              <span className="text-[#6a6d78] block">Day's Range</span>
              <span className="text-sm font-bold text-[#131722] font-mono tabular-nums">
                ${symbol.low.toFixed(2)} - ${symbol.high.toFixed(2)}
              </span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#e0e3eb]">
              <span className="text-[#6a6d78] block">52-Week Range</span>
              <span className="text-sm font-bold text-[#131722] font-mono tabular-nums">
                ${symbol.week52Low.toFixed(2)} - ${symbol.week52High.toFixed(2)}
              </span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#e0e3eb]">
              <span className="text-[#6a6d78] block">Volume (24H)</span>
              <span className="text-sm font-bold text-[#131722] font-mono tabular-nums">
                {symbol.volume}
              </span>
            </div>
            {symbol.marketCap && (
              <div className="bg-white p-3 rounded-xl border border-[#e0e3eb]">
                <span className="text-[#6a6d78] block">Market Cap</span>
                <span className="text-sm font-bold text-[#131722] font-mono tabular-nums">
                  {symbol.marketCap}
                </span>
              </div>
            )}
            {symbol.peRatio && (
              <div className="bg-white p-3 rounded-xl border border-[#e0e3eb]">
                <span className="text-[#6a6d78] block">P/E Ratio</span>
                <span className="text-sm font-bold text-[#131722] font-mono tabular-nums">
                  {symbol.peRatio.toFixed(1)}
                </span>
              </div>
            )}
            <div className="bg-white p-3 rounded-xl border border-[#e0e3eb]">
              <span className="text-[#6a6d78] block">Asset Class</span>
              <span className="text-sm font-bold text-[#131722] capitalize">
                {symbol.category}
              </span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#e0e3eb]">
              <span className="text-[#6a6d78] block">Exchange</span>
              <span className="text-sm font-bold text-[#131722]">
                {symbol.exchange}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mt-4 bg-white p-4 rounded-xl border border-[#e0e3eb]">
            <span className="text-xs font-bold text-[#131722] block mb-1">About {symbol.name}</span>
            <p className="text-xs text-[#6a6d78] leading-relaxed">
              {symbol.description}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
