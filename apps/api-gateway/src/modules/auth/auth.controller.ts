import { All, Controller, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly configService: ConfigService) {}

  @All('*')
  @ApiOperation({ summary: 'Proxy authentication requests to User Service' })
  @ApiResponse({ status: 200, description: 'Authentication request proxied successfully' })
  async proxyAuthRequest(@Req() req: Request, @Res() res: Response) {
    try {
      const userServiceUrl = this.configService.get('services.userService');
      const targetUrl = `${userServiceUrl}/auth${req.path}`;

      // Prepare headers
      const headers = { ...req.headers };
      delete headers.host;
      delete headers.connection;
      delete headers['content-length'];

      // Make the request to the user service
      const response = await axios({
        method: req.method as any,
        url: targetUrl,
        data: req.body,
        headers,
        params: req.query,
        timeout: 30000,
        validateStatus: () => true,
      });

      // Copy response headers
      Object.keys(response.headers).forEach(key => {
        if (key !== 'transfer-encoding' && key !== 'connection') {
          res.setHeader(key, response.headers[key]);
        }
      });

      res.status(response.status).send(response.data);

    } catch (error) {
      console.error('Auth proxy error:', error.message);
      res.status(502).json({
        message: 'Authentication service unavailable',
        error: 'Bad Gateway',
        statusCode: 502,
      });
    }
  }
}
