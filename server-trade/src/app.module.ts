import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from "@nestjs/common"
import { ScheduleModule } from "@nestjs/schedule"
import { PrismaModule } from "nestjs-prisma"

import { ConfigModule } from "@nestjs/config"

import { AuthMiddleware } from "./common/middlewares/auth.middleware"

import { StripeModule } from "./modules/stripe/stripe.module"
import { UserModule } from "./modules/user/user.module"
import { WalletModule } from "./modules/wallet/wallet.module"
import { ShareModule } from "./modules/share/share.module"
import { AppSettingsModule } from "./modules/appSettings/appSettings.module"

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    UserModule,
    StripeModule,
    WalletModule,
    ShareModule,
    AppSettingsModule
  ],
  controllers: [],
  providers: []
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        {
          path: "/user",
          method: RequestMethod.POST
        },
        {
          path: "/stripe/webhook",
          method: RequestMethod.POST
        },
        {
          path: "/app-version(.*)",
          method: RequestMethod.GET
        },
        {
          path: "/app-version(.*)",
          method: RequestMethod.POST
        },
        {
          path: "/mail/support",
          method: RequestMethod.POST
        }
      )
      .forRoutes("user", "stripe", "wallet", "share", "app-settings")
  }
}
