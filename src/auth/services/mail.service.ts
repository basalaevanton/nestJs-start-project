import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../../users/schemas/user.schema';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendActivationMail(to: User['email'], link: string) {
    await this.mailerService
      .sendMail({
        to,
        from: process.env.SMTP_USER,
        subject: 'Активация аккаунта на ' + process.env.CLIENT_URL,
        text: 'Welcome to startPrj NestJs',
        html: `
      <div>
          <h1>Для активации перейдите по ссылке</h1>
          <a href="${link}">${link}</a>
      </div>
  `,
      })
      .then(() => {})
      .catch((e) => {
        console.log(e);
        throw new HttpException(
          'Письмо с сылкой для активациии не было отправлено',
          HttpStatus.BAD_REQUEST,
        );
      });
  }
}
