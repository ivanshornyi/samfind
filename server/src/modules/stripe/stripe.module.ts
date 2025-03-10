import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { PrismaModule } from "../prisma/prisma.module";

import { StripeService } from "./stripe.service";
import { StripeController } from "./stripe.controller";
import { UserModule } from "../user/user.module";
import { MailModule } from "../mail/mail.module";
import { ShareModule } from "../share/share.module";
import { WalletModule } from "../wallet/wallet.module";
import { SubscriptionModule } from "../subscription/subscription.module";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    forwardRef(() => UserModule),
    MailModule,
    forwardRef(() => ShareModule),
    WalletModule,
    SubscriptionModule,
    HttpModule,
  ],
  controllers: [StripeController],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
