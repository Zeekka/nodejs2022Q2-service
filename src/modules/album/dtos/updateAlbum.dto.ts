import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class UpdateAlbumDto {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsInt()
  year?: number;

  @IsUUID()
  @ValidateIf((object, value) => value != null)
  artistId?: string | null; // refers to Artist
}
