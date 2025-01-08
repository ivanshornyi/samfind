import { Module } from "@nestjs/common";

import { MailService } from "./mail.service";

@Module({
  exports: [],
  providers: [MailService],
  controllers: [],
})
export class MailModule {};