import { CreateTrackDto } from '../../track/dtos/createTrack.dto.js';
import { CreateArtistDto, UpdateArtistDto } from '../dtos/createArtist.dto.js';
import { type } from 'os';

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

  isValidUpdateDto(updateArtistDto: UpdateArtistDto) {
    if (updateArtistDto.name !== undefined && updateArtistDto.name === null) {
      return false;
    }

    if (
      updateArtistDto.grammy !== undefined &&
      typeof updateArtistDto.grammy !== 'boolean'
    ) {
      return false;
    }

    return true;
  }
}
