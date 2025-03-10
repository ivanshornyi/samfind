import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AppSettingsModule } from "../app-settings/appSettings.module";
import { SeedService } from "./seed.service";
import { PlanModule } from "../plan/plan.module";

@Module({
  imports: [AppSettingsModule, PlanModule],
  providers: [SeedService, PrismaService],
})
export class SeedModule {}
