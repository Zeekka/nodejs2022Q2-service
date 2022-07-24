export class UpdateTrackDto {
  name?: string;
  artistId?: string; // refers to Artist
  albumId?: string; // refers to Album
  duration?: number; // integer number
}
