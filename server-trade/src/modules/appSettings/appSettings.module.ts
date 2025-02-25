import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { WalletModule } from "../wallet/wallet.module";
import { StripeModule } from "../stripe/stripe.module";
import { AppSettingsService } from "./appSettings.service";
import { AppSettingsController } from "./appSettings.controller";

@Module({
  imports: [PrismaModule, WalletModule, StripeModule],
  controllers: [AppSettingsController],
  providers: [AppSettingsService],
  exports: [AppSettingsService],
})
export class AppSettingsModule {}
