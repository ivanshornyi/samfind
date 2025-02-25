import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule, PrismaService } from "nestjs-prisma";
import { TransactionHistoryController } from "./transaction-history.controller";
import { TransactionHistoryService } from "./transaction-history.service";

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule
  ],
  controllers: [TransactionHistoryController],
  providers: [
    PrismaService,
    TransactionHistoryService
  ],
  exports: [TransactionHistoryService]
})
export class TransactionHistoryModule { }
