import { Module } from '@nestjs/common';
import { FavouriteController } from './controllers/favourite.controller';
import { FavRepository } from './services/fav.repository.js';
import { TrackModule } from '../track/track.module.js';
import { AlbumModule } from '../album/album.module.js';
import { ArtistModule } from '../artist/artist.module.js';

@Module({
  imports: [TrackModule, AlbumModule, ArtistModule],
  providers: [FavRepository],
  controllers: [FavouriteController],
})
export class FavouriteModule {}
