import { 
  Module, 
  NestModule, 
  MiddlewareConsumer,
  RequestMethod,
} from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";

import { ConfigModule } from "@nestjs/config";

import { AuthMiddleware } from "./common/middlewares/auth.middleware";

import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";

import { ConfigService } from "@nestjs/config"; 

const configService = new ConfigService();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: configService.get("POSTGRESS_HOST"),
      port: configService.get("POSTGRESS_PORT"),
      username: configService.get("POSTGRESS_USER_NAME"),
      password: configService.get("POSTGRESS_PASSWORD"),
      database: configService.get("POSTGRESS_DATABASE_NAME"),
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UserModule,
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
      .forRoutes("license");
  }
}
