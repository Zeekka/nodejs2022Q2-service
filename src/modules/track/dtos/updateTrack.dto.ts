import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class UpdateTrackDto {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsUUID()
  @ValidateIf((object, value) => value != null)
  artistId?: string; // refers to Artist

  @IsUUID()
  @ValidateIf((object, value) => value != null)
  albumId?: string; // refers to Album

  @IsNotEmpty()
  @IsInt()
  duration?: number; // integer number
}
