import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import Stripe from "stripe";
import { PrismaService } from "../prisma/prisma.service";

import { CreateIntentDto } from "./dto/create-intent-dto";

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.stripe = new Stripe(this.configService.get("STRIPE_SECRET_KEY"), {
      apiVersion: "2024-12-18.acacia",
    });
  }

  async createCustomer(email: string, name: string): Promise<Stripe.Customer> {
    return this.stripe.customers.create({ email, name });
  }

  async createPaymentIntent(
    createPaymentDto: CreateIntentDto,
  ): Promise<Stripe.PaymentIntent> {
    const { userId, licenseName, licenseKey, amount, currency } = createPaymentDto;

    return this.stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        userId,
        licenseName,
        licenseKey,
      },
    });
  }

  constructEvent(
    payload: any,
    sig: string | string[],
    secret: string,
  ): Stripe.Event {
    return this.stripe.webhooks.constructEvent(payload, sig, secret);
  }

  async handleEvent(event: Stripe.Event) {
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;

        this.handleSuccessfulPayment(paymentIntent);
        console.log(paymentIntent, "paymentIntent");
        break;
      case "identity.verification_session.created":
        const verificationCreated = event.data.object;
        console.log(verificationCreated, "verificationCreated");
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }

  private async handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
    try {
      const userId = paymentIntent.metadata.userId;
      const licenseName = paymentIntent.metadata.licenseName;
      const licenseKey = paymentIntent.metadata.licenseName;
      // const 

      await this.prisma.userLicense.create({
        data: {
          userId,
          licenseId: `license-${Math.random()}`,
          name: licenseName,
          key: licenseKey,
          // licenseType,
          // purchasedAt: new Date(),
        },
      });

      this.logger.log(`License added for user ${userId}`);
    } catch (error) {
      this.logger.error('Error adding license to user', error);
    }
  }
}
