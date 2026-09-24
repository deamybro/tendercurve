import React from 'react';
import { Compass, Sparkles, CheckCircle2, ArrowRight, HelpCircle, Layers } from 'lucide-react';

export default function NavigationHeader({ currentStep, setStep, orientationData }) {
  const steps = [
    { num: 1, label: 'Select Stock' },
    { num: 2, label: 'Configure Curve' },
    { num: 3, label: 'Stress Test' },
    { num: 4, label: 'Resilience Result' },
    { num: 5, label: 'Proof & DAMM v2' }
  ];

  return (
    <header>
      <nav className="top-nav" aria-label="Main Navigation">
        <div className="brand" onClick={() => setStep(1)} style={{ cursor: 'pointer' }}>
          <div className="brand-logo">T</div>
          <div>
            <div className="brand-name">TenderCurve</div>
          </div>
          <span className="brand-badge">Meteora DBC</span>
          <span className="brand-badge" style={{ background: 'rgba(6, 182, 212, 0.12)', color: 'var(--cyan-primary)', borderColor: 'rgba(6, 182, 212, 0.3)' }}>
            PreStocks API
          </span>
        </div>

        <div className="steps-indicator">
          {steps.map((s) => {
            const isCompleted = currentStep > s.num;
            const isActive = currentStep === s.num;
            return (
              <button
                key={s.num}
                id={`nav-step-${s.num}`}
                className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => {
                  if (s.num <= currentStep || isCompleted) {
                    setStep(s.num);
                  }
                }}
              >
                <span className="step-number">
                  {isCompleted ? '✓' : s.num}
                </span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mandatory 4-Question Orientation Bar */}
      <section className="orientation-banner" aria-label="Current Context Orientation">
        <div className="orientation-slot">
          <div className="orientation-question">
            <Compass size={13} />
            Where am I?
          </div>
          <div className="orientation-answer">
            {orientationData.whereAmI}
          </div>
        </div>

        <div className="orientation-slot">
          <div className="orientation-question">
            <Sparkles size={13} />
            What can I do?
          </div>
          <div className="orientation-answer">
            {orientationData.whatCanIDo}
          </div>
        </div>

        <div className="orientation-slot">
          <div className="orientation-question">
            <CheckCircle2 size={13} />
            What happened?
          </div>
          <div className="orientation-answer">
            {orientationData.whatHappened}
          </div>
        </div>

        <div className="orientation-slot">
          <div className="orientation-question">
            <ArrowRight size={13} />
            What should I do next?
          </div>
          <div className="orientation-answer highlight">
            {orientationData.whatNext}
          </div>
        </div>
      </section>
    </header>
  );
}
