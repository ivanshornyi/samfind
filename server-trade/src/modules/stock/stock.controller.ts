import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserService } from "../user/user.service";
import { MailService } from "../mail/mail.service";
import { StockService } from "./stock.service";
import { ValidateIdDto } from "src/common/types/id-validation-dto";
import { OrderType } from "src/common/types/order-type";
import { CreateStockDto } from "./dto/create-stock-dto";
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
  async findStockById(@Param() params: ValidateIdDto) {
    return await this.stockService.getStockById(params.id.trim())
  }

  @ApiOperation({ summary: "Get all stocks with pagination" })
  @Get("/")
  async findAllStocksWithPagination(
    @Query("page") page: number,
    @Query("limit") limit: number,
    @Query("order") order: OrderType
  ) {
    return await this.stockService.getAllStocksWithPagination(page, limit, order)
  }

  @ApiOperation({ summary: "Update stock by id" })
  @Patch("/:id")
  async updateStockById(@Param() params: ValidateIdDto, @Body() updateStockDto: UpdateStockDto) {
    return await this.stockService.updateStockById(params.id.trim(), updateStockDto)
  }

  @ApiOperation({ summary: "Delete a stock with an user" })
  @Delete("/:id")
  async deleteStockById(@Param() params: ValidateIdDto) {
    return await this.stockService.deleteStockById(params.id.trim())
  }
}
