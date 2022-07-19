export class UpdateAlbumDto {
  name?: string;
  year?: number;
  artistId?: string | null; // refers to Artist
}
