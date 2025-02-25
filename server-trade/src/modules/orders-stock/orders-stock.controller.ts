import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { StockOrdersService } from "./orders-stock.service";
import { CreateStockOrderDto } from "./dto/create-order-dto";

@ApiTags("StockOrders")
@Controller("stock-orders")

export class StockOrdersController {
  constructor(private readonly stockOrdersService: StockOrdersService) { }

  @ApiOperation({ summary: "Create order for sell stocks" })
  @Post("/")
  async createStockOrder(@Body() createStockOrderDto: CreateStockOrderDto) {
    return await this.stockOrdersService.createStockOrder(createStockOrderDto)
  }

  @ApiOperation({ summary: "Cancel | Delete order from the market" })
  @Post("/cancel/:id")
  async eraseStockOrder(@Param("id") id: string) {
    return await this.stockOrdersService.cancelStockOrder(id)
  }

  @ApiOperation({ summary: "Get all StockOrders with pagination" })
  @Get("/")
  async getAllStockOrdersWithPagination(
    @Query("page") page: number,
    @Query("limit") limit: number,
    @Query("order") order: "asc" | "desc"
  ) {
    return await this.stockOrdersService.getAllStockOrdersWithPagination(page, limit, order)
  }
}
