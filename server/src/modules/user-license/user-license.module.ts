import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";

import { UserLicenseService } from "./user-license.service";
import { UserLicenseController } from "./user-license.controller";

@Module({
  imports: [PrismaModule],
  providers: [UserLicenseService, PrismaService],
  controllers: [UserLicenseController],
  exports: [],
})
export class UserLicenseModule {}
