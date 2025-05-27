import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ 
    status: 200, 
    description: 'Service is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        uptime: { type: 'number', example: 123.456 },
        version: { type: 'string', example: '1.0.0' },
        environment: { type: 'string', example: 'development' },
      },
    },
  })
  async check() {
    return this.healthService.check();
  }

  @Get('detailed')
  @ApiOperation({ summary: 'Detailed health check with service dependencies' })
  @ApiResponse({ 
    status: 200, 
    description: 'Detailed health status',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        uptime: { type: 'number', example: 123.456 },
        version: { type: 'string', example: '1.0.0' },
        environment: { type: 'string', example: 'development' },
        services: {
          type: 'object',
          properties: {
            userService: { type: 'string', example: 'healthy' },
            vendorService: { type: 'string', example: 'healthy' },
            orderService: { type: 'string', example: 'healthy' },
            paymentService: { type: 'string', example: 'healthy' },
            integrationService: { type: 'string', example: 'healthy' },
          },
        },
      },
    },
  })
  async detailedCheck() {
    return this.healthService.detailedCheck();
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe for Kubernetes' })
  @ApiResponse({ 
    status: 200, 
    description: 'Service is ready to accept traffic',
  })
  async ready() {
    return this.healthService.readinessCheck();
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness probe for Kubernetes' })
  @ApiResponse({ 
    status: 200, 
    description: 'Service is alive',
  })
  async live() {
    return this.healthService.livenessCheck();
  }
}
