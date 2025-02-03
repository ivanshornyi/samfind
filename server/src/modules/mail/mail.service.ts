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
        pass: configService.get("MAIL_PASS"),
      },
    });
  }

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
  }

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
        html: `<p><a href="${link}">Invitation link</a></p>`,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  }

  async sendWarningPaymentFailed(to: string, link: string) {
    try {
      const mailOptions = {
        from: configService.get("MAIL_USER"),
        to,
        subject: "Payment error Invoice",
        html: `
        <div>
          <p>An error occurred during the automatic payment of the Invoice. Please pay manually by following the link</p>
          <p><a href="${link}">Invoice link</a></p>
        </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  }

  async sendWarningLicenseDeactivated(to: string, link: string) {
    try {
      const mailOptions = {
        from: configService.get("MAIL_USER"),
        to,
        subject: "License deactivated",
        html: `
        <div>
          <p>Your License has been deactivated due to lack of payment. To restore activation, please pay the Invoice at the link</p>
          <p><a href="${link}">Invoice link</a></p>
        </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  }
}
