import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";

import { UserLicenseService } from "./user-license.service";
import { UserLicenseController } from "./user-license.controller";
import { MailModule } from "../mail/mail.module";
import { MailService } from "../mail/mail.service";

@Module({
  imports: [PrismaModule, ConfigModule.forRoot(), MailModule],
  providers: [UserLicenseService, PrismaService, MailService],
  controllers: [UserLicenseController],
  exports: [],
})
export class UserLicenseModule {}
