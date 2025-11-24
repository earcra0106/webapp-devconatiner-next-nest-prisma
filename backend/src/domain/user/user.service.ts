import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository.js';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { UpdateUserDto } from './dto/update-user.dto.js';
import type { User } from '../../../generated/prisma/client.js';

@Injectable()
export class UserService {
  constructor(private readonly repo: UserRepository) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const existing = await this.repo.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException('email already exists');
    }
    // TODO: パスワードハッシュ化を実装する（現状はプレーンテキスト）
    return this.repo.create(dto);
  }

  async listUsers(): Promise<User[]> {
    return this.repo.findAll();
  }

  async getUser(id: string): Promise<User> {
    const user = await this.repo.findById(id);
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.repo.findByEmail(email);
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
    await this.getUser(id); // 存在確認（NotFoundを投げる）
    return this.repo.update(id, dto);
  }

  async deleteUser(id: string): Promise<User> {
    await this.getUser(id);
    return this.repo.delete(id);
  }
}
