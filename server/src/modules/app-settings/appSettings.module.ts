import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { StripeModule } from "../stripe/stripe.module";
import { AppSettingsService } from "./appSettings.service";
import { AppSettingsController } from "./appSettings.controller";

@Module({
  imports: [PrismaModule, StripeModule],
  controllers: [AppSettingsController],
  providers: [AppSettingsService],
  exports: [AppSettingsService],
})
export class AppSettingsModule {}
