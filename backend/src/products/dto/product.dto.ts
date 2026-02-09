export class ProductDto {
  id: string;
  slug: string;
  name: string;
  type: string;
  description: string;
  targetAudience: string;
  annualRate: number;
  minOpeningAmount: number;
  recommendedMonthlyContribution: number;
  suggestedTermMonths: number;
  liquidity: string;
  tags: string[];
  image?: string;
  lastUpdated: string;
}
