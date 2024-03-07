import { FactoryProvider } from '@nestjs/common';
import { Redis } from 'ioredis';
import config from '../../config/config';

const redisConfig = config.REDIS
export const redisClientFactory: FactoryProvider<Redis> = {
    provide: 'RedisClient',
    useFactory: () => {
        const redisInstance = new Redis({
            host: redisConfig.REDIS_HOST,
            port: +redisConfig.REDIS_PORT,
        });

        redisInstance.on('error', e => {
            throw new Error(`Redis connection failed: ${e}`);
        });

        return redisInstance;
    },
    inject: [],
};