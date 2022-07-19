import { Artist } from '../../modules/artist/types/artist.interface.js';

export class ArtistDeletedEvent {
  constructor(private artist: Artist) {}
  getArtistId(): string {
    return this.artist.id;
  }
}
