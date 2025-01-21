import { Body, Controller, Param, Post, Req, UseGuards } from "@nestjs/common";

import { SignInDto, SignUpDto } from "./dto/auth-user-dto";
import { ResetPasswordDto } from "./dto/reset-password-dto";

import { AuthService } from "./auth.service";

import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SendCodeForEmailDto } from "./dto/send-code-for-email.dto";
import { AuthVerificationDto } from "./dto/auth-verification-dto"; 

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "Sign in" })
  @Post("/sign-in")
  public async signIn(@Body() signInUserDto: SignInDto) {
    return this.authService.signIn(signInUserDto);
  }

  @ApiOperation({ summary: "Sign up" })
  @Post("/sign-up")
  public async signUp(@Body() signUpUserDto: SignUpDto) {
    return this.authService.signUp(signUpUserDto);
  }

  @ApiOperation({ summary: "Send verification code for reset password" })
  @Post("/send-verification-code")
  public async sendResetPasswordCode(@Body() sendVerificationCodeDto: { email: string }) {
    return this.authService.sendResetPasswordVerificationCode(sendVerificationCodeDto.email);
  }

  @ApiOperation({ summary: "Reset password" })
  @Post("/reset-password")
  public async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @ApiOperation({ summary: "Send verification code for email update" })
  @Post("/email/send-verification-code")
  public async sendVerificationCodeForEmail(@Body() sendCodeForEmailDto: SendCodeForEmailDto) {
    return this.authService.sendResetEmailVerificationCode(sendCodeForEmailDto);
  }

  @ApiOperation({ summary: "Update user email" })
  @Post("/email/update")
  public async updateEmail(@Body() emailUpdateDto: { userId: string, verificationCode: string, newEmail: string }) {
    return this.authService.resetEmail(emailUpdateDto);
  }

  @ApiOperation({ summary: "Verify user" })
  @Post("/verify")
  public async verifyUser(@Body() verificationDto: AuthVerificationDto) {
    return this.authService.verifyUserCode(verificationDto.email, verificationDto.verificationCode);
  }
}
