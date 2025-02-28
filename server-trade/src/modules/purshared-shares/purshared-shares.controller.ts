import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { PursharedSharesService } from "./purshared-shares.service";
import { ValidateIdDto } from "src/common/types/id-validation-dto";

@ApiTags('Purshared Shares')
@Controller('purshared-shares')

export class PursharedSharesController {
  constructor(private readonly pursharesSharesService: PursharedSharesService) { }

  @ApiOperation({ summary: "Find User Shares By User Id" })
  @Get("/:id")
  async findUserSharesById(@Param() params: ValidateIdDto) {
    return await this.pursharesSharesService.getAllUserSharesById(params.id.trim())
  }
}
