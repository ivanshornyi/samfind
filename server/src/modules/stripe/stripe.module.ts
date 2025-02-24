import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";

import { StripeService } from "./stripe.service";
import { StripeController } from "./stripe.controller";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";
import { MailService } from "../mail/mail.service";
import { MailModule } from "../mail/mail.module";
import { ShareService } from "../share/share.service";
import { ShareModule } from "../share/share.module";
import { WalletService } from "../wallet/wallet.service";

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    UserModule,
    MailModule,
    forwardRef(() => ShareModule),
  ],
  controllers: [StripeController],
  providers: [
    StripeService,
    PrismaService,
    UserService,
    MailService,
    ShareService,
    WalletService,
  ],
  exports: [StripeService],
})
export class StripeModule {}
