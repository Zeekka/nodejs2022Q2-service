import { Module } from '@nestjs/common';
import { AlbumController } from './controllers/album.controller.js';
import { AlbumRepository } from './services/album.repository.js';
import { AlbumValidator } from './services/album.validator.js';
import { ArtistModule } from '../artist/artist.module.js';

@Module({
  imports: [ArtistModule],
  providers: [AlbumRepository, AlbumValidator],
  controllers: [AlbumController],
  exports: [AlbumRepository],
})
export class AlbumModule {}
