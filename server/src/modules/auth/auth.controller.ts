import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { Response } from "express";
import { SignInDto, SignUpDto } from "./dto/auth-user-dto";
import { ResetPasswordDto } from "./dto/reset-password-dto";

import { AuthService } from "./auth.service";

import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SendCodeForEmailDto } from "./dto/send-code-for-email.dto";
import { AuthVerificationDto } from "./dto/auth-verification-dto";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  public constructor(private readonly authService: AuthService) { }

  @ApiOperation({ summary: "Sign in" })
  @Post("/sign-in")
  public async signIn(@Body() signInUserDto: SignInDto, @Res() res: Response) {
    const resp = await this.authService.signIn(signInUserDto);

    if ("accessToken" in resp && "id" in resp) {
      res.cookie("accessToken", resp.accessToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // CSRF guard
        maxAge: 15 * 60 * 1000, // 15m (in miliseconds)
        path: "/",
      });

      res.cookie("refreshToken", resp.refreshToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
      });

      res.cookie("userId", resp.id, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
      });

      res.cookie("userFirstName", resp.firstName, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
      });

      res.cookie("userLastName", resp.lastName, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
      });
    }

    return res.status(200).json(resp);
  }

  @ApiOperation({ summary: "Sign up" })
  @Post("/sign-up")
  public async signUp(@Body() signUpUserDto: SignUpDto) {
    return this.authService.signUp(signUpUserDto);
  }

  @ApiOperation({ summary: "Sign out" })
  @Post("/sign-out")
  public async signOut(@Req() request) {
    return this.authService.signOut(request.user.sub);
  }

  @ApiOperation({ summary: "Send verification code for reset password" })
  @Post("/send-verification-code")
  public async sendResetPasswordCode(
    @Body() sendVerificationCodeDto: { email: string },
  ) {
    return this.authService.sendResetPasswordVerificationCode(
      sendVerificationCodeDto.email,
    );
  }

  @ApiOperation({ summary: "Reset password" })
  @Post("/reset-password")
  public async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @ApiOperation({ summary: "Send verification code for email update" })
  @Post("/email/send-verification-code")
  public async sendVerificationCodeForEmail(
    @Body() sendCodeForEmailDto: SendCodeForEmailDto,
  ) {
    return this.authService.sendResetEmailVerificationCode(sendCodeForEmailDto);
  }

  @ApiOperation({ summary: "Update user email" })
  @Post("/email/update")
  public async updateEmail(
    @Body()
    emailUpdateDto: {
      userId: string;
      verificationCode: string;
      newEmail: string;
    },
  ) {
    return this.authService.resetEmail(emailUpdateDto);
  }

  @ApiOperation({ summary: "Verify user" })
  @Post("/verify")
  public async verifyUser(
    @Body() verificationDto: AuthVerificationDto,
    @Res() res: Response,
  ) {
    const resp = await this.authService.verifyUserCode(verificationDto);

    res.cookie("accessToken", resp.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // CSRF guard
      maxAge: 15 * 60 * 1000, // 15m (in miliseconds)
      path: "/",
    });

    res.cookie("refreshToken", resp.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    res.cookie("userId", resp.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    return res.status(200).json(resp);
  }
}
