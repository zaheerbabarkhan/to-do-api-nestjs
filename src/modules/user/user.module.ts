import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from '../mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import config from '../../config/config';
import { RedisModule } from '../redis/redis.module';
import { Schemas } from '../../schemas';
import { GoogleStrategy } from '../../config/google.passport';
import { GithubStrategy } from '../../config/github.passport';


@Module({
  imports: [MongooseModule.forFeature(Schemas),JwtModule.register({
    secret: config.JWT.SECRET_KEY
  }), MailModule, RedisModule],
  controllers: [UserController],
  providers: [UserService, GoogleStrategy, GithubStrategy],
})
export class UserModule {}
