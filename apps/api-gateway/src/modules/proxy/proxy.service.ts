import { Injectable, Logger, BadGatewayException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);

  constructor(private readonly configService: ConfigService) {}

  async proxyRequest(req: Request, res: Response, serviceName: string) {
    try {
      const services = this.configService.get('services');
      const serviceUrl = services[serviceName];

      if (!serviceUrl) {
        throw new BadGatewayException(`Service ${serviceName} not configured`);
      }

      // Remove the service prefix from the path
      const servicePath = req.path.replace(/^\/api\/v1\/[^\/]+/, '');
      const targetUrl = `${serviceUrl}${servicePath}`;

      this.logger.debug(`Proxying ${req.method} ${req.path} to ${targetUrl}`);

      // Prepare headers (exclude host and connection headers)
      const headers = { ...req.headers };
      delete headers.host;
      delete headers.connection;
      delete headers['content-length'];

      // Make the request to the target service
      const response: AxiosResponse = await axios({
        method: req.method as any,
        url: targetUrl,
        data: req.body,
        headers,
        params: req.query,
        timeout: 30000, // 30 seconds timeout
        validateStatus: () => true, // Don't throw on HTTP error status codes
      });

      // Copy response headers
      Object.keys(response.headers).forEach(key => {
        if (key !== 'transfer-encoding' && key !== 'connection') {
          res.setHeader(key, response.headers[key]);
        }
      });

      // Send the response
      res.status(response.status).send(response.data);

    } catch (error) {
      this.logger.error(`Proxy error for ${serviceName}:`, error.message);

      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        throw new BadGatewayException(`Service ${serviceName} is unavailable`);
      }

      if (error.response) {
        // Forward the error response from the service
        res.status(error.response.status).send(error.response.data);
      } else {
        throw new BadGatewayException(`Failed to proxy request to ${serviceName}`);
      }
    }
  }
}
