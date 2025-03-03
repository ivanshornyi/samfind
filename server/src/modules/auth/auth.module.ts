import { Module } from "@nestjs/common";

import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

import { PrismaModule } from "../prisma/prisma.module";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TokenService } from "./token.service";
import { UserModule } from "../user/user.module";
import { MailModule } from "../mail/mail.module";
import { UserLicenseModule } from "../user-license/user-license.module";
import { StripeModule } from "../stripe/stripe.module";

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
    UserModule,
    MailModule,
    UserLicenseModule,
    StripeModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService],
  exports: [TokenService],
})
export class AuthModule {}
