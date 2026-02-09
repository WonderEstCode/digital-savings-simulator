import { Controller, Get, Post, Param, Patch, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(): ProductDto[] {
    return this.productsService.findAll();
  }

  @Post()
  create(@Body() body: ProductDto): Promise<ProductDto> {
    return this.productsService.create(body);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string): ProductDto {
    return this.productsService.findBySlug(slug);
  }

  @Patch(':slug')
  update(
    @Param('slug') slug: string,
    @Body() body: Partial<ProductDto>,
  ): Promise<ProductDto> {
    return this.productsService.update(slug, body);
  }
}
