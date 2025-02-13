import { Module } from "@nestjs/common";

import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserService } from "../user/user.service";
import { TokenService } from "./token.service";
import { MailService } from "../mail/mail.service";
import { SubscriptionService } from "../subscription/subscription.service";
import { SubscriptionModule } from "../subscription/subscription.module";
import { StripeService } from "../stripe/stripe.service";
import { UserLicenseService } from "../user-license/user-license.service";

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get("JWT_SECRET"),
        };
      },
    }),
    PrismaModule,
    SubscriptionModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    TokenService,
    MailService,
    PrismaService,
    SubscriptionService,
    StripeService,
    UserLicenseService,
  ],
  exports: [TokenService],
})
export class AuthModule {}
