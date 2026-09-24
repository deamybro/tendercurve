import React, { useState, useEffect, useMemo } from 'react';
import NavigationHeader from './components/NavigationHeader.jsx';
import Screen1Landing from './components/Screen1Landing.jsx';
import Screen2Configurator from './components/Screen2Configurator.jsx';
import Screen3Processing from './components/Screen3Processing.jsx';
import Screen4Result from './components/Screen4Result.jsx';
import Screen5ProofDashboard from './components/Screen5ProofDashboard.jsx';

import { fetchPreStocksData } from './services/prestocksApi.js';
import { PRESTOCKS_FALLBACK } from './data/prestocksFallback.js';
import { generateMeteoraDbcConfig } from './services/meteoraDbcConfig.js';
import './App.css';

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [stocks, setStocks] = useState(PRESTOCKS_FALLBACK);
  const [selectedStock, setSelectedStock] = useState(null);
  const [apiLive, setApiLive] = useState(false); // FIX 5: track API status honestly
  const [feeSettings, setFeeSettings] = useState({
    buyFeeBps: 50,
    sellFeeBps: 500,
    rateLimitPct: 5.0
  });

  // Fetch live PreStocks data on mount
  useEffect(() => {
    async function loadData() {
      const result = await fetchPreStocksData();
      if (result && result.data && result.data.length > 0) {
        setStocks(result.data);
        setApiLive(result.isLive);
      }
    }
    loadData();
  }, []);

  // Generate segments for a given stock (pure function, no hooks)
  function computeSegments(stock) {
    if (!stock) return [];
    const p = stock.markPrice;
    return [
      {
        name: 'Series Anchor (409A)',
        startPrice: Math.round(p * 0.77),
        endPrice: Math.round(p * 1.01),
        liquidity: 800000,
        description: 'High virtual liquidity absorbs whale pumps — anchored to the last funding round valuation.'
      },
      {
        name: 'Tender Offer Band',
        startPrice: Math.round(p * 1.01),
        endPrice: Math.round(p * 1.30),
        liquidity: 400000,
        description: 'Matches the premium employees and insiders pay in private tender offers.'
      },
      {
        name: 'Secondary Premium',
        startPrice: Math.round(p * 1.30),
        endPrice: Math.round(p * 1.82),
        liquidity: 150000,
        description: 'Where the market prices in pre-IPO hype and public listing expectations.'
      },
      {
        name: 'IPO Speculation Range',
        startPrice: Math.round(p * 1.82),
        endPrice: Math.round(p * 2.28),
        liquidity: 200000,
        description: 'Final step before automatic graduation to a full Meteora DAMM v2 trading pool.'
      }
    ];
  }

  const [segments, setSegments] = useState([]);

  // Compute DBC Config
  const dbcConfig = useMemo(() => {
    if (!selectedStock || !segments || segments.length === 0) return null;
    return generateMeteoraDbcConfig(selectedStock, segments, feeSettings);
  }, [selectedStock, segments, feeSettings]);

  // Orientation data for each step
  const orientationData = useMemo(() => {
    const stockName = selectedStock?.name?.replace(' PreStocks', '') || 'a stock';
    switch (currentStep) {
      case 1:
        return {
          whereAmI: 'Step 1: Choose a Pre-IPO Stock',
          whatCanIDo: 'Click any stock card to start configuring its bonding curve',
          whatHappened: apiLive ? 'Live prices synced from PreStocks API' : 'Using cached price snapshot',
          whatNext: 'Click any stock card to begin'
        };
      case 2:
        return {
          whereAmI: `Step 2: Configure Curve for ${stockName}`,
          whatCanIDo: 'Adjust valuation bands, liquidity depth, and exit fees',
          whatHappened: `Loaded ${stockName} at $${selectedStock?.markPrice} OTC mark`,
          whatNext: 'Click "Simulate Whale Shock" when ready'
        };
      case 3:
        return {
          whereAmI: 'Step 3: Running Stress Test',
          whatCanIDo: 'Watch the automated whale attack simulation execute',
          whatHappened: `Curve parameters validated for ${stockName}`,
          whatNext: 'Auto-advancing when complete...'
        };
      case 4:
        return {
          whereAmI: `Step 4: Resilience Proof for ${stockName}`,
          whatCanIDo: 'Drag the whale slider to test different attack sizes',
          whatHappened: 'Whale shock simulation complete — compare both curves',
          whatNext: 'Inspect the DAMM v2 proof or export DBC config'
        };
      case 5:
        return {
          whereAmI: `Step 5: Institutional Proof for ${stockName}`,
          whatCanIDo: 'Test live trades and export the verified DBC config',
          whatHappened: `${stockName} DBC verified with 90% Day-1 liquidity lock`,
          whatNext: 'Export DBC JSON or configure another stock'
        };
      default:
        return {
          whereAmI: 'TenderCurve',
          whatCanIDo: 'Configure curves',
          whatHappened: 'Ready',
          whatNext: 'Select a stock'
        };
    }
  }, [currentStep, selectedStock, apiLive]);

  return (
    <div className="app-container">
      <NavigationHeader
        currentStep={currentStep}
        setStep={setCurrentStep}
        orientationData={orientationData}
      />

      <main>
        {currentStep === 1 && (
          <Screen1Landing
            stocks={stocks}
            selectedStock={selectedStock}
            onSelectStock={(stock) => {
              setSelectedStock(stock);
              const newSegs = computeSegments(stock);
              setSegments(newSegs);
            }}
            onProceed={() => setCurrentStep(2)}
            apiLive={apiLive}
          />
        )}

        {currentStep === 2 && selectedStock && (
          <Screen2Configurator
            stock={selectedStock}
            initialSegments={segments}
            onUpdateSegments={(updated) => setSegments(updated)}
            onProceed={(fees) => {
              setFeeSettings(fees);
              setCurrentStep(3);
            }}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && selectedStock && (
          <Screen3Processing
            stock={selectedStock}
            segments={segments}
            onComplete={() => setCurrentStep(4)}
          />
        )}

        {currentStep === 4 && selectedStock && dbcConfig && segments.length > 0 && (
          <Screen4Result
            stock={selectedStock}
            segments={segments}
            feeSettings={feeSettings}
            dbcConfig={dbcConfig}
            onProceed={() => setCurrentStep(5)}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 5 && selectedStock && dbcConfig && (
          <Screen5ProofDashboard
            stock={selectedStock}
            segments={segments}
            dbcConfig={dbcConfig}
            onReset={() => setCurrentStep(1)}
          />
        )}
      </main>
    </div>
  );
}
