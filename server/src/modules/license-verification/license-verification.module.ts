import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";

import { LicenseVerificationController } from "./license-verification.controller";
import { LicenseVerificationService } from "./license-verification.service";

@Module({
  imports: [PrismaModule],
  controllers: [LicenseVerificationController],
  providers: [PrismaService, LicenseVerificationService],
})
export class LicenseVerificationModule {}