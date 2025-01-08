import { ResetPasswordDto } from "./dto/reset-password-dto";
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";

import { UserService } from "../user/user.service";
import { TokenService } from "./token.service";
import { MailService } from "../mail/mail.service";

import { SignInDto, SignUpDto } from "./dto/auth-user-dto";
import { UserAuthType } from "../user/types/user";

import { createHash } from "crypto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
  ) {}

  public async signUp(signUpDto: SignUpDto) {
    const { firstName, lastName, email, password, authType } = signUpDto;

    const existingUser = await this.userService.findUserByEmail(email, authType);

    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    const hashedPassword = this.hashPassword(password);

    const newUser = await this.userService.create({
      firstName,
      lastName,
      email,
      authType,
      password: hashedPassword,
    });

    const tokens = await this.tokenService.generateTokens({
      sub: newUser.id,
    });

    await this.tokenService.updateRefreshToken(newUser.id, tokens.refreshToken);

    delete newUser.password;
    delete newUser.refreshToken;

    return {
      ...newUser,
      ...tokens,
    };
  }

  public async signIn(signInDto: SignInDto) {
    const { email, password, authType } = signInDto;

    const user = await this.userService.findUserByEmail(email, authType);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    console.log(password, user.password);

    if (!this.isPasswordValid(password, user.password)) {
      throw new UnauthorizedException("Invalid password");
    }

    const tokens = await this.tokenService.generateTokens({
      sub: user.id,
    });

    await this.tokenService.updateRefreshToken(user.id, tokens.refreshToken);

    delete user.password;
    delete user.refreshToken;

    return {
      ...user,
      ...tokens,
    };
  }

  public async sendResetPasswordVerificationCode(email: string) {
    const user = await this.userService.findUserByEmail(email, UserAuthType.Email);

    if (!user) {
      throw new NotFoundException(
        "User does not exist or does not use email authentication",
      );
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpiresAt = new Date(Date.now() + 15 * 60 * 1000).getTime();

    await this.userService.updateUser(user.id, { resetCode, resetCodeExpiresAt });

    await this.mailService.sendResetCode(user.email, resetCode);

    return { message: "Reset code sent successfully" };
  }

  public async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userService.findUserByEmail(
      resetPasswordDto.email,
      UserAuthType.Email,
    );

    if (resetPasswordDto.verificationCode !== user?.resetCode) {
      throw new NotFoundException("Verification code is not correct");
    }

    if (user.resetCodeExpiresAt < new Date().getTime()) {
      throw new NotFoundException("Verification code has expired");
    }

    if (
      resetPasswordDto.verificationCode === user?.resetCode &&
      user.resetCodeExpiresAt > new Date().getTime()
    ) {
      const hashedNewPassword = this.hashPassword(resetPasswordDto.newPassword);
      console.log("pass", resetPasswordDto.newPassword, hashedNewPassword);

      await this.userService.updateUser(user.id, {
        password: hashedNewPassword,
      });
    }

    return { message: "Password reset successfully" };
  }

  public hashPassword(password: string): string {
    return createHash("sha256").update(password).digest("hex");
  }

  private isPasswordValid(password: string, hashedPassword: string): boolean {
    const hash = this.hashPassword(password);

    return hash === hashedPassword;
  }
}
