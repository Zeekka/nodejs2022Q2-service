import { Album } from '../../modules/album/types/album.interface.js';

export class AlbumDeletedEvent {
  constructor(private album: Album) {}
  getAlbumId(): string {
    return this.album.id;
  }
}
