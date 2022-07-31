import { Module } from '@nestjs/common';
import { TrackController } from './controllers/track.controller';
import { TrackRepository } from './services/track.repository.js';
import { TrackValidator } from './services/trackValidator.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from './models/track.js';

@Module({
  imports: [TypeOrmModule.forFeature([Track])],
  providers: [TrackRepository, TrackValidator],
  controllers: [TrackController],
  exports: [TrackRepository],
})
export class TrackModule {}
