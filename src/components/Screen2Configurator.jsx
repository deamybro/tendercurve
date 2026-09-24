import React, { useState, useMemo } from 'react';
import { ArrowRight, ArrowLeft, Sliders, Shield, Zap, Info, TrendingUp, Check } from 'lucide-react';
import { generateMultiSegmentPoints } from '../services/curveSimulator.js';

export default function Screen2Configurator({ stock, onProceed, onBack, initialSegments, onUpdateSegments }) {
  const [activePreset, setActivePreset] = useState('conservative');
  const [segments, setSegments] = useState(initialSegments);
  
  const [feeSettings, setFeeSettings] = useState({
    buyFeeBps: 50, // 0.5%
    sellFeeBps: 500, // 5.0%
    decayDays: 7,
    rateLimitPct: 5.0
  });

  // Handle Preset Switching
  const handlePresetChange = (presetKey) => {
    setActivePreset(presetKey);
    let updated;
    if (presetKey === 'conservative') {
      updated = [
        { ...segments[0], liquidity: 800000 },
        { ...segments[1], liquidity: 400000 },
        { ...segments[2], liquidity: 150000 },
        { ...segments[3], liquidity: 200000 }
      ];
      setFeeSettings(prev => ({ ...prev, sellFeeBps: 500, rateLimitPct: 5.0 }));
    } else if (presetKey === 'balanced') {
      updated = [
        { ...segments[0], liquidity: 550000 },
        { ...segments[1], liquidity: 350000 },
        { ...segments[2], liquidity: 200000 },
        { ...segments[3], liquidity: 250000 }
      ];
      setFeeSettings(prev => ({ ...prev, sellFeeBps: 400, rateLimitPct: 7.5 }));
    } else { // aggressive
      updated = [
        { ...segments[0], liquidity: 350000 },
        { ...segments[1], liquidity: 280000 },
        { ...segments[2], liquidity: 220000 },
        { ...segments[3], liquidity: 300000 }
      ];
      setFeeSettings(prev => ({ ...prev, sellFeeBps: 300, rateLimitPct: 10.0 }));
    }
    setSegments(updated);
    onUpdateSegments(updated);
  };

  const handleLiquidityChange = (index, value) => {
    const updated = [...segments];
    updated[index] = { ...updated[index], liquidity: Number(value) };
    setSegments(updated);
    onUpdateSegments(updated);
  };

  // Generate dynamic curve points
  const curveData = useMemo(() => {
    return generateMultiSegmentPoints(segments);
  }, [segments]);

  // Compute SVG coordinates
  const svgCoords = useMemo(() => {
    const pts = curveData.points;
    if (!pts || pts.length === 0) return '';
    const minQuote = 0;
    const maxQuote = curveData.totalQuote || 1;
    const minPrice = segments[0].startPrice * 0.95;
    const maxPrice = segments[segments.length - 1].endPrice * 1.05;

    const width = 500;
    const height = 260;

    const pathString = pts.map((p, i) => {
      const x = 30 + (p.quote / maxQuote) * (width - 50);
      const y = height - 20 - ((p.price - minPrice) / (maxPrice - minPrice)) * (height - 40);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');

    return {
      path: pathString,
      minPrice: Math.round(minPrice),
      maxPrice: Math.round(maxPrice),
      totalQuote: Math.round(maxQuote)
    };
  }, [curveData, segments]);

  return (
    <section className="screen-wrapper" aria-labelledby="screen-2-heading">
      <div className="screen-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 id="screen-2-heading" className="screen-title">
            Valuation Bands & Curve Studio
          </h1>
          <p className="screen-subtitle">
            Configure Meteora DBC's multi-segment Universal Curve for <strong>{stock.name.replace(' PreStocks', '')}</strong> (${stock.symbol}) anchored to the <strong>${stock.markPrice}</strong> secondary mark.
          </p>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '12px 18px', borderRadius: '10px', border: '1px solid var(--border-accent)', textAlign: 'right' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>OTC Mark Benchmark</div>
          <div style={{ fontSize: '20px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--emerald-primary)' }}>
            ${stock.markPrice}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Valuation: {stock.formattedVal}</div>
        </div>
      </div>

      <div className="studio-layout">
        {/* Left Column: Segment Controls */}
        <div className="studio-panel">
          <div className="panel-header-row">
            <div className="panel-title">
              <Sliders size={18} color="var(--cyan-primary)" />
              Valuation Segments (Meteora Universal Curve)
            </div>

            <div className="preset-buttons">
              <button
                id="preset-conservative"
                className={`preset-btn ${activePreset === 'conservative' ? 'active' : ''}`}
                onClick={() => handlePresetChange('conservative')}
              >
                Conservative Anchor
              </button>
              <button
                id="preset-balanced"
                className={`preset-btn ${activePreset === 'balanced' ? 'active' : ''}`}
                onClick={() => handlePresetChange('balanced')}
              >
                Balanced
              </button>
              <button
                id="preset-aggressive"
                className={`preset-btn ${activePreset === 'aggressive' ? 'active' : ''}`}
                onClick={() => handlePresetChange('aggressive')}
              >
                Aggressive
              </button>
            </div>
          </div>

          <div className="segments-list">
            {segments.map((seg, idx) => {
              const tagClasses = ['anchor', 'tender', 'secondary', 'ipo'];
              return (
                <div key={idx} className="segment-item-card">
                  <div className="segment-top">
                    <div className="segment-name-wrap">
                      <span className={`segment-tag ${tagClasses[idx]}`}>
                        Segment {idx + 1}
                      </span>
                      <strong style={{ fontSize: '14px', color: '#fff' }}>{seg.name}</strong>
                    </div>
                    <span className="segment-price-range">
                      ${seg.startPrice} → ${seg.endPrice}
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    {seg.description}
                  </p>

                  <div className="segment-slider-row">
                    <span className="slider-label">Virtual Liquidity:</span>
                    <input
                      id={`slider-seg-${idx + 1}`}
                      className="slider-input"
                      type="range"
                      min={100000}
                      max={1000000}
                      step={25000}
                      value={seg.liquidity}
                      onChange={(e) => handleLiquidityChange(idx, e.target.value)}
                    />
                    <span className="slider-val-readout">
                      {(seg.liquidity / 1000).toFixed(0)}k units
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Asymmetric Fee Schedulers */}
          <div className="fees-control-box">
            <div className="fees-title">
              <span>Asymmetric Fee Scheduler & Rate Limiter</span>
              <Shield size={16} color="var(--emerald-primary)" />
            </div>

            <div className="fees-grid">
              <div className="fee-cell">
                <div className="fee-label">Buy Fee (Fixed)</div>
                <div className="fee-val" style={{ color: 'var(--emerald-primary)' }}>
                  {(feeSettings.buyFeeBps / 100).toFixed(1)}%
                </div>
                <div className="fee-desc">Low friction entry</div>
              </div>

              <div className="fee-cell">
                <div className="fee-label">Initial Sell Fee</div>
                <div className="fee-val" style={{ color: 'var(--amber-accent)' }}>
                  {(feeSettings.sellFeeBps / 100).toFixed(1)}%
                </div>
                <div className="fee-desc">Decays to 0.5% over 7d</div>
              </div>

              <div className="fee-cell">
                <div className="fee-label">Max Buy Size Limit</div>
                <div className="fee-val" style={{ color: 'var(--cyan-primary)' }}>
                  {feeSettings.rateLimitPct}%
                </div>
                <div className="fee-desc">Anti-whale frontrunning</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              id="btn-back-to-step-1"
              className="btn-secondary"
              onClick={onBack}
            >
              <ArrowLeft size={16} />
              Change Asset
            </button>

            <button
              id="btn-simulate-shock"
              className="btn-primary"
              style={{ flex: 1 }}
              onClick={() => onProceed(feeSettings)}
            >
              Simulate Whale Shock & Build DBC Config
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Right Column: Dynamic Stepped Curve Visualizer */}
        <div className="studio-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="panel-title" style={{ marginBottom: '14px' }}>
            <TrendingUp size={18} color="var(--emerald-primary)" />
            Live Curve Shape (Stepped Discovery)
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Segment 1's high liquidity creates a flat foundation at <strong>${stock.markPrice}</strong>. Price moves gradually through tender valuation bands before reaching graduation.
          </p>

          <div className="curve-canvas-wrap">
            <svg className="curve-svg" viewBox="0 0 500 260">
              <defs>
                <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="30" y1="20" x2="480" y2="20" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="30" y1="80" x2="480" y2="80" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="30" y1="140" x2="480" y2="140" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="30" y1="200" x2="480" y2="200" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="30" y1="240" x2="480" y2="240" stroke="#334155" />
              <line x1="30" y1="10" x2="30" y2="240" stroke="#334155" />

              {/* Y Axis Labels */}
              <text x="25" y="24" fill="#64748b" fontSize="10" textAnchor="end">${svgCoords.maxPrice}</text>
              <text x="25" y="144" fill="#64748b" fontSize="10" textAnchor="end">${Math.round((svgCoords.maxPrice + svgCoords.minPrice) / 2)}</text>
              <text x="25" y="238" fill="#64748b" fontSize="10" textAnchor="end">${svgCoords.minPrice}</text>

              {/* Stepped Curve Fill & Stroke */}
              {svgCoords.path && (
                <>
                  <path
                    d={`${svgCoords.path} L 480 240 L 30 240 Z`}
                    fill="url(#curveGradient)"
                  />
                  <path
                    d={svgCoords.path}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}

              {/* Graduation Target Line */}
              <line x1="30" y1="26" x2="480" y2="26" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="5 4" />
              <text x="475" y="20" fill="#c084fc" fontSize="10" textAnchor="end" fontFamily="monospace">
                DAMM v2 Graduation: ${segments[3].endPrice}
              </text>
            </svg>
          </div>

          <div className="curve-legend">
            <div className="legend-item">
              <span className="legend-color" style={{ background: 'var(--emerald-primary)' }}></span>
              <span>Stepped Discovery Curve</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#c084fc' }}></span>
              <span>DAMM v2 Graduation</span>
            </div>
            <div className="legend-item">
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan-primary)' }}>
                Quote Reserve: ~${(svgCoords.totalQuote || 500000).toLocaleString()} USDC
              </span>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', marginTop: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '13px', fontWeight: 600, color: '#fff' }}>
              <Info size={14} color="var(--cyan-primary)" />
              Meteora Universal Curve Architecture
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              By configuring Segment 1 virtual liquidity at <strong>{(segments[0].liquidity / 1000).toFixed(0)}k units</strong> (vs standard 85k), it requires <strong>~9x more capital</strong> for a speculator to pump past the 409A fundamental price floor.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
