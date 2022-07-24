import { Artist } from '../../artist/types/artist.interface.js';
import { Album } from '../../album/types/album.interface.js';
import { Track } from '../../track/types/track.interface.js';

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
