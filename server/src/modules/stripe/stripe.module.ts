import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";

import { StripeService } from "./stripe.service";
import { StripeController } from "./stripe.controller";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";
import { MailService } from "../mail/mail.service";
import { MailModule } from "../mail/mail.module";

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, UserModule, MailModule],
  controllers: [StripeController],
  providers: [StripeService, PrismaService, UserService, MailService],
  exports: [StripeService],
})
export class StripeModule {}
