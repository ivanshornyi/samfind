import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { setupSwagger } from "./swagger";

import helmet from "helmet";

async function bootstrap() {
  const configService = new ConfigService();

  const PORT = configService.get("SERVER_PORT") || 4000;
  const FRONTEND_DOMAIN =
    configService.get("FRONTEND_DOMAIN") || "http://localhost:3000";
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.enableCors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:4000",
      "https://www.onsio.io",
      "https://onsio.io",
      FRONTEND_DOMAIN,
    ],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"],
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
