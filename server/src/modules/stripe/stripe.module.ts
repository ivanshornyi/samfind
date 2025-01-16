import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";

import { StripeService } from "./stripe.service";
import { StripeController } from "./stripe.controller";

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule],
  controllers: [StripeController],
  providers: [StripeService, PrismaService],
  exports: [StripeService],
})
export class StripeModule {}