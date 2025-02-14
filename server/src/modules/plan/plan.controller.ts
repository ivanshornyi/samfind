import { Controller, Post, Get, Body } from "@nestjs/common";

import { PlanService } from "./plan.service";

import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreatePlanDto } from "./dto/create-plan-dto";

@ApiTags("Plan")
@Controller("plan")
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @ApiOperation({ summary: "Add Plan" })
  @Post("/")
  async addPlan(@Body() addPlanDto: CreatePlanDto) {
    return this.planService.addPlan(addPlanDto);
  }

  @ApiOperation({ summary: "Get plans" })
  @Get("/")
  async getAllPlans() {
    return this.planService.getAllPlans();
  }
}
