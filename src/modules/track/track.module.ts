import { Module } from '@nestjs/common';
import { TrackController } from './controllers/track.controller';
import { TrackRepository } from './services/track.repository.js';
import { TrackValidator } from './services/trackValidator.js';

@Module({
  imports: [],
  providers: [TrackRepository, TrackValidator],
  controllers: [TrackController],
  exports: [TrackRepository],
})
export class TrackModule {}
