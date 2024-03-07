import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { TodoModule } from './modules/todo/todo.module';
import { MailModule } from './modules/mail/mail.module';
import config from './config/config';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { RedisModule } from './modules/redis/redis.module';
import * as nodemailer from "nodemailer";
import { Schemas } from './schemas';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './modules/cron/cron.module';

const dbConfig = config.NODE_ENV === "test" ? config.TEST_DB : config.DB
@Module({
  imports: [
    MongooseModule.forRoot(`mongodb+srv://${dbConfig.DB_USER}:${dbConfig.DB_PASSWORD}@cluster0.xlw87.mongodb.net/?retryWrites=true&w=majority`, {
      dbName: dbConfig.DB_NAME
    }), MongooseModule.forFeature(Schemas), MailerModule.forRoot({
      transport: `smtps://${config.SMTP.SMTP_EMAIL}:${config.SMTP.SMTP_PASSWORD}@${config.SMTP.SMTP_HOST}`,
      //   transport: nodemailer.createTransport({
      //     host: smtpConfig.SMTP_HOST,
      //     port: smtpConfig.SMTP_PORT,
      //     auth: {
      //         user: smtpConfig.SMTP_EMAIL,
      //         pass: smtpConfig.SMTP_PASSWORD
      //     }
      // }),
      defaults: {
        from: '"no-reply" <example@example.com>',
      }
    }), JwtModule.register({
      secret: config.JWT.SECRET_KEY,
    }), RedisModule, UserModule, TodoModule, MailModule, ScheduleModule.forRoot(), CronModule],
})
export class AppModule { }
