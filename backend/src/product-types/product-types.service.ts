import { Injectable } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const data: Record<string, unknown> = require('../../data/product-types.json');

@Injectable()
export class ProductTypesService {
  private types: Record<string, unknown> = { ...data };

  findAll(): Record<string, unknown> {
    return this.types;
  }
}
