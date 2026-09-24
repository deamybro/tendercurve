import { PRESTOCKS_FALLBACK } from '../data/prestocksFallback.js';

export async function fetchPreStocksData() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch('https://prestocks.com/api/prestocks', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return { data: enrichStocksData(data), isLive: true };
    }
    return { data: enrichStocksData(PRESTOCKS_FALLBACK), isLive: false };
  } catch (err) {
    console.warn('PreStocks live fetch bypassed, using verified snapshot data:', err.message);
    return { data: enrichStocksData(PRESTOCKS_FALLBACK), isLive: false };
  }
}

function enrichStocksData(stocks) {
  return stocks.map(stock => {
    const fallback = PRESTOCKS_FALLBACK.find(f => f.symbol === stock.symbol) || {};
    const markPrice = stock.markPrice || fallback.markPrice || 100;
    const tokenPrice = stock.tokenPrice || fallback.tokenPrice || markPrice;

    const diffPct = ((tokenPrice - markPrice) / markPrice) * 100;
    const isDiscount = diffPct < 0;

    const val = stock.markValuation || fallback.markValuation || 10000000000;
    const formattedVal = val >= 1e12
      ? `$${(val / 1e12).toFixed(2)}T`
      : `$${(val / 1e9).toFixed(1)}B`;

    const s1Start = Math.round(markPrice * 0.77);
    const s1End = Math.round(markPrice * 1.01);
    const s2End = Math.round(markPrice * 1.30);
    const s3End = Math.round(markPrice * 1.82);
    const s4End = Math.round(markPrice * 2.28);

    return {
      ...fallback,
      ...stock,
      markPrice: Number(markPrice.toFixed(2)),
      tokenPrice: Number(tokenPrice.toFixed(2)),
      diffPct: Number(diffPct.toFixed(1)),
      isDiscount,
      formattedVal,
      tenderRange: fallback.tenderRange || [s1Start, s1End, s2End, s3End, s4End]
    };
  });
}
