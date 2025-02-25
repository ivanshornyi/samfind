import { Body, Controller, Post } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserService } from "../user/user.service";
import { MailService } from "../mail/mail.service";
import { CreateStockDto } from "./dto/create-stock-dto";
import { StockService } from "./stock.service";

@ApiTags("Stock")
@Controller("stock")

export class StockController {
  constructor(
    private readonly stockService: StockService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly mailService: MailService
  ) { }

  @ApiOperation({ summary: "Create stock item" })
  @Post("/")
  async createStock(@Body() createStockDto: CreateStockDto) {
    return await this.stockService.createStockItem(createStockDto)
  }
}
