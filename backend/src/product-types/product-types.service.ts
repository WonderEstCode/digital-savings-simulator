import { Injectable, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface ProductType {
  label: string;
  benefits: { title: string; description: string }[];
}

import data from '../../data/product-types.json';

@Injectable()
export class ProductTypesService {
  private types: Record<string, ProductType> = { ...data };

  constructor(private config: ConfigService) {}

  findAll(): Record<string, ProductType> {
    return this.types;
  }

  async create(key: string, type: ProductType): Promise<ProductType> {
    if (this.types[key]) throw new ConflictException(`Type "${key}" already exists`);

    this.types[key] = type;
    await this.triggerRevalidation();
    return type;
  }

  private async triggerRevalidation() {
    const frontendUrl = this.config.get<string>('FRONTEND_URL');
    const secret = this.config.get<string>('REVALIDATION_SECRET');

    if (!frontendUrl || !secret) return;

    try {
      await fetch(`${frontendUrl}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, tag: 'product-types' }),
      });
    } catch {
      console.warn('Could not trigger frontend revalidation');
    }
  }
}
