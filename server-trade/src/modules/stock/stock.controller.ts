import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserService } from "../user/user.service";
import { MailService } from "../mail/mail.service";
import { CreateStockDto } from "./dto/create-stock-dto";
import { StockService } from "./stock.service";
import { UpdateStockDto } from "./dto/update-stock-dto";

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

  @ApiOperation({ summary: "Get stock item by id" })
  @Get("/:id")
  async findStockById(@Param("id") id: string) {
    return await this.stockService.getStockById(id)
  }

  @ApiOperation({ summary: "Update stock by id" })
  @Patch("/:id")
  async updateStockById(@Param("id") id: string, @Body() updateStockDto: UpdateStockDto) {
    return await this.stockService.updateStockById(id, updateStockDto)
  }
}
