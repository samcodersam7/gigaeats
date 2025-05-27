import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Security middleware
  app.use(helmet());
  app.use(compression());

  // CORS configuration
  app.enableCors({
    origin: configService.get('CORS_ORIGIN')?.split(',') || ['http://localhost:3001'],
    credentials: configService.get('CORS_CREDENTIALS') === 'true',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Swagger documentation
  if (configService.get('ENABLE_SWAGGER') === 'true') {
    const config = new DocumentBuilder()
      .setTitle('GigaEats API Gateway')
      .setDescription('API Gateway for GigaEats microservices platform')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Authentication endpoints')
      .addTag('users', 'User management endpoints')
      .addTag('vendors', 'Vendor management endpoints')
      .addTag('orders', 'Order management endpoints')
      .addTag('payments', 'Payment and commission endpoints')
      .addTag('integrations', 'External integration endpoints')
      .addTag('health', 'Health check endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  const port = configService.get('API_GATEWAY_PORT') || 3000;
  await app.listen(port);

  logger.log(`🚀 API Gateway is running on: http://localhost:${port}`);
  logger.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap().catch((error) => {
  console.error('Failed to start API Gateway:', error);
  process.exit(1);
});
