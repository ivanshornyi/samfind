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
import { SendCodeForEmailDto } from "./dto/send-code-for-email.dto";
import { UserAuthType } from "@prisma/client";

import { createHash } from "crypto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
  ) {}

  public async signUp(signUpDto: SignUpDto) {
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      authType,
    } = signUpDto;

    // send verification code
    const registrationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const registrationCodeExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.mailService.sendRegistrationCode(email, registrationCode);

    const existingUser = await this.userService.findUserByEmail(email, authType);

    if (existingUser && existingUser.isVerified) {
      throw new ConflictException("User with this email already exists and verified");
    }

    const hashedPassword = this.hashField(password);

    const newUser = await this.userService.create({
      firstName,
      lastName,
      email,
      authType,
      password: hashedPassword,
      registrationCode,
      registrationCodeExpiresAt,
    });

    return newUser;
  }

  public async signIn(signInDto: SignInDto) {
    const { email, password, authType } = signInDto;

    const user = await this.userService.findUserByEmail(email, authType);
  
    if (!user) {
      throw new NotFoundException("User not found");
    }
  
    if (!user.isVerified) {
      throw new UnauthorizedException("User is not verified");
    }

    const isPasswordValid = this.isPasswordValid(password, user.password);

    if (!isPasswordValid) {
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
    const user = await this.userService.findUserByEmail(email, UserAuthType.email);

    if (!user) {
      throw new NotFoundException(
        "User does not exist or does not use email authentication",
      );
    }

    if (!user.isVerified) {
      throw new NotFoundException("User is not verified");
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpiresAt = new Date(Date.now() + 15 * 60 * 1000).getTime();

    await this.userService.updateUser(user.id, { resetCode, resetCodeExpiresAt });

    await this.mailService.sendResetCode(user.email, resetCode);

    return { message: "Reset code sent successfully" };
  }

  public async sendResetEmailVerificationCode(sendCodeForEmailDto: SendCodeForEmailDto) {
    const user = await this.userService.findOne(sendCodeForEmailDto.userId);

    const isUserWithSameEmailExist = await this.userService.findUserByEmail(sendCodeForEmailDto.email, UserAuthType.email);

    if (isUserWithSameEmailExist) {
      throw new UnauthorizedException("User with this email already exist");
    }

    const isPasswordValid = this.isPasswordValid(sendCodeForEmailDto.password, user.password);
  
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid password");
    }

    const emailResetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const emailResetCodeExpiresAt = new Date(Date.now() + 15 * 60 * 1000).getTime();

    await this.userService.updateUser(user.id, { emailResetCode, emailResetCodeExpiresAt });

    await this.mailService.sendResetCodeForEmailUpdate(user.email, emailResetCode);
  }

  public async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userService.findUserByEmail(
      resetPasswordDto.email,
      UserAuthType.email,
    );
  
    if (!user) {
      throw new NotFoundException("User not found");
    }
  
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
      const hashedNewPassword = this.hashField(resetPasswordDto.newPassword);

      await this.userService.updateUser(
        user.id, { password: hashedNewPassword }, true
      );
  
      return { message: "Password reset successfully" };
    }
  
    throw new UnauthorizedException("Password reset failed");
  }

  public async resetEmail(emailUpdateDto: { userId: string, verificationCode: string, newEmail: string }) {
    const user = await this.userService.findOne(emailUpdateDto.userId);
  
    if (!user) {
      throw new NotFoundException("User not found");
    }
  
    if (emailUpdateDto.verificationCode !== user?.emailResetCode) {
      throw new NotFoundException("Verification code is not correct");
    }
  
    if (user.emailResetCodeExpiresAt < new Date().getTime()) {
      throw new NotFoundException("Verification code has expired");
    }

    if (
      emailUpdateDto.verificationCode === user?.emailResetCode &&
      user.emailResetCodeExpiresAt > new Date().getTime()
    ) {
      await this.userService.updateUser(
        user.id, { email: emailUpdateDto.newEmail }
      );
    }
  }

  public async verifyUserCode(email: string, code: string) {
    const user = await this.userService.findUserByEmail(email, UserAuthType.email);
  
    if (!user) {
      throw new NotFoundException("User not found");
    }
  
    if (user.isVerified) {
      throw new ConflictException("User is already verified");
    }
  
    if (code !== user.registrationCode) {
      throw new UnauthorizedException("Invalid verification code");
    }
  
    if (user.registrationCodeExpiresAt.getTime() < new Date().getTime()) {
      throw new UnauthorizedException("Verification code has expired");
    }
  
    await this.userService.updateUser(user.id, {
      isVerified: true,
      registrationCode: null,
      registrationCodeExpiresAt: null,
    });

    const tokens = await this.tokenService.generateTokens({
      sub: user.id,
    });

    await this.tokenService.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...user,
      ...tokens,
    };
  }

  private hashField(password: string): string {
    return createHash("sha256").update(password).digest("hex");
  }

  private isPasswordValid(password: string, hashedPassword: string): boolean {
    const hash = this.hashField(password);

    return hash === hashedPassword;
  }

  private generateResetFields() {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpiresAt = new Date(Date.now() + 15 * 60 * 1000).getTime();

    return {
      code,
      codeExpiresAt,
    }
  }
}
