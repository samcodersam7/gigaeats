import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private readonly configService: ConfigService) {}

  async check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: this.configService.get('NODE_ENV'),
    };
  }

  async detailedCheck() {
    const basicHealth = await this.check();
    const services = await this.checkServices();

    return {
      ...basicHealth,
      services,
    };
  }

  async readinessCheck() {
    try {
      const services = await this.checkServices();
      const allHealthy = Object.values(services).every(status => status === 'healthy');
      
      if (allHealthy) {
        return { status: 'ready' };
      } else {
        throw new Error('Some services are not healthy');
      }
    } catch (error) {
      this.logger.error('Readiness check failed:', error.message);
      throw error;
    }
  }

  async livenessCheck() {
    return { status: 'alive' };
  }

  private async checkServices() {
    const services = this.configService.get('services');
    const serviceChecks = {};

    for (const [serviceName, serviceUrl] of Object.entries(services)) {
      try {
        const response = await axios.get(`${serviceUrl}/health`, {
          timeout: 5000,
        });
        
        serviceChecks[serviceName] = response.status === 200 ? 'healthy' : 'unhealthy';
      } catch (error) {
        this.logger.warn(`Health check failed for ${serviceName}:`, error.message);
        serviceChecks[serviceName] = 'unhealthy';
      }
    }

    return serviceChecks;
  }
}
