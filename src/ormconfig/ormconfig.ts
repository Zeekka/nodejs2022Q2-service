import { User } from '../modules/user/models/user';
import { Artist } from '../modules/artist/models/artist';
import { Album } from '../modules/album/models/album';
import { Track } from '../modules/track/models/track';
import { FavouritesEntity } from '../modules/favourite/models/favourite';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions.js';

export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User, Artist, Album, Track, FavouritesEntity],
  migrationsTableName: 'migrations_typeorm',
  migrations: ['./src/migrations/*.js'],
};

export const connectionSource = new DataSource(
  config as unknown as PostgresConnectionOptions,
);
