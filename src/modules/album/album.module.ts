import { Module } from '@nestjs/common';
import { AlbumController } from './controllers/album.controller.js';

@Module({
  imports: [],
  providers: [],
  controllers: [AlbumController],
})
export class AlbumModule {}
