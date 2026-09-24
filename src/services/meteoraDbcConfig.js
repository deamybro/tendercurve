// Meteora Dynamic Bonding Curve (DBC) Configuration Generator
// Schema complies with @meteora-ag/dynamic-bonding-curve-sdk

export const METEORA_DBC_PROGRAM_ID = "dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN";
export const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

export function generateMeteoraDbcConfig(stock, segments, feeSettings = {}) {
  const curvePoints = segments.map((seg, idx) => ({
    segmentIndex: idx + 1,
    name: seg.name,
    startPrice: seg.startPrice,
    endPrice: seg.endPrice,
    startSqrtPrice: Number(Math.sqrt(seg.startPrice).toFixed(6)),
    endSqrtPrice: Number(Math.sqrt(seg.endPrice).toFixed(6)),
    liquidityUnits: seg.liquidity,
    description: seg.description
  }));

  const graduationThreshold = 500000; // 500,000 USDC threshold to DAMM v2

  return {
    programId: METEORA_DBC_PROGRAM_ID,
    cluster: "devnet",
    asset: {
      name: stock.name,
      symbol: stock.symbol,
      baseMint: stock.contract_address,
      quoteMint: USDC_MINT,
      quoteSymbol: "USDC",
      benchmarkOTCPrice: stock.markPrice,
      impliedValuationUSD: stock.markValuation
    },
    curvePoints,
    graduationConfig: {
      migrationQuoteThreshold: graduationThreshold,
      graduationTargetPrice: segments[segments.length - 1].endPrice,
      targetAmm: "Meteora DAMM v2",
      migrationFeeBps: 25, // 0.25%
      liquidityLock: {
        partnerPermanentPct: 80, // 80% permanent lock
        partnerVestingPct: 10,   // 10% 6-month vesting lock
        partnerUnlockedPct: 10,  // 10% unlocked for issuer
        dayOneLockedTotalPct: 90, // Massively exceeds Meteora's 10% Day-1 minimum
        vestingDurationSeconds: 15552000 // 180 days (6 months)
      }
    },
    feeSchedule: {
      baseBuyFeeBps: feeSettings.buyFeeBps || 50, // 0.5%
      initialSellFeeBps: feeSettings.sellFeeBps || 500, // 5.0%
      finalSellFeeBps: 50, // 0.5%
      sellFeeDecayPeriodSeconds: 604800, // 7 days linear decay
      rateLimiter: {
        enabled: true,
        maxBuyPoolReservePercentage: feeSettings.rateLimitPct || 5.0 // Max 5% buy cap per transaction
      }
    },
    metadata: {
      generator: "TenderCurve Engine v1.0",
      complianceRule: "Venture Equity Stepped Discovery",
      generatedAt: new Date().toISOString()
    }
  };
}
