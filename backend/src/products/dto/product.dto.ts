import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  Min,
} from 'class-validator';

export class ProductDto {
  @IsString()
  id: string;

  @IsString()
  slug: string;

  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsString()
  description: string;

  @IsString()
  targetAudience: string;

  @IsNumber()
  @Min(0)
  annualRate: number;

  @IsNumber()
  @Min(0)
  minOpeningAmount: number;

  @IsNumber()
  @Min(0)
  recommendedMonthlyContribution: number;

  @IsNumber()
  @Min(1)
  suggestedTermMonths: number;

  @IsString()
  liquidity: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsOptional()
  @IsString()
  image?: string;

  @IsString()
  lastUpdated: string;
}