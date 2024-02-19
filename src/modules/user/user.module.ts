import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/User.schema';
import { MailModule } from '../mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import config from 'src/config/config';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [MongooseModule.forFeature([{
    name: "User",
    schema: UserSchema
  }]),JwtModule.register({
    secret: config.JWT.SECRET_KEY
  }), MailModule, RedisModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
