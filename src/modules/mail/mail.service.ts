import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import config from 'src/config/config';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    async confirmationEmail(to: string, token: string) {
        const confirmationLink = config.NODE_ENV === "development" ? `http://${config.HOST}:${config.PORT}/users/confirm-email?token=${token}` : `${config.HOST}/users/confirm-email?token=${token}`;

    const emailContent = `
    <p>Please click on the following link to confirm your email:</p>
    <a href="${confirmationLink}">${confirmationLink}</a>
  `;

    await this.mailerService.sendMail({
        from: config.SMTP.SMTP_EMAIL, // sender address
        to, // list of receivers
        subject: "Confirm Your Email  ✔", // Subject line
        text: `please click on the following link to confirm you email ${confirmationLink}`, // plain text body 
        html: emailContent, // HTML version of the email
    });
    }
}
