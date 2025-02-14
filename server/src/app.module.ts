import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { PrismaModule } from "nestjs-prisma";

import { ConfigModule } from "@nestjs/config";

import { AuthMiddleware } from "./common/middlewares/auth.middleware";

import { AuthModule } from "./modules/auth/auth.module";
import { HealthModule } from "./modules/health/health.module";
import { LicenseVerificationModule } from "./modules/license-verification/license-verification.module";
import { OrganizationModule } from "./modules/organization/organization.module";
import { PlanModule } from "./modules/plan/plan.module";
import { SubscriptionModule } from "./modules/subscription/subscription.module";
import { CronModule } from "./modules/cron/cron.module";
import { DiscountModule } from "./modules/user-discount/user-discount.module";
import { StripeModule } from "./modules/stripe/stripe.module";
import { UserLicenseModule } from "./modules/user-license/user-license.module";
import { UserReferralModule } from "./modules/user-referral/user-referral.module";
import { UserModule } from "./modules/user/user.module";
import { AppVersionModule } from "./modules/app-version/app-version.module";

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
    HealthModule,
    AppVersionModule,
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
        {
          path: "/user-license/check-license",
          method: RequestMethod.POST,
        },
        {
          path: "/plan",
          method: RequestMethod.GET,
        },
        {
          path: "/user/organization-name*(.*)",
          method: RequestMethod.GET,
        },
        {
          path: "/user/user-name(.*)",
          method: RequestMethod.GET,
        },
        {
          path: "/app-version(.*)",
          method: RequestMethod.GET,
        },
        {
          path: "/app-version(.*)",
          method: RequestMethod.POST,
        },
      )
      .forRoutes(
        "user",
        "user-license",
        "user-referral",
        "stripe",
        "plan",
        "subscription",
        "auth/sign-out",
      );
  }
}
