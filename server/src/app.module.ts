import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";

import { PrismaModule } from "nestjs-prisma";

import { ConfigModule } from "@nestjs/config";

import { AuthMiddleware } from "./common/middlewares/auth.middleware";

import { AuthModule } from "./modules/auth/auth.module";
import { HealthModule } from "./modules/health/health.module";
import { LicenseVerificationModule } from "./modules/license-verification/license-verification.module";
import { OrganizationModule } from "./modules/organization/organization.module";
import { PlanModule } from "./modules/plan/plan.module";
import { StripeModule } from "./modules/stripe/stripe.module";
import { UserLicenseModule } from "./modules/user-license/user-license.module";
import { UserReferralModule } from "./modules/user-referral/user-referral.module";
import { UserModule } from "./modules/user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    UserLicenseModule,
    UserReferralModule,
    StripeModule,
    OrganizationModule,
    LicenseVerificationModule,
    PlanModule,
    HealthModule,
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
