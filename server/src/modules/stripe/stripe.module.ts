import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";

import { StripeService } from "./stripe.service";
import { StripeController } from "./stripe.controller";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";

@Module({
  imports: [
    ConfigModule.forRoot(), 
    PrismaModule,
    UserModule,
  ],
  controllers: [StripeController],
  providers: [StripeService, PrismaService, UserService],
  exports: [StripeService],
})
export class StripeModule {}