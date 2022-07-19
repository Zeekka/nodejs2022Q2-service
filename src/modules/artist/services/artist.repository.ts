import { Injectable } from '@nestjs/common';
import { Artist } from '../types/artist.interface.js';
import { ArtistValidator } from './artist.validator.js';
import { CreateArtistDto, UpdateArtistDto } from '../dtos/createArtist.dto.js';
import { v4 as uuidv4, validate } from 'uuid';
import { ValidationError } from '../../../errors/validation.error.js';
import { NotFoundError } from 'rxjs';

let artists: Artist[] = [];

@Injectable()
export class ArtistRepository {
  constructor(private artistValidator: ArtistValidator) {}

  async getAll(): Promise<Artist[]> {
    return artists;
  }

  async createArtist(createArtistDto: CreateArtistDto): Promise<Artist> {
    if (!this.artistValidator.isValidCreateDto(createArtistDto)) {
      throw new ValidationError(
        'Error validating artist data',
        createArtistDto,
      );
    }

    const artist: Artist = {
      id: uuidv4(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };

    artists.push(artist);
    return artist;
  }

  async deleteArtist(id: string): Promise<Artist> {
    if (!validate(id)) {
      throw new ValidationError(`Provided id: ${id} is not valid`, id);
    }
    const artist: Artist = artists.find((artist) => artist.id === id);
    artists = artists.filter((artist) => artist.id !== id);

    if (!artist) {
      throw new NotFoundError(`Artist with id: ${id} not found`);
    }

    return artist;
  }

  async findArtistById(id: string) {
    if (!validate(id)) {
      throw new ValidationError(`Provided id: ${id} is not valid`, id);
    }
    const artist: Artist = artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new NotFoundError(`User with id: ${id} not found`);
    }

    return artist;
  }

  async updateArtist(id: string, updateArtistDto: UpdateArtistDto) {
    if (!validate(id)) {
      throw new ValidationError('Invalid artist id provided', id);
    }

    if (!this.artistValidator.isValidUpdateDto(updateArtistDto)) {
      throw new ValidationError(
        'Error validating update data',
        updateArtistDto,
      );
    }

    let updatedArtist: Artist | null;

    artists.forEach((artist) => {
      if (artist.id === id) {
        updatedArtist = artist;
        artist.name = updateArtistDto.name ?? artist.name;
        artist.grammy = updateArtistDto.grammy ?? artist.grammy;
      }
    });

    if (!updatedArtist) {
      throw new NotFoundError(`Artist with id: ${id} not found`);
    }

    return updatedArtist;
  }
}
