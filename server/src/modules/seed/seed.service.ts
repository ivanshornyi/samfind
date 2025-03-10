import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service"; // адаптуй під свій бекенд
import { PlanService } from "../plan/plan.service";
import { AppSettingsService } from "../app-settings/appSettings.service";
import { LicenseTierType, PlanPeriod } from "@prisma/client";

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly planService: PlanService,
    private readonly appSettingsService: AppSettingsService,
  ) {}

  async onModuleInit() {
    this.logger.log("🔹 Running seed service...");
    await this.seedDatabase();
    this.logger.log("✅ Seeding completed!");
  }

  private async seedDatabase() {
    try {
      const appSettings = await this.appSettingsService.getAppSettings();

      if (!appSettings) {
        await this.appSettingsService.addSettings({
          sharePrice: 157,
          earlyBirdPeriod: true,
          limitOfSharesPurchased: 674260000,
          currentSharesPurchased: 0,
        });

        await this.appSettingsService.aadTax({
          name: "VAT",
          description: "Norwegian VAT 25%",
          percentage: 25,
        });
      }

      const plans = await this.planService.getAllPlans();

      if (!plans.length) {
        await this.planService.addPlan({
          price: 942,
          type: LicenseTierType.earlyBird,
          period: PlanPeriod.monthly,
        });

        await this.planService.addPlan({
          price: 999,
          type: LicenseTierType.standard,
          period: PlanPeriod.monthly,
        });

        await this.planService.addPlan({
          price: 999,
          type: LicenseTierType.standard,
          period: PlanPeriod.yearly,
        });

        await this.planService.addPlan({
          price: 0,
          type: LicenseTierType.freemium,
          period: PlanPeriod.monthly,
        });
      }
    } catch (error) {
      this.logger.error("❌ Error while seeding:", error);
    }
  }
}
