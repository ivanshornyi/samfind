import { Injectable, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import * as nodemailer from "nodemailer";

const configService = new ConfigService();

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: configService.get("MAIL_HOST"),
      secure: false,
      requireTLS: true,
      port: 587,
      auth: {
        user: configService.get("MAIL_USER"),
        pass: configService.get("MAIL_PASS"),
      },
    });
  }

  async sendOrderMessage(to: string, subject: string, message: string) {
    try {
      const mailOptions = {
        from: configService.get("MAIL_USER"),
        to,
        subject,
        text: message
      }

      await this.transporter.sendMail(mailOptions)
    } catch (error) {
      throw new BadRequestException(`Failed to send email - ${to}, because of ${error}`)
    }
  }
}
