import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { Schemas } from '../../schemas';
import { RedisModule } from '../redis/redis.module';
import { S3Service } from '../s3/s3.service';
import config from '../../config/config';

@Module({
  imports: [JwtModule.register({
    secret: config.JWT.SECRET_KEY
  }), MongooseModule.forFeature(Schemas), RedisModule],
  controllers: [TodoController],
  providers: [TodoService, S3Service],
})
export class TodoModule {}
