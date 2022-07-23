import { Injectable } from '@nestjs/common';
import { CreateArtistDto, UpdateArtistDto } from '../dtos/createArtist.dto.js';
import { ValidationError } from '../../../errors/validation.error.js';
import { NotFoundError } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ArtistDeletedEvent } from '../../../events/artist/artistDeleted.event.js';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, QueryFailedError, Repository } from 'typeorm';
import { Artist } from '../models/artist.js';
import { DuplicateEntryError } from '../../../errors/duplicateEntry.error.js';

@Injectable()
export class ArtistRepository {
  constructor(
    private eventEmitter: EventEmitter2,
    @InjectRepository(Artist) private artistRepository: Repository<Artist>,
  ) {}

  async getAll(): Promise<Artist[]> {
    return this.artistRepository.find();
  }

  async createArtist(createArtistDto: CreateArtistDto): Promise<Artist> {
    try {
      return await this.artistRepository.save(createArtistDto);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.code === '23505') {
          throw new DuplicateEntryError(error.message, createArtistDto);
        }
      }
      throw error;
    }
  }

  async deleteArtist(id: string): Promise<Artist> {
    const artist: Artist = await this.findArtistById(id);
    await this.artistRepository.delete(id);
    this.eventEmitter.emit('artist.deleted', new ArtistDeletedEvent(artist));
    return artist;
  }

  async findArtistById(id: string) {
    try {
      return await this.artistRepository.findOneByOrFail({ id });
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.code === '22P02') {
          throw new ValidationError(error.message, id);
        }
      }
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundError(error.message);
      }
      throw error;
    }
  }

  async updateArtist(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = await this.findArtistById(id);
    artist.name = updateArtistDto.name;
    artist.grammy = updateArtistDto.grammy;
    await this.artistRepository.save(artist);
    return artist;
  }
}
