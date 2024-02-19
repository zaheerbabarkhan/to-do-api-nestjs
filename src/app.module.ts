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

const smtpConfig = config.SMTP;
@Module({
  imports: [
    MongooseModule.forRoot(`mongodb+srv://${config.DB.DB_USER}:${config.DB.DB_PASSWORD}@cluster0.xlw87.mongodb.net/?retryWrites=true&w=majority`, {
      dbName: config.DB.DB_NAME
  }),MailerModule.forRoot({
    // transport: `smtps://${config.SMTP.SMTP_EMAIL}:${config.SMTP.SMTP_PASSWORD}@${config.SMTP.SMTP_HOST}`,
    transport: nodemailer.createTransport({
      host: smtpConfig.SMTP_HOST,
      port: smtpConfig.SMTP_PORT,
      auth: {
          user: smtpConfig.SMTP_EMAIL,
          pass: smtpConfig.SMTP_PASSWORD
      }
  }),
    defaults: {
      from: '"no-reply" <example@example.com>',
    }}),JwtModule.register({
      secret: config.JWT.SECRET_KEY,
  }), RedisModule, UserModule, TodoModule, MailModule],
})
export class AppModule {}
