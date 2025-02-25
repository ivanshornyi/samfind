import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { TransactionHistoryService } from "./transaction-history.service";

@ApiTags("TransactionHistory")
@Controller("transaction-history")

export class TransactionHistoryController {
  constructor(private readonly transactionHistoryService: TransactionHistoryService) { }

  @ApiOperation({ summary: "Get all transactions with pagination" })
  @Get("/")
  async getEntireTransactionHistoryWithPagination(
    @Query("page") page: number,
    @Query("limit") limit: number,
    @Query("order") order: "asc" | "desc"
  ) {
    return await this.transactionHistoryService.getAllTransactionHistoriesWithPagination(page, limit, order)
  }
}
