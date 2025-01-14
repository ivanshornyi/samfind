import { 
  Module, 
  NestModule, 
  MiddlewareConsumer,
  RequestMethod,
} from "@nestjs/common";

import { PrismaModule } from "nestjs-prisma";

import { ConfigModule } from "@nestjs/config";

import { AuthMiddleware } from "./common/middlewares/auth.middleware";

import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { UserLicenseModule } from "./modules/user-license/user-license.module";
import { UserReferralModule } from "./modules/user-referral/user-referral.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    UserLicenseModule,
    UserReferralModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude("user", {
        path: "/user",
        method: RequestMethod.POST,
      })
      .forRoutes("user", "user-license", "user-referral");
  }
}
