import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";

import { UserModule } from "../user/user.module";
import { StripeService } from "../stripe/stripe.service";
import { UserService } from "../user/user.service";
import { SubscriptionService } from "./subscription.service";
import { SubscriptionController } from "./subscription.controller";
import { MailModule } from "../mail/mail.module";
import { MailService } from "../mail/mail.service";

@Module({
  imports: [PrismaModule, UserModule, MailModule],
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    StripeService,
    PrismaService,
    UserService,
    MailService,
  ],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
