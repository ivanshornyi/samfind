import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";

import { UserService } from "./user.service";
import { UserController } from "./user.controller";

import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, JwtService, PrismaService],
  exports: [],
})
export class UserModule { }
