import { Get, Controller, Param } from "@nestjs/common";

import { ApiTags, ApiOperation } from "@nestjs/swagger";

import { LicenseVerificationService } from "./license-verification.service";

@ApiTags("User license verification")
@Controller("license-verification")
export class LicenseVerificationController {
  constructor(
    private readonly licenseVerificationService: LicenseVerificationService,
  ) {}

  @ApiOperation({ summary: "" })
  @Get("/check-user/:email")
  async checkUserByEmail(@Param("email") email: string) {
    return await this.licenseVerificationService.checkUserByEmail(email);
  }

  @ApiOperation({ summary: "" })
  @Get("/check-domain/:domain/:userEmail")
  async checkDomain(
    @Param("domain") domain: string,
    @Param("email") email: string,
  ) {
    return await this.licenseVerificationService.checkByDomain(domain, email);
  }
}
