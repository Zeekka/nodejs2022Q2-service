import { Module } from '@nestjs/common';
import { ArtistController } from './controllers/artist.controller';
import { ArtistRepository } from './services/artist.repository.js';
import { ArtistValidator } from './services/artist.validator.js';

@Module({
  imports: [],
  providers: [ArtistRepository, ArtistValidator],
  controllers: [ArtistController],
})
export class ArtistModule {}
