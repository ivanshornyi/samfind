import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { PrismaModule } from "../prisma/prisma.module";

import { StripeService } from "./stripe.service";
import { StripeController } from "./stripe.controller";
import { UserModule } from "../user/user.module";
import { MailModule } from "../mail/mail.module";
import { ShareModule } from "../share/share.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    UserModule,
    MailModule,
    forwardRef(() => ShareModule),
  ],
  controllers: [StripeController],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
