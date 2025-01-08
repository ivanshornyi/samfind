import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { TokenService } from "../../modules/auth/token.service";
import { JwtPayload } from "../types/interfaces/jwt-payload.interface";
import { EXCEPTION } from "../constants/exception.constant";

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(EXCEPTION.INVALID_TOKEN);
    }

    try {
      const payload: JwtPayload =
        await this.tokenService.validateRefreshToken(token);

      request["user"] = payload;

      return true;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];

    return type === "Bearer" ? token : undefined;
  }
}
