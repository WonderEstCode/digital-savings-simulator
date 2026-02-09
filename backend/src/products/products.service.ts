import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProductDto } from './dto/product.dto';
import data from '../../data/products.json';

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

  async create(product: ProductDto): Promise<ProductDto> {
    const exists = this.products.find((p) => p.slug === product.slug);
    if (exists) throw new ConflictException(`Product "${product.slug}" already exists`);

    this.products.push(product);
    await this.triggerRevalidation();
    return product;
  }

  async update(slug: string, partial: Partial<ProductDto>): Promise<ProductDto> {
    const index = this.products.findIndex((p) => p.slug === slug);
    if (index === -1) throw new NotFoundException(`Product "${slug}" not found`);

    this.products[index] = { ...this.products[index], ...partial };
    await this.triggerRevalidation();
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
