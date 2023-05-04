import { createTransport } from 'nodemailer';
import { uniq } from 'lodash';
import Mail from 'nodemailer/lib/mailer';

export class Mailer {
  private smtpTransport: Mail;

  constructor() {
    console.log({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: true,
      auth: {
        user: process.env.MAIL_SYSTEM,
        pass: process.env.MAIL_PASS,
      },
      logger: true,
    });
    this.smtpTransport = createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: true,
      auth: {
        user: process.env.MAIL_SYSTEM,
        pass: process.env.MAIL_PASS,
      },
      logger: true,
    });
  }

  public async sendMail(
    recipients: string[],
    subject: string,
    body: string,
    copyCarbon?: string[],
  ): Promise<void> {
    const mailOptions = {
      from: process.env.MAIL_SYSTEM,
      to: recipients,
      cc: copyCarbon
        ? uniq([...copyCarbon, process.env.MAIL_ADMIN])
        : process.env.MAIL_ADMIN,
      subject: subject,
      html: body,
    };

    await this.smtpTransport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });
  }
}
