import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from '../dtos/createAlbum.dto.js';
import { validate } from 'uuid';
import { ArtistRepository } from '../../artist/services/artist.repository.js';
import { UpdateAlbumDto } from '../dtos/updateAlbum.dto.js';

@Injectable()
export class AlbumValidator {
  constructor(private artistRepository: ArtistRepository) {}
  private createAlbumRequiredFields = ['name', 'year', 'artistId'];

  areAllRequiredFieldsPresent(requiredFields: string[], dto: object): boolean {
    return requiredFields.every((field) => dto.hasOwnProperty(field));
  }

  async isValidCreateDto(albumDto: CreateAlbumDto): Promise<boolean> {
    const album: unknown & object = albumDto;
    const aggregateValidationCheck = [
      this.areAllRequiredFieldsPresent(this.createAlbumRequiredFields, album),
      albumDto.artistId !== null ? validate(albumDto.artistId) : true,
      albumDto.artistId != null
        ? await this.artistExist(albumDto.artistId)
        : true,
    ];
    return !aggregateValidationCheck.some((result) => result === false);
  }

  private async artistExist(id: string): Promise<boolean> {
    try {
      return !!(await this.artistRepository.findArtistById(id));
    } catch (error) {
      return false;
    }
  }

  async isValidUpdateDto(updateAlbumDto: UpdateAlbumDto) {
    if (updateAlbumDto.name !== undefined && updateAlbumDto.name === null) {
      return false;
    }

    if (
      updateAlbumDto.year !== undefined &&
      typeof updateAlbumDto.year !== 'number'
    ) {
      return false;
    }

    if (
      updateAlbumDto.artistId != null &&
      (!validate(updateAlbumDto.artistId) ||
        !(await this.artistExist(updateAlbumDto.artistId)))
    ) {
      return false;
    }

    return true;
  }
}
