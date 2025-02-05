import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";

import { OrganizationService } from "./organization.service";
import { OrganizationController } from "./organization.controller";
import { MailModule } from "../mail/mail.module";
import { MailService } from "../mail/mail.service";

@Module({
  imports: [PrismaModule, MailModule],
  controllers: [OrganizationController],
  providers: [OrganizationService, PrismaService, MailService],
})
export class OrganizationModule{}