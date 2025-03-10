import { forwardRef, Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { StripeModule } from "../stripe/stripe.module";

@Module({
  imports: [PrismaModule, forwardRef(() => StripeModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
