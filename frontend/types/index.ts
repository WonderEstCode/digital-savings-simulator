export type ProductType = "goal" | "housing" | "programmed" | (string & {});
export type Liquidity = "high" | "medium" | "low";

export interface Product {
  id: string;
  slug: string;
  name: string;
  type: ProductType;
  description: string;
  targetAudience: string;
  annualRate: number;
  minOpeningAmount: number;
  recommendedMonthlyContribution: number;
  suggestedTermMonths: number;
  liquidity: Liquidity;
  tags: string[];
  image?: string;
  lastUpdated: string;
}
