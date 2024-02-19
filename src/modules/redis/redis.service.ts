import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    constructor(@Inject('RedisClient') private readonly redisClient: Redis) {}

    async storeUserToken (token: string, userId: string, expiry: number) {
        return this.redisClient.set(String(userId), token, 'EX', expiry);
    }

    async getUserToken(userId: string) {
        return this.redisClient.get(userId);
    }
}
