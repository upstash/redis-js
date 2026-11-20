import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { ProductsService, type Product } from './products.service.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('products:all')
  @CacheTTL(10_000) // 10 seconds
  findAll() {
    return this.products.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.products.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() changes: Partial<Product>) {
    return this.products.update(id, changes);
  }
}
