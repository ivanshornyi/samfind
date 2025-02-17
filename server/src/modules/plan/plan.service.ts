import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { LicenseStatus, LicenseTierType } from "@prisma/client";
import { StripeService } from "../stripe/stripe.service";
import { CreatePlanDto } from "./dto/create-plan-dto";

@Injectable()
export class PlanService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  async addPlan({ type, period, price }: CreatePlanDto) {
    let stripePriceId = undefined;
    let stripeProductId = undefined;

    if (type !== LicenseTierType.freemium) {
      const planName = "plan-" + type + "-" + period;
      const description = "price" + price / 100 + "€";
      const product = await this.stripeService.createProduct(
        planName,
        description,
      );
      const productPrice = await this.stripeService.createPrice(
        product.id,
        price,
      );
      stripeProductId = product.id;
      stripePriceId = productPrice.id;
    }

    const plan = await this.prisma.plan.create({
      data: {
        type,
        period,
        price,
        stripePriceId,
        stripeProductId,
      },
    });

    return plan;
  }

  async getAllPlans() {
    const plans = await this.prisma.plan.findMany();

    plans.sort((a, b) => {
      if (a.type === LicenseTierType.freemium) return -1;
      if (b.type === LicenseTierType.freemium) return 1;
      return 0;
    });

    return plans;
  }
}
