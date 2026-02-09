import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductTypesService } from './product-types.service';

@Controller('product-types')
export class ProductTypesController {
  constructor(private readonly productTypesService: ProductTypesService) {}

  @Get()
  findAll() {
    return this.productTypesService.findAll();
  }

  @Post()
  create(@Body() body: { key: string; label: string; benefits: { title: string; description: string }[] }) {
    const { key, ...type } = body;
    return this.productTypesService.create(key, type);
  }
}
