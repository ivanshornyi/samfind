import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { LicenseTierType } from "@prisma/client";
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
    let planePrice = price;

    if (type === LicenseTierType.earlyBird) {
      const appSettings = await this.prisma.appSettings.findFirst({
        where: {},
      });
      if (!appSettings || !appSettings.sharePrice)
        throw new NotFoundException("Share Price not found");

      planePrice = appSettings.sharePrice;
    }

    const planName = "plan-" + type + "-" + period;
    const description = "price" + planePrice / 100 + "€";

    const product = await this.stripeService.createProduct(
      planName,
      description,
    );
    const productPrice = await this.stripeService.createSubscriptionPrice(
      planePrice,
      product.id,
      period,
    );
    stripeProductId = product.id;
    stripePriceId = productPrice.id;

    const plan = await this.prisma.plan.create({
      data: {
        type,
        period,
        price: type === LicenseTierType.earlyBird ? planePrice * 6 : planePrice,
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
