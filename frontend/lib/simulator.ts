/**
 * Future Value with Compound Interest and Regular Monthly Contributions
 *
 * FV = P × (1 + r)^n + PMT × [((1 + r)^n - 1) / r]
 *
 * Where:
 *   P   = Initial deposit (initialAmount)
 *   PMT = Monthly contribution amount
 *   r   = Monthly interest rate = annualRate / 12 / 100
 *         (annualRate is the Effective Annual Rate as a percentage, e.g. 4.0 = 4%)
 *   n   = Number of compounding periods (termMonths)
 *
 * The first term P×(1+r)^n is the future value of the initial lump sum.
 * The second term is the future value of an annuity (regular contributions).
 *
 * Edge case: If r === 0, FV = P + PMT × n (simple sum, no growth).
 */

export interface SimulationResult {
  finalBalance: number;
  totalDeposited: number;
  interestEarned: number;
  effectiveAnnualRate: number;
}

export function calculateSavings(
  initialAmount: number,
  monthlyContribution: number,
  termMonths: number,
  annualRate: number,
): SimulationResult {
  const totalDeposited = initialAmount + monthlyContribution * termMonths;

  const r = annualRate / 12 / 100;

  let finalBalance: number;

  if (r === 0) {
    finalBalance = totalDeposited;
  } else {
    const compoundFactor = Math.pow(1 + r, termMonths);
    finalBalance =
      initialAmount * compoundFactor +
      monthlyContribution * ((compoundFactor - 1) / r);
  }

  finalBalance = Math.round(finalBalance);

  return {
    finalBalance,
    totalDeposited,
    interestEarned: finalBalance - totalDeposited,
    effectiveAnnualRate: annualRate,
  };
}
