import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { PrismaModule } from "../prisma/prisma.module";

import { UserLicenseService } from "./user-license.service";
import { UserLicenseController } from "./user-license.controller";
import { MailModule } from "../mail/mail.module";
import { StripeModule } from "../stripe/stripe.module";

@Module({
  imports: [PrismaModule, ConfigModule.forRoot(), MailModule, StripeModule],
  providers: [UserLicenseService],
  controllers: [UserLicenseController],
  exports: [UserLicenseService],
})
export class UserLicenseModule {}
