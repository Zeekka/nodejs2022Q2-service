import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserRepository } from './services/user.repository.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.js';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserRepository],
  controllers: [UserController],
})
export class UserModule {}
