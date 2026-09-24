import React, { useState } from 'react';
import { ArrowLeft, Download, RefreshCw, Check, Copy, Lock, ShieldCheck, DollarSign, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { executeInteractiveTrade } from '../services/curveSimulator.js';
import confetti from 'canvas-confetti';

export default function Screen5ProofDashboard({ stock, segments, dbcConfig, onReset }) {
  const [currentPrice, setCurrentPrice] = useState(stock.markPrice);
  const [currentQuote, setCurrentQuote] = useState(145000); // starts partly filled
  const [lastTradeInfo, setLastTradeInfo] = useState(null);
  const [showJson, setShowJson] = useState(false);
  const [copied, setCopied] = useState(false);

  // Handle interactive live trade
  const handleSimulateTrade = (amount) => {
    const activeSegment = segments.find(s => currentPrice >= s.startPrice && currentPrice <= s.endPrice) || segments[0];
    const tradeResult = executeInteractiveTrade(currentPrice, currentQuote, amount, activeSegment);
    setCurrentPrice(tradeResult.newPrice);
    setCurrentQuote(tradeResult.updatedQuote);
    setLastTradeInfo({
      amount,
      ...tradeResult
    });
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(dbcConfig, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportFile = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dbcConfig, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `tendercurve_${stock.symbol.toLowerCase()}_meteora_config.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
  };

  const graduationThreshold = 500000;
  const graduationProgressPct = Math.min(100, Math.round((currentQuote / graduationThreshold) * 100));

  return (
    <section className="screen-wrapper" aria-labelledby="screen-5-heading">
      <div className="screen-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 id="screen-5-heading" className="screen-title">
            Institutional Proof & DAMM v2 Model
          </h1>
          <p className="screen-subtitle">
            Verifying the <strong>90% Day-1 liquidity lock</strong>, post-graduation DAMM v2 migration rules, and interactive trading telemetry for <strong>{stock.name.replace(' PreStocks', '')}</strong>.
          </p>
        </div>

        <button
          id="btn-restart-workflow"
          className="btn-secondary"
          onClick={onReset}
          style={{ gap: '8px' }}
        >
          <RefreshCw size={15} />
          Configure Another Stock
        </button>
      </div>

      <div className="dashboard-grid">
        {/* Left Panel: Liquidity Lock & DAMM v2 Architecture */}
        <div className="dashboard-panel">
          <div className="panel-title" style={{ marginBottom: '8px' }}>
            <Lock size={18} color="var(--emerald-primary)" />
            Institutional Liquidity Lock Architecture
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Exceeding Meteora’s minimum requirements to provide TradFi-grade certainty for institutional and secondary stock token holders.
          </p>

          <div className="lock-donut-section">
            <div className="donut-svg-wrap">
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                {/* 80% Permanent Lock (Emerald) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="var(--emerald-primary)"
                  strokeWidth="14"
                  strokeDasharray="191 238"
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
                {/* 10% 6-Month Vesting (Cyan) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="var(--cyan-primary)"
                  strokeWidth="14"
                  strokeDasharray="23.8 238"
                  strokeDashoffset="-191"
                  transform="rotate(-90 50 50)"
                />
                {/* 10% Unlocked Issuer (Muted) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#334155"
                  strokeWidth="14"
                  strokeDasharray="23.8 238"
                  strokeDashoffset="-214.8"
                  transform="rotate(-90 50 50)"
                />
                <text x="50" y="47" fill="#fff" fontSize="13" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">90%</text>
                <text x="50" y="60" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="sans-serif">LOCKED D1</text>
              </svg>
            </div>

            <div className="lock-breakdown-legend">
              <div className="lock-row">
                <div className="lock-type">
                  <span className="lock-color-box" style={{ background: 'var(--emerald-primary)' }}></span>
                  Permanent Locked LP
                </div>
                <span className="lock-val">80.0%</span>
              </div>

              <div className="lock-row">
                <div className="lock-type">
                  <span className="lock-color-box" style={{ background: 'var(--cyan-primary)' }}></span>
                  6-Month Linear Vesting
                </div>
                <span className="lock-val">10.0%</span>
              </div>

              <div className="lock-row">
                <div className="lock-type">
                  <span className="lock-color-box" style={{ background: '#334155' }}></span>
                  Unlocked Issuer Reserve
                </div>
                <span className="lock-val">10.0%</span>
              </div>
            </div>
          </div>

          <div className="institutional-callout">
            <ShieldCheck size={18} color="var(--emerald-primary)" style={{ flexShrink: 0 }} />
            <span>
              <strong>9x Meteora Minimum:</strong> Meteora requires 10% locked after Day 1. TenderCurve locks <strong>90% on Day 1</strong> with 80% permanently burnt.
            </span>
          </div>

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Graduation AMM Target</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Meteora DAMM v2</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Post-Graduation Spread</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--emerald-primary)' }}>0.30% (TradFi parity)</div>
            </div>
          </div>
        </div>

        {/* Right Panel: Interactive Live Trade Simulator */}
        <div className="dashboard-panel">
          <div className="panel-title" style={{ marginBottom: '8px' }}>
            <DollarSign size={18} color="var(--cyan-primary)" />
            Interactive Trade Simulator
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Execute simulated test orders on the active curve to observe real-time price updates and quote reserve fill toward graduation.
          </p>

          <div className="trade-buttons-row">
            <button
              id="btn-trade-buy-5k"
              className="trade-btn buy"
              onClick={() => handleSimulateTrade(5000)}
            >
              +$5k Buy
            </button>
            <button
              id="btn-trade-buy-20k"
              className="trade-btn buy"
              onClick={() => handleSimulateTrade(20000)}
            >
              +$20k Buy
            </button>
            <button
              id="btn-trade-sell-10k"
              className="trade-btn sell"
              onClick={() => handleSimulateTrade(-10000)}
            >
              -$10k Sell
            </button>
          </div>

          {/* Current State Readout */}
          <div className="trade-telemetry-box">
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Active Price</div>
              <div style={{ fontSize: '18px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#fff' }}>
                ${currentPrice}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Quote Reserve</div>
              <div style={{ fontSize: '18px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--cyan-primary)' }}>
                ${currentQuote.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>DAMM v2 Progress</div>
              <div style={{ fontSize: '18px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--emerald-primary)' }}>
                {graduationProgressPct}%
              </div>
            </div>
          </div>

          {/* Graduation Progress Bar */}
          <div style={{ margin: '14px 0 6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <span>Progress to $500,000 USDC DAMM v2 Migration</span>
              <span>${currentQuote.toLocaleString()} / $500,000</span>
            </div>
            <div className="progress-track" style={{ height: '7px' }}>
              <div className="progress-bar-fill" style={{ width: `${graduationProgressPct}%` }}></div>
            </div>
          </div>

          {lastTradeInfo && (
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '6px', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Last Action: <strong>{lastTradeInfo.amount > 0 ? `+$${lastTradeInfo.amount.toLocaleString()} Buy` : `-$${Math.abs(lastTradeInfo.amount).toLocaleString()} Sell`}</strong> • Price Impact: <span style={{ color: lastTradeInfo.priceImpactPct >= 0 ? 'var(--emerald-primary)' : 'var(--red-accent)', fontWeight: 700 }}>{lastTradeInfo.priceImpactPct > 0 ? `+${lastTradeInfo.priceImpactPct}%` : `${lastTradeInfo.priceImpactPct}%`}</span> • Fee: ${lastTradeInfo.feeAmount.toFixed(2)} USDC
            </div>
          )}
        </div>
      </div>

      {/* JSON Viewer Card */}
      <div className="json-viewer-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700, color: '#fff' }}>
            <span>Meteora Dynamic Bonding Curve Configuration Manifest</span>
            <span style={{ fontSize: '11px', color: 'var(--emerald-primary)', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
              SDK Ready
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              id="btn-copy-json"
              className="btn-secondary"
              onClick={handleCopyJson}
              style={{ padding: '7px 14px', fontSize: '12px' }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy JSON'}
            </button>
            <button
              id="btn-export-json"
              className="btn-primary"
              onClick={handleExportFile}
              style={{ padding: '7px 14px', fontSize: '12px' }}
            >
              <Download size={14} />
              Export File
            </button>
            <button
              className="btn-secondary"
              onClick={() => setShowJson(!showJson)}
              style={{ padding: '7px 10px', fontSize: '12px' }}
            >
              {showJson ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>

        {showJson && (
          <pre className="json-code-block" id="dbc-config-preview">
            {JSON.stringify(dbcConfig, null, 2)}
          </pre>
        )}
      </div>

      {/* Hackathon Bounty Alignment Strip */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius-sm)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Award size={22} color="var(--amber-accent)" />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Hackathon Bounty Coverage: Direct Hit</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Meteora DBC Track ($5,000) • PreStocks Track ($10,000) • Main Track ($100,000)
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            id="btn-export-manifest-main"
            className="btn-primary"
            onClick={handleExportFile}
          >
            <Download size={16} />
            Export Meteora DBC JSON
          </button>
        </div>
      </div>
    </section>
  );
}
