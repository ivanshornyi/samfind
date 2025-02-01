import { Controller, Post, Body, Get, Param } from "@nestjs/common";

import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SubscriptionService } from "./subscription.service";
import { AddSubscriptionDto } from "./dto/add-subscription-dto";
import { CreateMemberInvoiceDto } from "./dto/create-member-invoice-dto";

@ApiTags("Subscription")
@Controller("subscription")
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @ApiOperation({ summary: "Add Subscription" })
  @Post("/")
  async addSubscription(@Body() addSubscriptionDto: AddSubscriptionDto) {
    return this.subscriptionService.addSubscription(addSubscriptionDto);
  }

  @ApiOperation({ summary: "Create Invoice to Pay Member License" })
  @Post("/")
  async payMemberInvoice(
    @Body() createMemberInvoiceDto: CreateMemberInvoiceDto,
  ) {
    return this.subscriptionService.payMemberInvoice(createMemberInvoiceDto);
  }

  @ApiOperation({ summary: "Get User Billing History" })
  @Get("history/:id")
  async getBalingHistory(@Param("id") id: string) {
    return this.subscriptionService.getBalingHistory(id);
  }

  @ApiOperation({ summary: "Test Pay Invoice" })
  @Post("/invoice")
  async payInvoice() {
    return this.subscriptionService.payInvoice();
  }
}
