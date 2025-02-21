import { Body, Controller, Get, Param, Put } from "@nestjs/common";

import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { WalletService } from "./wallet.service";
import { UpdateWalletDto } from "./dto/update-user-license-dto";

@ApiTags("Wallet")
@Controller("wallet")
export class WalletController {
  constructor(private readonly userService: WalletService) {}

  @ApiOperation({ summary: "Get User Wallet" })
  @Get("/:id")
  async getUserWallet(@Param("id") id: string) {
    return await this.userService.getUserWallet(id);
  }

  @ApiOperation({ summary: "Update User Wallet" })
  @Put("/")
  async updateWallet(@Body() updateWalletDto: UpdateWalletDto) {
    return await this.userService.updateWallet(updateWalletDto);
  }
}
