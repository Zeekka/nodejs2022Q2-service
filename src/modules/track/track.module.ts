import { Module } from '@nestjs/common';
import { TrackController } from './controllers/track.controller';

@Module({
  imports: [],
  providers: [],
  controllers: [TrackController],
})
export class TrackModule {}
