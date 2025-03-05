import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { StripeModule } from "../stripe/stripe.module";
import { AppSettingsService } from "./appSettings.service";
import { AppSettingsController } from "./appSettings.controller";
import { SubscriptionModule } from "../subscription/subscription.module";

@Module({
  imports: [PrismaModule, StripeModule, SubscriptionModule],
  controllers: [AppSettingsController],
  providers: [AppSettingsService],
  exports: [AppSettingsService],
})
export class AppSettingsModule {}
