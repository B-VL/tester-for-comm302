import React, { useState } from 'react';
import { X, CheckCircle, Shield, AlertTriangle } from 'lucide-react';

export const Footer: React.FC = () => {
  const [modalType, setModalType] = useState<'terms' | 'privacy' | 'disclaimers' | 'status' | null>(null);

  return (
    <>
      <footer className="border-t border-[#e0e3eb] bg-slate-50 mt-16 py-10 text-xs text-[#6a6d78]">
        <div className="max-w-[1360px] w-full mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-5 text-black" fill="currentColor" viewBox="0 0 36 28">
              <path d="M14 22H7V6h7v16zm15 0h-7V0h7v22zM0 22h4.5V11H0v11z"></path>
              <rect fill="currentColor" height="4" rx="2" width="36" x="0" y="24"></rect>
            </svg>
            <span>© 2025 TradingView. Look first / Then leap.</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <button
              onClick={() => setModalType('terms')}
              className="hover:text-[#131722] transition-colors cursor-pointer"
            >
              Terms of use
            </button>
            <button
              onClick={() => setModalType('privacy')}
              className="hover:text-[#131722] transition-colors cursor-pointer"
            >
              Privacy policy
            </button>
            <button
              onClick={() => setModalType('disclaimers')}
              className="hover:text-[#131722] transition-colors cursor-pointer"
            >
              Disclaimers
            </button>
            <button
              onClick={() => setModalType('status')}
              className="hover:text-[#131722] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-[#089981]"></span>
              <span>Status</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Info Modals */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-[#e0e3eb]">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 text-[#787b86] hover:text-[#131722] p-1 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {modalType === 'status' && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-6 h-6 text-[#089981]" />
                  <h3 className="text-lg font-bold text-[#131722]">All Systems Operational</h3>
                </div>
                <div className="space-y-2 text-xs text-[#6a6d78] mt-4">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span>US Equity Feeds (NASDAQ / NYSE)</span>
                    <span className="text-[#089981] font-bold">100.0% Uptime</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span>European & Global Index Providers</span>
                    <span className="text-[#089981] font-bold">Operational</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span>Crypto Real-time Stream & Futures</span>
                    <span className="text-[#089981] font-bold">Operational</span>
                  </div>
                </div>
              </div>
            )}

            {modalType === 'disclaimers' && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                  <h3 className="text-lg font-bold text-[#131722]">Market Data Disclaimers</h3>
                </div>
                <p className="text-xs text-[#6a6d78] leading-relaxed">
                  Market quotes, charts, and news are provided for informational purposes only and are not intended for trading or investment advice. Neither TradingView nor its data partners shall be liable for any errors or delays in quotes, or for any actions taken in reliance thereon.
                </p>
              </div>
            )}

            {modalType === 'terms' && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-6 h-6 text-[#2962ff]" />
                  <h3 className="text-lg font-bold text-[#131722]">Terms of Use</h3>
                </div>
                <p className="text-xs text-[#6a6d78] leading-relaxed">
                  By accessing and using this market platform, you agree to comply with standard financial data fair-use guidelines and analytical publishing standards.
                </p>
              </div>
            )}

            {modalType === 'privacy' && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-6 h-6 text-[#2962ff]" />
                  <h3 className="text-lg font-bold text-[#131722]">Privacy Policy</h3>
                </div>
                <p className="text-xs text-[#6a6d78] leading-relaxed">
                  We respect trader privacy. Custom watchlists and indicator preferences are stored locally in your browser session and never sold to third-party data brokers.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
