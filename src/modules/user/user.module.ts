import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from '../mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import config from 'src/config/config';
import { RedisModule } from '../redis/redis.module';
import { Schemas } from 'src/schemas';
import { GoogleStrategy } from 'src/config/google.passport';
import { GithubStrategy } from 'src/config/github.passport';


@Module({
  imports: [MongooseModule.forFeature(Schemas),JwtModule.register({
    secret: config.JWT.SECRET_KEY
  }), MailModule, RedisModule],
  controllers: [UserController],
  providers: [UserService, GoogleStrategy, GithubStrategy],
})
export class UserModule {}
