import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { PrismaModule } from "nestjs-prisma";

import { ConfigModule } from "@nestjs/config";

import { AuthMiddleware } from "./common/middlewares/auth.middleware";

import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { UserLicenseModule } from "./modules/user-license/user-license.module";
import { UserReferralModule } from "./modules/user-referral/user-referral.module";
import { StripeModule } from "./modules/stripe/stripe.module";
import { OrganizationModule } from "./modules/organization/organization.module";
import { LicenseVerificationModule } from "./modules/license-verification/license-verification.module";
import { PlanModule } from "./modules/plan/plan.module";
import { SubscriptionModule } from "./modules/subscription/subscription.module";
import { CronModule } from "./modules/cron/cron.module";
import { DiscountModule } from "./modules/user-discount/user-discount.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UserModule,
    UserLicenseModule,
    UserReferralModule,
    StripeModule,
    OrganizationModule,
    LicenseVerificationModule,
    PlanModule,
    SubscriptionModule,
    CronModule,
    DiscountModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        {
          path: "/user",
          method: RequestMethod.POST,
        },
        {
          path: "/stripe/webhook",
          method: RequestMethod.POST,
        },
        {
          path: "/user-license/device",
          method: RequestMethod.POST,
        },
      )
      .forRoutes("user", "user-license", "user-referral", "stripe", "plan");
  }
}
