import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserRepository } from '../services/user.repository.js';
import { CreateUserDto } from '../dtos/createUser.dto.js';
import { DuplicateEntryError } from '../../../errors/duplicateEntry.error.js';
import { ValidationError } from '../../../errors/validation.error.js';
import { UserResponseDto } from '../dtos/user.responseDto.js';
import { NotFoundError } from 'rxjs';
import { UpdatePasswordDto } from '../dtos/updatePassword.dto.js';
import { ForbiddenError } from '../../../errors/forbidden.error.js';

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

  @Put(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() body: UpdatePasswordDto,
  ): Promise<UserResponseDto> {
    try {
      return await this.userRepository.updatePassword(id, body);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else if (error instanceof NotFoundError) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else if (error instanceof ForbiddenError) {
        throw new HttpException(error.message, HttpStatus.FORBIDDEN);
      } else {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      return this.userRepository.deleteUser(id);
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
