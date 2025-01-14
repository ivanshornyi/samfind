import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";

import { UserReferralService } from "./user-referral.service"; 
import { UserReferralController } from "./user-referral.controller";

@Module({
  imports: [PrismaModule],
  controllers: [UserReferralController],
  providers: [UserReferralService, PrismaService],
})
export class UserReferralModule {}