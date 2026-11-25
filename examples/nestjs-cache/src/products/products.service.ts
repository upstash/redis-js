import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

export interface Product {
  id: string;
  name: string;
  price: number;
  loadedAt: string;
  loadedBy: number;
}

@Injectable()
export class ProductsService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async findOne(id: string): Promise<Product> {
    const key = `product:${id}`;

    const cached = await this.cache.get<Product>(key);
    if (cached) return cached;

    const product = await this.loadFromDatabase(id);
    await this.cache.set(key, product, 5 * 60_000); // 5 minutes
    return product;
  }

  async update(id: string, changes: Partial<Product>): Promise<void> {
    // Write `changes` to your database here, then drop the cached copies
    await this.cache.del(`product:${id}`);
    await this.cache.del('products:all');
  }

  async findAll(): Promise<Product[]> {
    return Promise.all(['1', '2', '3'].map((id) => this.loadFromDatabase(id)));
  }

  // Stand-in for a slow database query
  private async loadFromDatabase(id: string): Promise<Product> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      id,
      name: `Product ${id}`,
      price: 10 * Number(id),
      loadedAt: new Date().toISOString(),
      loadedBy: process.pid,
    };
  }
}
