import { Module } from "@nestjs/common";

import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

import { PrismaModule } from "../prisma/prisma.module";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserService } from "../user/user.service";
import { TokenService } from "./token.service";
import { MailService } from "../mail/mail.service";

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
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    TokenService,
    MailService,
  ],
  exports: [TokenService],
})
export class AuthModule {}
