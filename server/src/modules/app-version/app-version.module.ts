import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";
import { AppVersionService } from "./app-version.service";
import { AppVersionController } from "./app-version.controller";

@Module({
  imports: [PrismaModule, ConfigModule.forRoot()],
  providers: [AppVersionService, PrismaService],
  controllers: [AppVersionController],
  exports: [],
})
export class AppVersionModule {}
