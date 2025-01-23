import { ResetPasswordDto } from "./dto/reset-password-dto";
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";

import { UserAuthType } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

import { UserService } from "../user/user.service";
import { TokenService } from "./token.service";
import { MailService } from "../mail/mail.service";

import { SignInDto, SignUpDto } from "./dto/auth-user-dto";
import { SendCodeForEmailDto } from "./dto/send-code-for-email.dto";
import { CheckEmailDto } from "./dto/check-email-dto";

import { createHash } from "crypto";
import { AuthVerificationDto } from "./dto/auth-verification-dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
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
      accountType,
      organization,
    } = signUpDto;

    // send verification code
    const registrationCode = this.generateCode().code;
    const registrationCodeExpiresAt = this.generateCode().codeExpiresAt;

    await this.mailService.sendRegistrationCode(email, registrationCode);

    const existingUser = await this.userService.findUserByEmail(email, authType);

    if (existingUser && existingUser.isVerified) {
      throw new ConflictException("User with this email already exists and verified");
    }

    const hashedPassword = this.hashField(password);

    // if user have a link (have licenseId or organizationId) =>
    // with organization add to organization, add to license

    // with user group add to license

    if (!existingUser) {
      const newUser = await this.userService.create({
        firstName,
        lastName,
        email,
        authType,
        password: hashedPassword,
        registrationCode,
        registrationCodeExpiresAt,
        accountType,
      });

      if (organization) {
        await this.prisma.organization.create({
          data: {
            ...organization,
            ownerId: newUser.id,
          }
        });
      }

      return newUser;
    } else {
      await this.userService.updateUser(existingUser.id, { registrationCode, registrationCodeExpiresAt, accountType });

      return existingUser;
    }
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

    const resetCode = this.generateCode().code;
    const resetCodeExpiresAt = this.generateCode().codeExpiresAt;

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

    const emailResetCode = this.generateCode().code;
    const emailResetCodeExpiresAt = this.generateCode().codeExpiresAt;

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
  
    if (user.resetCodeExpiresAt.getTime() < new Date().getTime()) {
      throw new NotFoundException("Verification code has expired");
    }
  
    if (
      resetPasswordDto.verificationCode === user?.resetCode &&
      user.resetCodeExpiresAt.getTime() > new Date().getTime()
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
  
    if (user.emailResetCodeExpiresAt.getTime() < new Date().getTime()) {
      throw new NotFoundException("Verification code has expired");
    }

    if (
      emailUpdateDto.verificationCode === user?.emailResetCode &&
      user.emailResetCodeExpiresAt.getTime() > new Date().getTime()
    ) {
      await this.userService.updateUser(
        user.id, { email: emailUpdateDto.newEmail }
      );
    }
  }

  public async verifyUserCode(authVerificationDto: AuthVerificationDto) {
    const user = await this.userService.findUserByEmail(authVerificationDto.email, UserAuthType.email);
  
    if (!user) {
      throw new NotFoundException("User not found");
    }
  
    if (user.isVerified) {
      throw new ConflictException("User is already verified");
    }
  
    if (authVerificationDto.verificationCode !== user.registrationCode) {
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

    if (authVerificationDto.licenseId) {
      // add user email to license
    }

    if (authVerificationDto.organizationId) {
      // add user email to organization
      // add to license
    }

    const tokens = await this.tokenService.generateTokens({
      sub: user.id,
    });

    await this.tokenService.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...user,
      ...tokens,
    };
  }

  public async checkEmailForDomain(checkEmailDto: CheckEmailDto) {
    const { email, organizationId } = checkEmailDto;

    const organization = await this.prisma.organization.findUnique({
      where: {
        id: organizationId,
      }
    });

    if (!organization) {
      throw new NotFoundException("Organization not found");
    }
    
    if (!organization.domain) {
      throw new ConflictException("This organization does not have a domain");
    }

    const emailDomainPart = email.split("@")[1];

    // find organization if organization has a domain check by second part of email
    // check includes domain email or not
  }

  private hashField(password: string): string {
    return createHash("sha256").update(password).digest("hex");
  }

  private isPasswordValid(password: string, hashedPassword: string): boolean {
    const hash = this.hashField(password);

    return hash === hashedPassword;
  }

  private generateCode() {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    return {
      code,
      codeExpiresAt,
    }
  }
}
