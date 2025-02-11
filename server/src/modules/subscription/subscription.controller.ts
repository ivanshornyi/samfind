import { Controller, Post, Body, Get, Param } from "@nestjs/common";

import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SubscriptionService } from "./subscription.service";
import { AddSubscriptionDto } from "./dto/add-subscription-dto";
import { CreateMemberInvoiceDto } from "./dto/create-member-invoice-dto";
import { ChangePlanDto } from "./dto/change-plan-dto";

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
  @Post("/invoice")
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
  @Post("/invoice-test")
  async payInvoice() {
    return this.subscriptionService.payInvoice();
  }

  @ApiOperation({ summary: "Cancel Subscription" })
  @Post("/cancel/:id")
  async cancelSubscription(@Param("id") id: string) {
    return this.subscriptionService.cancelSubscription(id);
  }

  @ApiOperation({ summary: "Active Subscription" })
  @Post("/active/:id")
  async activeSubscription(@Param("id") id: string) {
    return this.subscriptionService.activeSubscription(id);
  }

  @ApiOperation({ summary: "Change Subscription Plan" })
  @Post("/change-plan")
  async changePlan(@Body() changePlanDto: ChangePlanDto) {
    return this.subscriptionService.changePlan(changePlanDto);
  }
}
