import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { UserRepository } from '../services/user.repository.js';
import { CreateUserDto } from '../dtos/createUser.dto.js';
import { DuplicateEntryError } from '../../../errors/duplicateEntry.error.js';
import { ValidationError } from '../../../errors/validation.error.js';
import { UserResponseDto } from '../dtos/user.responseDto.js';
import { NotFoundError } from 'rxjs';

@Controller('user')
export class UserController {
  constructor(private userRepository: UserRepository) {}
  @Get()
  async getAll(): Promise<UserResponseDto[]> {
    return await this.userRepository.getAll();
  }

  @Post()
  async createUser(
    @Body() body: CreateUserDto,
  ): Promise<UserResponseDto> | never {
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

  @Get(':id')
  async getOneById(@Param('id') id: string): Promise<UserResponseDto> {
    try {
      return this.userRepository.findOneById(id);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else if (error instanceof NotFoundError) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
