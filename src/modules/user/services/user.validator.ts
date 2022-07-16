import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/createUser.dto.js';
import { User } from '../types/user.interface.js';
import { UserResponseDto } from '../dtos/user.responseDto.js';
import { UpdatePasswordDto } from '../dtos/updatePassword.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserValidator {
  private createUserRequiredFields = ['login', 'password'];
  private updatePasswordRequiredFields = ['oldPassword', 'newPassword'];

  areAllRequiredFieldsPresent(requiredFields: string[], dto: object): boolean {
    return requiredFields.every((field) => dto.hasOwnProperty(field));
  }

  isValidateCreateDto(createUser: CreateUserDto): boolean {
    const userDto: unknown & object = createUser;
    return this.areAllRequiredFieldsPresent(
      this.createUserRequiredFields,
      userDto,
    );
  }

  isUniqueLogin(users: UserResponseDto[], login: string): boolean {
    for (const user of users) {
      if (user.login === login) {
        return false;
      }
    }

    return true;
  }

  isUpdatePasswordPayloadValid(updatePasswordDto: UpdatePasswordDto) {
    const passwordDto: unknown & object = updatePasswordDto;
    return !this.areAllRequiredFieldsPresent(
      this.updatePasswordRequiredFields,
      passwordDto,
    );
  }

  async isValidOldPassword(user: User, passwordDto: UpdatePasswordDto) {
    return await bcrypt.compare(passwordDto.oldPassword, user.password);
  }
}
