import { Injectable } from '@nestjs/common';
import { prisma } from '../lib/prisma.js';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHelloEndPoint(): object {
    return {
      message: 'Hello World!'
    };
  }

  getTestSeedData(): object {
    return prisma.user.findMany({
      include: {
        posts: true,
      },
    });
  }
}
