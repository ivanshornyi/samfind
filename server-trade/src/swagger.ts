import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle("API-TRADE")
    .setDescription("API trade description")
    .setVersion("2.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api", app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
    },
  });
}

export function createErrorResponseSchema(): SchemaObject {
  return {
    type: "object",
    properties: {
      message: { type: "string", example: "Forbidden" },
      statusCode: { type: "number", example: 403 },
      error: { type: "string", example: "Forbidden" },
    },
  };
}
