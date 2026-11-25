import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { ProductsModule } from './products/products.module.js';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => {
        const store = createKeyv(process.env.REDIS_URL, {
          namespace: 'my-api',
        });
        store.on('error', (err) => console.error('Cache error:', err));

        return {
          stores: [store],
          ttl: 60_000, // default TTL in milliseconds
        };
      },
    }),
    ProductsModule,
  ],
})
export class AppModule {}
