import { Module } from '@nestjs/common';
import { FavouriteController } from './controllers/favourite.controller';
import { FavRepository } from './services/fav.repository.js';
import { TrackModule } from '../track/track.module.js';
import { AlbumModule } from '../album/album.module.js';
import { ArtistModule } from '../artist/artist.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavouritesEntity } from './models/favourite.js';
import { Track } from '../track/models/track.js';
import { Album } from '../album/models/album.js';
import { Artist } from '../artist/models/artist.js';

@Module({
  imports: [
    TrackModule,
    AlbumModule,
    ArtistModule,
    TypeOrmModule.forFeature([FavouritesEntity, Track, Album, Artist]),
  ],
  providers: [FavRepository],
  controllers: [FavouriteController],
})
export class FavouriteModule {}
