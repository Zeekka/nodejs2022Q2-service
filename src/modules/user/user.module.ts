import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserRepository } from './services/user.repository.js';
import { UserValidator } from './services/user.validator.js';

@Module({
  imports: [],
  providers: [UserRepository, UserValidator],
  controllers: [UserController],
})
export class UserModule {}
