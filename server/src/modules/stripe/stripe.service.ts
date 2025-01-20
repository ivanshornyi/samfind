import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import Stripe from "stripe";
import { PrismaService } from "../prisma/prisma.service";
import { UserService } from "../user/user.service";

import { CreateIntentDto } from "./dto/create-intent-dto";

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
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
    const { 
      userId, 
      amount, 
      currency, 
      userReferralCode,
    } = createPaymentDto;

    const referralDiscount = amount / 10;

    let metadata: any = {
      userId,
    };

    let intent = {
      amount,
      currency,
      metadata,
    };

    if (userReferralCode) {
      intent.metadata = {
        ...metadata,
        userReferralCode,
        referralDiscount,
      }
    }

    return this.stripe.paymentIntents.create(intent);
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
        break;
      case "identity.verification_session.created":
        // const verificationCreated = event.data.object;
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }

  private async handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
    try {
      const { userId, userReferralCode, referralDiscount } = paymentIntent.metadata;

      if (userReferralCode) {
        // find user and update user discount
        this.userService.findAndUpdateUserByReferralCode(Number(userReferralCode), userId, Number(referralDiscount));
      }

      await this.prisma.license.create({
        data: {
          userId,
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
