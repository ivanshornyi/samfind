import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserService } from "../user/user.service";
import { MailService } from "../mail/mail.service";
import { StockService } from "./stock.service";
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
  async findStockById(@Param("id") id: string) {
    return await this.stockService.getStockById(id)
  }

  @ApiOperation({ summary: "Get all stocks with pagination" })
  @Get("/")
  async findAllStocksWithPagination(
    @Query("page") page: number,
    @Query("limit") limit: number,
    @Query("order") order: "asc" | "desc"
  ) {
    return await this.stockService.getAllStocksWithPagination(page, limit, order)
  }

  @ApiOperation({ summary: "Update stock by id" })
  @Patch("/:id")
  async updateStockById(@Param("id") id: string, @Body() updateStockDto: UpdateStockDto) {
    return await this.stockService.updateStockById(id, updateStockDto)
  }
}
