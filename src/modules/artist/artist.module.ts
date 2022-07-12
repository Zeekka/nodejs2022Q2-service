import { Module } from '@nestjs/common';
import { ArtistController } from './controllers/artist.controller';

@Module({
  imports: [],
  providers: [],
  controllers: [ArtistController],
})
export class ArtistModule {}
