import { Module } from '@nestjs/common';
import { FavouriteController } from './controllers/favourite.controller';

@Module({
  imports: [],
  providers: [],
  controllers: [FavouriteController],
})
export class FavouriteModule {}
