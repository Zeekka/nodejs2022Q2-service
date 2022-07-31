import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateArtistDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  grammy: boolean;
}

export class UpdateArtistDto {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsBoolean()
  @IsNotEmpty()
  grammy?: boolean;
}
