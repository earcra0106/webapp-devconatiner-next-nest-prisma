import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { User } from 'generated/prisma/client.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('hello')
  getHelloEndPoint(): { message: string } {
    return this.appService.getHelloEndPoint();
  }

  @Get('test')
  async getTestSeedData(): Promise<{ data: User[] }> {
    const data = await this.appService.getTestSeedData();
    return {
      data: data
    };
  }
}
