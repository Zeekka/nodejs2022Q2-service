import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module.js';
import { AlbumModule } from './modules/album/album.module.js';
import { TrackModule } from './modules/track/track.module.js';
import { FavouriteModule } from './modules/favourite/favourite.module.js';
import { ArtistModule } from './modules/artist/artist.module.js';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/models/user.js';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      synchronize: true,
      entities: [User],
      autoLoadEntities: true,
    }),
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
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
