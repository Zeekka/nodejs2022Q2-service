import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from '../dtos/createAlbum.dto.js';
import { validate } from 'uuid';
import { ArtistRepository } from '../../artist/services/artist.repository.js';

@Injectable()
export class AlbumValidator {
  constructor(private artistRepository: ArtistRepository) {}
  private createAlbumRequiredFields = ['name', 'year', 'artistId'];

  areAllRequiredFieldsPresent(requiredFields: string[], dto: object): boolean {
    return requiredFields.every((field) => dto.hasOwnProperty(field));
  }

  isValidCreateDto(albumDto: CreateAlbumDto): boolean {
    const album: unknown & object = albumDto;
    const aggregateValidationCheck = [
      this.areAllRequiredFieldsPresent(this.createAlbumRequiredFields, album),
      albumDto.artistId !== null ? validate(albumDto.artistId) : true,
      albumDto.artistId != null ? this.artistExist(albumDto.artistId) : true,
    ];
    return !aggregateValidationCheck.some((result) => result === false);
  }

  private artistExist(id: string): boolean {
    try {
      return !!this.artistRepository.findArtistById(id);
    } catch (error) {
      return false;
    }
  }
}
