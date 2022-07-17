import { CreateTrackDto } from '../../track/dtos/createTrack.dto.js';
import { CreateArtistDto } from '../dtos/createArtist.dto.js';

export class ArtistValidator {
  private createTrackRequiredFields = ['name', 'grammy'];

  areAllRequiredFieldsPresent(requiredFields: string[], dto: object): boolean {
    return requiredFields.every((field) => dto.hasOwnProperty(field));
  }

  isValidCreateDto(artistDto: CreateArtistDto): boolean {
    const artist: unknown & object = artistDto;
    return this.areAllRequiredFieldsPresent(
      this.createTrackRequiredFields,
      artist,
    );
  }
}
