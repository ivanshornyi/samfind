import { Controller, Post, Body } from "@nestjs/common";

import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SendSupportEmailDto } from "./dto/send-support-email-dto";
import { MailService } from "./mail.service";

@ApiTags("Mail")
@Controller("mail")
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @ApiOperation({ summary: "Send support Email" })
  @Post("/support")
  async sendSupportEmail(@Body() sendSupportEmailDto: SendSupportEmailDto) {
    return this.mailService.sendSupportEmail(sendSupportEmailDto);
  }
}
