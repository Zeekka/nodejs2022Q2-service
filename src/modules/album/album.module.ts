import { Module } from '@nestjs/common';
import { AlbumController } from './controllers/album.controller.js';
import { AlbumRepository } from './services/album.repository.js';
import { ArtistModule } from '../artist/artist.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './models/album.js';

@Module({
  imports: [ArtistModule, TypeOrmModule.forFeature([Album])],
  providers: [AlbumRepository],
  controllers: [AlbumController],
  exports: [AlbumRepository],
})
export class AlbumModule {}
