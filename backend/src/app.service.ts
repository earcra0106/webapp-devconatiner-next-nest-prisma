import { Injectable } from '@nestjs/common';
import { prisma } from '../lib/prisma.js';
import { User } from 'generated/prisma/client.js';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHelloEndPoint(): { message: string } {
    return {
      message: 'Hello World!'
    };
  }

  async getTestSeedData(): Promise<User[]> {
    return prisma.user.findMany({
      include: {
        posts: true,
      },
    });
  }
}
