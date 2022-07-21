import { Injectable } from '@nestjs/common';
import { User } from '../models/user.js';
import { CreateUserDto } from '../dtos/createUser.dto.js';
import * as bcrypt from 'bcrypt';
import { UserValidator } from './user.validator.js';
import { ValidationError } from '../../../errors/validation.error.js';
import { UserResponseDto } from '../dtos/user.responseDto.js';
import { NotFoundError } from 'rxjs';
import { UpdatePasswordDto } from '../dtos/updatePassword.dto.js';
import { ForbiddenError } from '../../../errors/forbidden.error.js';
import { QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DuplicateEntryError } from '../../../errors/duplicateEntry.error.js';
import { validate } from 'uuid';

const users: User[] = [];

@Injectable()
export class UserRepository {
  constructor(
    private userValidator: UserValidator,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getAll(): Promise<UserResponseDto[]> {
    return this.userRepository.find();
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    try {
      const user: User = await this.userRepository.save(userDto);
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

  findOneById(id: string): UserResponseDto {
    if (!validate(id)) {
      throw new ValidationError(`Provided id: ${id} is not valid`, id);
    }
    const user: User = users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundError(`User with id: ${id} not found`);
    }
    return new UserResponseDto(user);
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserResponseDto> {
    if (!validate(id)) {
      throw new ValidationError(`Provided id: ${id} is not valid`, id);
    }

    if (this.userValidator.isUpdatePasswordPayloadValid(updatePasswordDto)) {
      throw new ValidationError(
        'Password update request is not valid',
        'Request body is not valid',
      );
    }
    const user: User = users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundError(`User with id: ${id} not found`);
    }
    if (
      !(await this.userValidator.isValidOldPassword(user, updatePasswordDto))
    ) {
      throw new ForbiddenError(`Invalid password for user: ${id}`, id);
    }

    user.password = await bcrypt.hash(updatePasswordDto.newPassword, 10);
    user.version++;
    user.updatedAt = +new Date();

    return new UserResponseDto(user);
  }

  async deleteUser(id: string): Promise<void> {
    let user: User | null;
    try {
      user = await this.userRepository.findOneBy({ id });
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError.code === '22P02'
      ) {
        throw new ValidationError(error.message, id);
      } else {
        throw error;
      }
    }

    if (!user) {
      throw new NotFoundError(`User with id: ${id} not found`);
    }

    await this.userRepository.delete(id);
  }
}
