import { 
  Controller, 
  Post, 
  Body,
  Req,
  Res,
  HttpException, 
  HttpStatus, 
  RawBodyRequest,
} from "@nestjs/common";

import { ConfigService } from "@nestjs/config";

import { StripeService } from "./stripe.service";

import { CreateIntentDto } from "./dto/create-intent-dto";

import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Stripe")
@Controller("stripe")
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ summary: "Create customer" })
  @Post("/create-customer")
  async createCustomer(@Body() body: { email: string; name: string }) {
    return this.stripeService.createCustomer(body.email, body.name);
  }

  @ApiOperation({ summary: "Create payment" })
  @Post("/create-payment-intent")
  async createPaymentIntent(@Body() createIntentDto: CreateIntentDto) {
    return this.stripeService.createPaymentIntent(createIntentDto);
  }

  @ApiOperation({ summary: "Stripe webhook" })
  @Post("/webhook")
  async createWebhook(@Req() req: RawBodyRequest<Request>) {
    const sig = req.headers["stripe-signature"];

    const rawBody = req.rawBody;

    try {
      const event = this.stripeService.constructEvent(
        rawBody,
        sig,
        this.configService.get("WEBHOOK_SECRET"),
      );

      await this.stripeService.handleEvent(event);
    } catch (err) {
      console.log(err, "Webhook error");
      throw new HttpException(
        `Webhook Error: ${err.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}