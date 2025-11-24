import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service.js';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { UpdateUserDto } from './dto/update-user.dto.js';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.service.createUser(dto);
  }

  @Get()
  async findAll() {
    return this.service.listUsers();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.getUser(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.service.updateUser(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.deleteUser(id);
  }
}