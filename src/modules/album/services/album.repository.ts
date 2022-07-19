import { Album } from '../types/album.interface.js';
import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from '../dtos/createAlbum.dto.js';
import { ValidationError } from '../../../errors/validation.error.js';
import { v4 as uuidv4, validate } from 'uuid';
import { AlbumValidator } from './album.validator.js';
import { NotFoundError } from 'rxjs';
import { UpdateAlbumDto } from '../dtos/updateAlbum.dto.js';

let albums: Album[] = [];

@Injectable()
export class AlbumRepository {
  constructor(private albumValidator: AlbumValidator) {}

  async getAll(): Promise<Album[]> {
    return albums;
  }

  async createAlbum(createAlbumDto: CreateAlbumDto) {
    if (!(await this.albumValidator.isValidCreateDto(createAlbumDto))) {
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

  async deleteAlbum(id: string): Promise<Album> {
    if (!validate(id)) {
      throw new ValidationError(`Provided id: ${id} is not valid`, id);
    }
    const album: Album = albums.find((album) => album.id === id);
    albums = albums.filter((album) => album.id !== id);

    if (!album) {
      throw new NotFoundError(`Album with id: ${id} not found`);
    }

    return album;
  }

  async findAlbumById(id: string): Promise<Album> {
    if (!validate(id)) {
      throw new ValidationError(`Provided id: ${id} is not valid`, id);
    }
    const album: Album = albums.find((album) => album.id === id);
    if (!album) {
      throw new NotFoundError(`User with id: ${id} not found`);
    }

    return album;
  }

  async updateAlbum(id: string, updateAlbumDto: UpdateAlbumDto) {
    if (!validate(id)) {
      throw new ValidationError('Invalid album id provided', id);
    }

    if (!(await this.albumValidator.isValidUpdateDto(updateAlbumDto))) {
      throw new ValidationError('Error validating update data', updateAlbumDto);
    }

    let updatedAlbum: Album | null;

    albums.forEach((album) => {
      if (album.id === id) {
        updatedAlbum = album;
        album.name = updateAlbumDto.name ?? album.name;
        album.year = updateAlbumDto.year ?? album.year;
        album.artistId = updateAlbumDto.artistId ?? album.artistId;
      }
    });

    if (!updatedAlbum) {
      throw new NotFoundError(`Album with id: ${id} not found`);
    }

    return updatedAlbum;
  }
}
