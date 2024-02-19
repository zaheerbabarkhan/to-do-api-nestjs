import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { redisClientFactory } from './redis.client';

@Module({
  imports: [],
  controllers: [],
  providers: [redisClientFactory,RedisService],
  exports: [RedisService]
})
export class RedisModule {}
