import { Body, Controller, Post } from "@nestjs/common";

import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ShareService } from "./share.service";
import { BySharesDto } from "./dto/by-shares-dto";
import { CreateSharesInvoiceDto } from "./dto/create-shares-invoice-dto";

@ApiTags("Share")
@Controller("share")
export class ShareController {
  constructor(private readonly shareService: ShareService) {}

  @ApiOperation({ summary: "By Shares by Bonus" })
  @Post("/buy")
  async byShares(@Body() bySharesDto: BySharesDto) {
    return await this.shareService.byShares(bySharesDto);
  }

  @ApiOperation({ summary: "Create Invoice to buy" })
  @Post("/invoice")
  async createInvoiceToByShares(
    @Body() createSharesInvoiceDto: CreateSharesInvoiceDto,
  ) {
    return await this.shareService.createInvoiceToByShares(
      createSharesInvoiceDto,
    );
  }
}
