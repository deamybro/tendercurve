import React from 'react';
import { ArrowRight, AlertTriangle, ShieldCheck, Activity, TrendingUp, TrendingDown, Wifi, WifiOff } from 'lucide-react';

export default function Screen1Landing({ stocks, selectedStock, onSelectStock, onProceed, apiLive }) {
  // FIX 3: One-click card action — selecting navigates immediately
  const handleCardClick = (stock) => {
    onSelectStock(stock);
    onProceed();
  };

  return (
    <section className="screen-wrapper" aria-labelledby="screen-1-heading">
      <div className="screen-header">
        <h1 id="screen-1-heading" className="screen-title">
          Equity-Grade Price Discovery for Pre-IPO Stocks
        </h1>
        <p className="screen-subtitle">
          Think of TenderCurve like <strong>stairs instead of a cliff</strong> — prices can only rise as the company hits real valuation milestones, stopping whales from pumping and dumping.
        </p>
      </div>

      {/* Compact Side-by-Side Thesis — shrunk to keep stock grid above fold */}
      <div className="problem-vs-solution-hero" style={{ marginBottom: '24px' }}>
        <div className="hero-card bad" style={{ padding: '16px 20px' }}>
          <div className="hero-card-header" style={{ marginBottom: '8px' }}>
            <div className="hero-card-title" style={{ fontSize: '16px' }}>
              <AlertTriangle size={16} color="var(--red-accent)" />
              Memecoin Curve
            </div>
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--red-accent)' }}>
              Pump.fun Style
            </span>
          </div>

          <svg className="hero-svg-preview" viewBox="0 0 300 65" preserveAspectRatio="none" style={{ height: '55px', marginBottom: '8px' }}>
            <defs>
              <linearGradient id="badGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M 10 52 Q 60 48 90 40 L 120 10 L 140 48 L 190 55 L 290 58" fill="none" stroke="#ef4444" strokeWidth="2.5" />
            <path d="M 10 52 Q 60 48 90 40 L 120 10 L 140 48 L 190 55 L 290 58 L 290 65 L 10 65 Z" fill="url(#badGrad)" />
            <circle cx="120" cy="10" r="3" fill="#ef4444" />
            <text x="128" y="15" fill="#fca5a5" fontSize="9" fontFamily="sans-serif">+280% spike → -88% crash</text>
          </svg>

          <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            <span className="icon-bad" style={{ color: 'var(--red-accent)' }}>✕</span> Whales pump 5x, dump on retail, no valuation anchor
          </div>
        </div>

        <div className="hero-card good" style={{ padding: '16px 20px' }}>
          <div className="hero-card-header" style={{ marginBottom: '8px' }}>
            <div className="hero-card-title" style={{ fontSize: '16px' }}>
              <ShieldCheck size={16} color="var(--emerald-primary)" />
              TenderCurve
            </div>
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--emerald-primary)' }}>
              Meteora Multi-Segment DBC
            </span>
          </div>

          <svg className="hero-svg-preview" viewBox="0 0 300 65" preserveAspectRatio="none" style={{ height: '55px', marginBottom: '8px' }}>
            <defs>
              <linearGradient id="goodGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M 10 52 L 80 52 L 80 38 L 150 38 L 150 24 L 220 24 L 220 12 L 290 12" fill="none" stroke="#10b981" strokeWidth="2.5" />
            <path d="M 10 52 L 80 52 L 80 38 L 150 38 L 150 24 L 220 24 L 220 12 L 290 12 L 290 65 L 10 65 Z" fill="url(#goodGrad)" />
            <text x="22" y="47" fill="#6ee7b7" fontSize="8" fontFamily="sans-serif">Funding</text>
            <text x="95" y="33" fill="#6ee7b7" fontSize="8" fontFamily="sans-serif">Tender</text>
            <text x="160" y="20" fill="#6ee7b7" fontSize="8" fontFamily="sans-serif">Secondary</text>
            <text x="230" y="9" fill="#6ee7b7" fontSize="8" fontFamily="sans-serif">IPO</text>
          </svg>

          <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            <span className="icon-good" style={{ color: 'var(--emerald-primary)' }}>✓</span> Stepped bands anchored to real funding rounds, 90% locked LP
          </div>
        </div>
      </div>

      {/* PreStocks Asset Selection */}
      <div className="assets-section-title">
        <div className="assets-heading">
          <Activity size={20} color="var(--emerald-primary)" />
          Select a Pre-IPO Stock to Configure
        </div>
        {/* FIX 5: Honest API status indicator */}
        <div className="api-status-pill" style={apiLive ? {} : { background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
          {apiLive ? (
            <>
              <span className="pulse-dot"></span>
              <Wifi size={12} />
              PreStocks API Live (8 Assets)
            </>
          ) : (
            <>
              <span className="pulse-dot" style={{ background: 'var(--amber-accent)', boxShadow: '0 0 8px var(--amber-accent)' }}></span>
              <WifiOff size={12} style={{ color: 'var(--amber-accent)' }} />
              <span style={{ color: 'var(--amber-accent)' }}>Cached Snapshot Mode</span>
            </>
          )}
        </div>
      </div>

      <div className="assets-grid">
        {stocks.map((stock) => {
          const isSelected = selectedStock?.symbol === stock.symbol;
          return (
            <div
              key={stock.symbol}
              id={`stock-card-${stock.symbol.toLowerCase()}`}
              className={`stock-card ${isSelected ? 'selected' : ''}`}
              onClick={() => handleCardClick(stock)}
              style={{ cursor: 'pointer' }}
            >
              <div className="stock-card-top">
                <div className="stock-info-main">
                  <span className="stock-name">{stock.name.replace(' PreStocks', '')}</span>
                  <span className="stock-symbol">${stock.symbol}</span>
                </div>
                <span className={`discount-badge ${stock.isDiscount ? 'discount' : 'premium'}`}>
                  {stock.isDiscount ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <TrendingDown size={11} /> {Math.abs(stock.diffPct)}% Discount
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <TrendingUp size={11} /> +{stock.diffPct}% Premium
                    </span>
                  )}
                </span>
              </div>

              <div className="stock-pricing-row">
                <div>
                  <div className="price-item-label">OTC Mark Price</div>
                  <div className="price-item-val">${stock.markPrice}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="price-item-label">On-Chain DEX</div>
                  <div className="price-item-val" style={{ color: stock.isDiscount ? 'var(--emerald-primary)' : '#fff' }}>
                    ${stock.tokenPrice}
                  </div>
                </div>
              </div>

              <div className="stock-round-info">
                <strong>Valuation:</strong> {stock.formattedVal} • {stock.lastRound}
              </div>

              <button
                id={`btn-configure-${stock.symbol.toLowerCase()}`}
                className="stock-select-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(stock);
                }}
              >
                Configure TenderCurve →
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
