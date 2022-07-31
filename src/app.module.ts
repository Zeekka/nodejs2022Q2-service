import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module.js';
import { AlbumModule } from './modules/album/album.module.js';
import { TrackModule } from './modules/track/track.module.js';
import { FavouriteModule } from './modules/favourite/favourite.module.js';
import { ArtistModule } from './modules/artist/artist.module.js';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './ormconfig/ormconfig.js';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    EventEmitterModule.forRoot(),
    UserModule,
    AlbumModule,
    ArtistModule,
    FavouriteModule,
    TrackModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
