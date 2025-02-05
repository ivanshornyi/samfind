import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { CronService } from "./cron.service";
import { PrismaModule } from "../prisma/prisma.module";
import { StripeService } from "../stripe/stripe.service";
import { UserService } from "../user/user.service";
import { UserModule } from "../user/user.module";
import { PrismaService } from "nestjs-prisma";
import { MailModule } from "../mail/mail.module";
import { MailService } from "../mail/mail.service";

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule, UserModule, MailModule],
  providers: [
    CronService,
    StripeService,
    PrismaService,
    UserService,
    MailService,
  ],
  exports: [CronService],
})
export class CronModule {}
