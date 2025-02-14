import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { AddAppVersionDto } from "./dto/add-app-versin-dto";
import { OsType } from "@prisma/client";

@Injectable()
export class AppVersionService {
  constructor(private readonly prisma: PrismaService) {}

  async addAppVersion(dto: AddAppVersionDto) {
    return await this.prisma.appVersion.create({ data: dto });
  }

  async getLastAppVersion(osType: OsType) {
    const latestAppVersion = await this.prisma.appVersion.findFirst({
      where: {
        osType,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!latestAppVersion) return { error: "Version not found" };

    return { version: latestAppVersion.version, url: latestAppVersion.url };
  }
}
