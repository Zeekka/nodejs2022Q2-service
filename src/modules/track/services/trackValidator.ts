import { CreateTrackDto } from '../dtos/createTrack.dto.js';
import { UpdateTrackDto } from '../dtos/updateTrack.dto.js';
import { validate } from 'uuid';

export class TrackValidator {
  private createTrackRequiredFields = ['name', 'duration'];

  areAllRequiredFieldsPresent(requiredFields: string[], dto: object): boolean {
    return requiredFields.every((field) => dto.hasOwnProperty(field));
  }

  isValidCreateDto(trackDto: CreateTrackDto): boolean {
    const track: unknown & object = trackDto;
    return this.areAllRequiredFieldsPresent(
      this.createTrackRequiredFields,
      trackDto,
    );
  }

  isValidUpdateDto(updateDto: UpdateTrackDto): boolean {
    if (updateDto.albumId != undefined && !validate(updateDto.albumId)) {
      return false;
    }

    if (updateDto.artistId != undefined && !validate(updateDto.artistId)) {
      return false;
    }

    if (
      updateDto.duration !== undefined &&
      typeof updateDto.duration !== 'number'
    ) {
      return false;
    }

    if (updateDto.name !== undefined && updateDto.name === null) {
      return false;
    }

    return true;
  }
}
