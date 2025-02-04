import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";

import { setupSwagger } from "./swagger";

import helmet from "helmet";

async function bootstrap() {
  const configService = new ConfigService();

  const PORT = configService.get("SERVER_PORT") || 4000;

  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.enableCors({
    origin: [
      "http://localhost:5173",
      configService.get("FRONTEND_DOMAIN"),
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  });
  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: 400,
    }),
  );
  app.use(helmet());

  setupSwagger(app);

  await app.listen(PORT);
}

bootstrap();