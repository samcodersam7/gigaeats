import { All, Controller, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ProxyService } from './proxy.service';

@ApiTags('proxy')
@Controller()
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @All('users/*')
  @ApiOperation({ summary: 'Proxy requests to User Service' })
  @ApiResponse({ status: 200, description: 'Request proxied successfully' })
  async proxyToUserService(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxyRequest(req, res, 'userService');
  }

  @All('vendors/*')
  @ApiOperation({ summary: 'Proxy requests to Vendor Service' })
  @ApiResponse({ status: 200, description: 'Request proxied successfully' })
  async proxyToVendorService(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxyRequest(req, res, 'vendorService');
  }

  @All('orders/*')
  @ApiOperation({ summary: 'Proxy requests to Order Service' })
  @ApiResponse({ status: 200, description: 'Request proxied successfully' })
  async proxyToOrderService(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxyRequest(req, res, 'orderService');
  }

  @All('payments/*')
  @ApiOperation({ summary: 'Proxy requests to Payment Service' })
  @ApiResponse({ status: 200, description: 'Request proxied successfully' })
  async proxyToPaymentService(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxyRequest(req, res, 'paymentService');
  }

  @All('integrations/*')
  @ApiOperation({ summary: 'Proxy requests to Integration Service' })
  @ApiResponse({ status: 200, description: 'Request proxied successfully' })
  async proxyToIntegrationService(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.proxyRequest(req, res, 'integrationService');
  }
}
