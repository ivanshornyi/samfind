import { Module } from "@nestjs/common";
import { PrismaModule, PrismaService } from "nestjs-prisma";
import { PursharedSharesController } from "./purshared-shares.controller";
import { PursharedSharesService } from "./purshared-shares.service";
import { UserService } from "../user/user.service";

@Module({
  imports: [PrismaModule],
  controllers: [PursharedSharesController],
  providers: [PrismaService, UserService, PursharedSharesService],
  exports: [PursharedSharesService]
})
export class PursharedSharesModule { }
