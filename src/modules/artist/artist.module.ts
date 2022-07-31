import { Module } from '@nestjs/common';
import { ArtistController } from './controllers/artist.controller';
import { ArtistRepository } from './services/artist.repository.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './models/artist.js';

@Module({
  imports: [TypeOrmModule.forFeature([Artist])],
  providers: [ArtistRepository],
  controllers: [ArtistController],
  exports: [ArtistRepository],
})
export class ArtistModule {}
