import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { ProductsService, type Product } from './products.service.js';

// Only cache ids that can exist, so random ids can't fill Redis
function checkId(id: string) {
  if (!/^\d+$/.test(id)) throw new BadRequestException('Invalid id');
}

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
    checkId(id);
    return this.products.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() changes: Partial<Product>,
    @Headers('authorization') authorization?: string,
  ) {
    // Stand-in for your app's real auth: only admins may change products
    const token = process.env.ADMIN_TOKEN;
    if (!token || authorization !== `Bearer ${token}`) {
      throw new UnauthorizedException();
    }
    checkId(id);
    return this.products.update(id, changes);
  }
}
