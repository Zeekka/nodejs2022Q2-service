import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UserRepository } from '../services/user.repository.js';
import { User } from '../types/user.interface.js';
import { CreateUserDto } from '../dtos/createUser.dto.js';
import { DuplicateEntryError } from '../../../errors/duplicateEntry.error.js';
import { ValidationError } from '../../../errors/validation.error.js';

@Controller('user')
export class UserController {
  constructor(private userRepository: UserRepository) {}
  @Get()
  async getAll(): Promise<User[]> {
    return await this.userRepository.getAll();
  }

  @Post()
  async createUser(@Body() body: CreateUserDto): Promise<User> {
    try {
      return await this.userRepository.createUser(body);
    } catch (error) {
      if (
        error instanceof DuplicateEntryError ||
        error instanceof ValidationError
      ) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
