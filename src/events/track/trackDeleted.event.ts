import { Track } from '../../modules/track/types/track.interface.js';

export class TrackDeletedEvent {
  constructor(private track: Track) {}
  getTrackId(): string {
    return this.track.id;
  }
}
