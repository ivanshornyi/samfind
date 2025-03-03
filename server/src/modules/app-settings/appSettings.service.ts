import { BadRequestException, Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { AddAppSettingsDto } from "./dto/add-app-settings-dto";
import { StripeService } from "../stripe/stripe.service";
import { AddTaxDto } from "./dto/add-tax-dto";

@Injectable()
export class AppSettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  async addSettings(data: AddAppSettingsDto) {
    const appSettings = await this.prisma.appSettings.findFirst({
      where: {},
    });

    if (data.sharePrice && appSettings?.sharePrice)
      throw new BadRequestException("Share Price already added");

    let shareStripeProductId = appSettings?.shareStripeProductId;
    let shareStripePriceId = appSettings?.shareStripePriceId;

    if (data.sharePrice) {
      const product = await this.stripeService.createProduct(
        "Onsio Share",
        "shareStripePriceId",
      );
      const price = await this.stripeService.createPrice(
        product.id,
        data.sharePrice,
      );
      shareStripeProductId = product.id;
      shareStripePriceId = price.id;
    }

    if (!appSettings) {
      await this.prisma.appSettings.create({
        data: { ...data, shareStripePriceId, shareStripeProductId },
      });
    } else {
      await this.prisma.appSettings.update({
        where: { id: appSettings.id },
        data: { ...data, shareStripePriceId, shareStripeProductId },
      });
    }

    return await this.prisma.appSettings.findFirst({
      where: {},
    });
  }

  async getAppSettings() {
    return await this.prisma.appSettings.findFirst({
      where: {},
    });
  }

  async aadTax(data: AddTaxDto) {
    const appSettings = await this.prisma.appSettings.findFirst({
      where: {},
    });

    if (appSettings?.stripeTaxId)
      throw new BadRequestException("Tax already added");

    const tax = await this.stripeService.addTax(data);

    if (!tax) throw new BadRequestException("Something went wrong");

    if (!appSettings) {
      await this.prisma.appSettings.create({
        data: { stripeTaxId: tax.id },
      });
    } else {
      await this.prisma.appSettings.update({
        where: { id: appSettings.id },
        data: { stripeTaxId: tax.id },
      });
    }

    return tax;
  }
}
