import { Body, Controller, Post } from "@nestjs/common";
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
    return await this.stockOrdersService.createStockService(createStockOrderDto)
  }
}
