import { Controller, Post, Body } from "@nestjs/common";

import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SubscriptionService } from "./subscription.service";
import { AddSubscriptionDto } from "./dto/add-subscription-dto";

@ApiTags("Subscription")
@Controller("subscription")
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @ApiOperation({ summary: "Add Subscription" })
  @Post("/")
  async addLicense(@Body() addSubscriptionDto: AddSubscriptionDto) {
    return this.subscriptionService.addSubscription(addSubscriptionDto);
  }
}
