import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {}

  async check() {
    const databaseHealthy = await this.databaseService.healthCheck();

    return {
      status: databaseHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      service: 'user-service',
      database: databaseHealthy ? 'connected' : 'disconnected',
      environment: this.configService.get('nodeEnv'),
    };
  }

  async readinessCheck() {
    try {
      const databaseHealthy = await this.databaseService.healthCheck();
      
      if (databaseHealthy) {
        return { status: 'ready' };
      } else {
        throw new Error('Database is not healthy');
      }
    } catch (error) {
      this.logger.error('Readiness check failed:', error.message);
      throw error;
    }
  }

  async livenessCheck() {
    return { status: 'alive' };
  }
}
