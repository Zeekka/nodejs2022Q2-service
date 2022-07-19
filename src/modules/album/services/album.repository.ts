import { Album } from '../types/album.interface.js';
import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from '../dtos/createAlbum.dto.js';
import { ValidationError } from '../../../errors/validation.error.js';
import { v4 as uuidv4 } from 'uuid';
import { AlbumValidator } from './album.validator.js';

let albums: Album[] = [];

@Injectable()
export class AlbumRepository {
  constructor(private albumValidator: AlbumValidator) {}

  async getAll(): Promise<Album[]> {
    return albums;
  }

  async createAlbum(createAlbumDto: CreateAlbumDto) {
    if (!this.albumValidator.isValidCreateDto(createAlbumDto)) {
      throw new ValidationError('Error validating artist data', createAlbumDto);
    }

    const album: Album = {
      id: uuidv4(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId,
    };

    albums.push(album);
    return album;
  }
}
