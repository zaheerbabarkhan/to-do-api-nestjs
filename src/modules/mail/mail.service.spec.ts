import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import config from '../../config/config';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
      imports: [MailerModule.forRoot({
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
      })]
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
