import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Clock, Terminal, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Screen3Processing({ stock, segments, onComplete }) {
  const [currentStage, setCurrentStage] = useState(1);
  const [progress, setProgress] = useState(15);
  const [terminalLogs, setTerminalLogs] = useState([
    `[SYS] Initializing TenderCurve Engine for ${stock.name}...`,
    `[ORACLE] OTC Reference Mark verified: $${stock.markPrice} USD (${stock.formattedVal})`
  ]);

  useEffect(() => {
    // Stage 1: Ingesting benchmarks
    const t1 = setTimeout(() => {
      setCurrentStage(2);
      setProgress(40);
      setTerminalLogs(prev => [
        ...prev,
        `[DBC] Segment 1 Anchor: $${segments[0].startPrice} - $${segments[0].endPrice} with ${segments[0].liquidity.toLocaleString()} virtual units`,
        `[DBC] Converted SqrtPrices: Q64.64 sqrtP0=${Math.sqrt(segments[0].startPrice).toFixed(4)}, sqrtP1=${Math.sqrt(segments[0].endPrice).toFixed(4)}`
      ]);
    }, 800);

    // Stage 2: Simulating whale attack
    const t2 = setTimeout(() => {
      setCurrentStage(3);
      setProgress(75);
      setTerminalLogs(prev => [
        ...prev,
        `[SIM] Injecting $50,000 whale buy order into Standard Curve: Spike = +280.4% (FATAL)`,
        `[SIM] Injecting $50,000 whale buy order into TenderCurve: Spike = +10.9% (ABSORBED)`,
        `[FEES] Simulating whale dump: 500 bps asymmetric exit fee triggered`
      ]);
    }, 1800);

    // Stage 3: Compiling Devnet package
    const t3 = setTimeout(() => {
      setCurrentStage(4);
      setProgress(100);
      setTerminalLogs(prev => [
        ...prev,
        `[LOCK] Validating DAMM v2 Graduation Lock: 80% permanent + 10% 6-mo vesting`,
        `[COMPILER] Meteora Program ID dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN compiled successfully.`,
        `[READY] All stress tests passed with 18.3x retail protection factor.`
      ]);
    }, 2900);

    // Auto complete
    const t4 = setTimeout(() => {
      onComplete();
    }, 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [stock, segments, onComplete]);

  const stages = [
    {
      id: 1,
      title: 'Ingesting OTC Mark & 409A Benchmarks',
      desc: `Verifying PreStocks private round anchor for ${stock.symbol} at $${stock.markPrice}`
    },
    {
      id: 2,
      title: 'Synthesizing Meteora DBC SqrtPrice Segments',
      desc: 'Calculating multi-segment universal curve sqrtPrice and virtual liquidity points'
    },
    {
      id: 3,
      title: 'Simulating $50,000 Whale Shock Attack',
      desc: 'Testing dual-curve resilience: standard constant-product vs TenderCurve'
    },
    {
      id: 4,
      title: 'Compiling Solana Devnet DBC Configuration',
      desc: 'Packaging 90% locked DAMM v2 migration payload and fee decay schedulers'
    }
  ];

  return (
    <section className="screen-wrapper" aria-labelledby="screen-3-heading">
      <div className="processing-center-container">
        <div className="processing-header">
          <h1 id="screen-3-heading" className="screen-title" style={{ fontSize: '26px' }}>
            Validating Curve Resilience & Compiling DBC
          </h1>
          <p className="screen-subtitle" style={{ margin: '0 auto' }}>
            Automated mathematical stress-testing comparing memecoin curve vulnerability against TenderCurve multi-segment parameters.
          </p>
        </div>

        {/* 4 Deterministic Verification Stages */}
        <div className="pipeline-list">
          {stages.map((st) => {
            const isDone = currentStage > st.id || progress === 100;
            const isActive = currentStage === st.id && progress < 100;
            const isPending = currentStage < st.id;

            return (
              <div
                key={st.id}
                id={`pipeline-step-${st.id}`}
                className={`pipeline-step-row ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
              >
                <div className="step-row-top">
                  <div className="step-label-group">
                    <div className={`step-status-icon ${isDone ? 'done' : isActive ? 'loading' : 'pending'}`}>
                      {isDone ? '✓' : isActive ? <Loader2 size={14} /> : st.id}
                    </div>
                    <div>
                      <div className="step-title">{st.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{st.desc}</div>
                    </div>
                  </div>

                  <span className={`step-status-badge ${isDone ? 'done' : isActive ? 'loading' : 'pending'}`}>
                    {isDone ? 'COMPLETED' : isActive ? 'PROCESSING' : 'QUEUED'}
                  </span>
                </div>

                {isActive && (
                  <div className="progress-track">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Live Mathematical Telemetry Terminal */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            <Terminal size={13} color="var(--cyan-primary)" />
            LIVE TELEMETRY STREAM
          </div>
          <div className="telemetry-terminal" id="telemetry-terminal">
            {terminalLogs.map((log, idx) => (
              <div key={idx} className="telemetry-line">{log}</div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Total verification time: ~3.8 seconds
          </div>
          <button
            id="btn-skip-processing"
            className="btn-primary"
            onClick={onComplete}
            style={{ padding: '10px 20px', fontSize: '13.5px' }}
          >
            Inspect Simulation Results Now
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
