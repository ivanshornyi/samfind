import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule, PrismaService } from "nestjs-prisma";
import { UserModule } from "../user/user.module";
import { MailModule } from "../mail/mail.module";
import { StockController } from "./stock.controller";
import { UserService } from "../user/user.service";
import { MailService } from "../mail/mail.service";
import { StockService } from "./stock.service";

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    UserModule,
    MailModule,
  ],
  controllers: [StockController],
  providers: [
    PrismaService,
    UserService,
    MailService,
    StockService
  ],
  exports: [StockService]
})
export class StockModule { }
