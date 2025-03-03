import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { CronService } from "./cron.service";
import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "nestjs-prisma";
import { MailModule } from "../mail/mail.module";
import { StripeModule } from "../stripe/stripe.module";

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule, StripeModule, MailModule],
  providers: [CronService, PrismaService],
  exports: [CronService],
})
export class CronModule {}
