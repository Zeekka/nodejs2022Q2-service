import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [],
  providers: [],
  controllers: [UserController],
})
export class UserModule {}
