import { Module } from '@nestjs/common';
import { CronJobsService } from './cron.servicve';
import { MongooseModule } from '@nestjs/mongoose';
import { Schemas } from '../../schemas';
import { JwtModule } from '@nestjs/jwt';
import config from '../../config/config';
import { MailModule } from '../mail/mail.module';

@Module({
  providers: [CronJobsService],
  imports: [MongooseModule.forFeature(Schemas), JwtModule.register({
    secret: config.JWT.SECRET_KEY,
  }), MailModule]
})
export class CronModule {}