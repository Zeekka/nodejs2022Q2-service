export class CreateArtistDto {
  name: string;
  grammy: boolean;
}

export class UpdateArtistDto {
  name?: string;
  grammy?: boolean;
}
