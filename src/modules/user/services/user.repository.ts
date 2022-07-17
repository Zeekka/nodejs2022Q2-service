import { Injectable } from '@nestjs/common';
import { User } from '../types/user.interface.js';
import { CreateUserDto } from '../dtos/createUser.dto.js';
import { v4 as uuidv4, validate } from 'uuid';
import * as bcrypt from 'bcrypt';
import { UserValidator } from './user.validator.js';
import { ValidationError } from '../../../errors/validation.error.js';
import { UserResponseDto } from '../dtos/user.responseDto.js';
import { NotFoundError } from 'rxjs';
import { UpdatePasswordDto } from '../dtos/updatePassword.dto.js';
import { ForbiddenError } from '../../../errors/forbidden.error.js';

let users: User[] = [];

@Injectable()
export class UserRepository {
  constructor(private userValidator: UserValidator) {}

  async getAll(): Promise<UserResponseDto[]> {
    return users.map((user) => new UserResponseDto(user));
  }

  async createUser(userDto: CreateUserDto): Promise<UserResponseDto> {
    if (!this.userValidator.isValidateCreateDto(userDto)) {
      throw new ValidationError(`Error validating createUserDto`, userDto);
    }
    if (!this.userValidator.isUniqueLogin(await this.getAll(), userDto.login)) {
      throw new ValidationError(
        `Duplicate entry for login ${userDto.login}`,
        userDto,
      );
    }

    const createdDate: number = +new Date();
    const id = uuidv4();
    const user: User = {
      id: id,
      login: userDto.login,
      password: await bcrypt.hash(userDto.password, 10),
      version: 1,
      createdAt: createdDate,
      updatedAt: createdDate,
    };

    users.push(user);
    return new UserResponseDto(user);
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

  deleteUser(id: string): UserResponseDto {
    if (!validate(id)) {
      throw new ValidationError(`Provided id: ${id} is not valid`, id);
    }
    const user: User = users.find((user) => user.id === id);
    users = users.filter((user) => user.id !== id);

    if (!user) {
      throw new NotFoundError(`User with id: ${id} not found`);
    }

    return new UserResponseDto(user);
  }
}
