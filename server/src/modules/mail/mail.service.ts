import { Injectable } from "@nestjs/common";
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
        pass: configService.get("MAIL_PASS")
      },
    });
  };

  async sendResetCode(to: string, resetCode: string) {
    try {
      const mailOptions = {
        from: configService.get("MAIL_USER"),
        to,
        subject: "Reset password code from Onsio",
        text: `Verification code: ${resetCode}`,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  };

  async sendResetCodeForEmailUpdate(to: string, resetCode: string) {
    try {
      const mailOptions = {
        from: configService.get("MAIL_USER"),
        to,
        subject: "Verification code for email update from Onsio",
        text: `Verification code: ${resetCode}`,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  }

  async sendRegistrationCode(to: string, resetCode: string) {
    try {
      const mailOptions = {
        from: configService.get("MAIL_USER"),
        to,
        subject: "Verification code for registration from Onsio",
        text: `Verification code: ${resetCode}`,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  }

  async sendInvitation(to: string, link: string) {
    try {
      const mailOptions = {
        from: configService.get("MAIL_USER"),
        to,
        subject: "Invitation from Onsio",
        html: `<p>Invitation link <a href="${link}">${link}</a></p>`,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  }
};