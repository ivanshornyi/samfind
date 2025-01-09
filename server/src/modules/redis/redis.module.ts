import { Module } from "@nestjs/common";
import { RedisModule } from "@nestjs-modules/ioredis";

@Module({
  imports: [
    // RedisModule.forRoot({
      // host: 'localhost', // Або ваш хост Redis
      // port: 6379,        // Порт Redis
    // }),
  ],
  exports: [RedisModule],
})
export class AppRedisModule {}
