import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProductDto } from './dto/product.dto';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const data: ProductDto[] = require('../../data/products.json');

@Injectable()
export class ProductsService {
  private products: ProductDto[] = [...data];

  constructor(private config: ConfigService) {}

  findAll(): ProductDto[] {
    return this.products;
  }

  findBySlug(slug: string): ProductDto {
    const product = this.products.find((p) => p.slug === slug);
    if (!product) throw new NotFoundException(`Product "${slug}" not found`);
    return product;
  }

  update(slug: string, partial: Partial<ProductDto>): ProductDto {
    const index = this.products.findIndex((p) => p.slug === slug);
    if (index === -1) throw new NotFoundException(`Product "${slug}" not found`);

    this.products[index] = { ...this.products[index], ...partial };
    this.triggerRevalidation();
    return this.products[index];
  }

  private async triggerRevalidation() {
    const frontendUrl = this.config.get<string>('FRONTEND_URL');
    const secret = this.config.get<string>('REVALIDATION_SECRET');

    if (!frontendUrl || !secret) return;

    try {
      await fetch(`${frontendUrl}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, tag: 'products' }),
      });
    } catch {
      console.warn('Could not trigger frontend revalidation');
    }
  }
}
