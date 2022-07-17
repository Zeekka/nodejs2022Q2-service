import { Injectable } from '@nestjs/common';
import { Artist } from '../types/artist.interface.js';
import { ArtistValidator } from './artist.validator.js';
import { CreateArtistDto } from '../dtos/createArtist.dto.js';
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

  //
  // async findOneById(id: string): Promise<artist> {
  //   if (!validate(id)) {
  //     throw new ValidationError(`Provided id: ${id} is not valid`, id);
  //   }
  //   const artist: artist = artists.find((artist) => artist.id === id);
  //   if (!artist) {
  //     throw new NotFoundError(`User with id: ${id} not found`);
  //   }
  //
  //   return artist;
  // }
  //
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

  //
  // async update(id: string, updateartistDto: UpdateartistDto) {
  //   if (!validate(id)) {
  //     throw new ValidationError('Invalid artist id provided', id);
  //   }
  //
  //   if (!this.artistValidator.isValidUpdateDto(updateartistDto)) {
  //     throw new ValidationError('Error validating update data', updateartistDto);
  //   }
  //
  //   let updatedartist: artist | null;
  //
  //   artists.forEach((artist) => {
  //     if (artist.id === id) {
  //       updatedartist = artist;
  //       artist.name = updateartistDto.name ?? artist.name;
  //       artist.duration = updateartistDto.duration ?? artist.duration;
  //       artist.artistId = updateartistDto.artistId ?? artist.artistId;
  //       artist.albumId = updateartistDto.albumId ?? artist.albumId;
  //     }
  //   });
  //
  //   if (!updatedartist) {
  //     throw new NotFoundError(`artist with id: ${id} not found`);
  //   }
  //
  //   return updatedartist;
  // }
}
