import { Injectable } from '@nestjs/common';
import { User } from '../types/user.interface.js';
import { CreateUserDto } from '../dtos/createUser.dto.js';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { UserValidator } from './user.validator.js';
import { ValidationError } from '../../../errors/validation.error.js';

let users: User[] = [];

@Injectable()
export class UserRepository {
  constructor(private userValidator: UserValidator) {}

  async getAll() {
    return users;
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    if (this.userValidator.validateCreateDto(userDto)) {
      throw new ValidationError(`Error validating createUserDto`, userDto);
    }
    if (!this.userValidator.isUniqueLogin(await this.getAll(), userDto.login)) {
      throw new ValidationError(
        `Duplicate entry for login ${userDto.login}`,
        userDto,
      );
    }

    const id = uuidv4();
    const user: User = {
      id: id,
      login: userDto.login,
      password: await bcrypt.hash(userDto.password, 10),
      version: 1,
      createdAt: +new Date(),
      updatedAt: null,
    };

    users.push(user);

    return user;
  }
}
