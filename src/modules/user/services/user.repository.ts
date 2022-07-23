import { Injectable } from '@nestjs/common';
import { User } from '../models/user.js';
import { CreateUserDto } from '../dtos/createUser.dto.js';
import * as bcrypt from 'bcrypt';
import { ValidationError } from '../../../errors/validation.error.js';
import { UserResponseDto } from '../dtos/user.responseDto.js';
import { NotFoundError } from 'rxjs';
import { UpdatePasswordDto } from '../dtos/updatePassword.dto.js';
import { ForbiddenError } from '../../../errors/forbidden.error.js';
import { EntityNotFoundError, QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DuplicateEntryError } from '../../../errors/duplicateEntry.error.js';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    try {
      const epoch = Math.ceil(+new Date() / 1000);
      const user: User = await this.userRepository.save({
        ...userDto,
        updatedAt: epoch,
        createdAt: epoch,
      });
      delete user.password;
      return user;
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError.code === '23505'
      ) {
        throw new DuplicateEntryError(error.message, userDto);
      } else {
        throw error;
      }
    }
  }

  async findOneById(id: string): Promise<User> {
    let user: User | null;
    try {
      user = await this.userRepository.findOneByOrFail({ id });
      delete user.password;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.code === '22P02') {
          throw new ValidationError(error.message, id);
        }
      } else if (error instanceof EntityNotFoundError) {
        throw new NotFoundError(`User with id: ${id} not found`);
      }

      throw error;
    }

    return user;
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserResponseDto> {
    let user: User | null;
    try {
      user = await this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError.code === '22P02'
      ) {
        throw new ValidationError(error.message, id);
      } else if (error instanceof EntityNotFoundError) {
        throw new NotFoundError(`User with id: ${id} not found`);
      }
      throw error;
    }

    if (!(await bcrypt.compare(updatePasswordDto.oldPassword, user.password))) {
      throw new ForbiddenError(`Invalid password for user: ${id}`, id);
    }

    user.password = await bcrypt.hash(updatePasswordDto.newPassword, 10);
    user = await this.userRepository.save({
      ...user,
      updatedAt: Math.floor(+new Date() / 1000),
    });
    delete user.password;
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError.code === '22P02'
      ) {
        throw new ValidationError(error.message, id);
      } else if (error instanceof EntityNotFoundError) {
        throw new NotFoundError(`User with id: ${id} not found`);
      }
      throw error;
    }

    await this.userRepository.delete(id);
  }
}
