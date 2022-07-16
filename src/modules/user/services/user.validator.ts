import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/createUser.dto.js';
import { User } from '../types/user.interface.js';

@Injectable()
export class UserValidator {
  private createUserRequiredFields = ['login', 'password'];

  validateCreateDto(createUser: CreateUserDto): boolean {
    const userDto: unknown & object = createUser;
    return !this.createUserRequiredFields.every((field) =>
      userDto.hasOwnProperty(field),
    );
  }

  isUniqueLogin(users: User[], login: string): boolean {
    for (const user of users) {
      if (user.login === login) {
        return false;
      }
    }

    return true;
  }
}