import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from '../dtos/createAlbum.dto.js';
import { ValidationError } from '../../../errors/validation.error.js';
import { NotFoundError } from 'rxjs';
import { UpdateAlbumDto } from '../dtos/updateAlbum.dto.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AlbumDeletedEvent } from '../../../events/album/albumDeleted.event.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from '../models/album.js';
import { EntityNotFoundError, QueryFailedError, Repository } from 'typeorm';
import { DuplicateEntryError } from '../../../errors/duplicateEntry.error.js';

@Injectable()
export class AlbumRepository {
  constructor(
    private eventEmitter: EventEmitter2,
    @InjectRepository(Album) private albumRepository: Repository<Album>,
  ) {}

  async getAll(): Promise<Album[]> {
    return this.albumRepository.find();
  }

  async createAlbum(createAlbumDto: CreateAlbumDto) {
    try {
      return await this.albumRepository.save(createAlbumDto);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.code === '23505') {
          throw new DuplicateEntryError(error.message, createAlbumDto);
        }
      }
      throw error;
    }
  }

  async deleteAlbum(id: string): Promise<Album> {
    const album: Album = await this.findAlbumById(id);
    await this.albumRepository.delete(id);
    this.eventEmitter.emit('album.deleted', new AlbumDeletedEvent(album));
    return album;
  }

  async findAlbumById(id: string): Promise<Album> {
    try {
      return await this.albumRepository.findOneByOrFail({ id });
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

  async updateAlbum(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album: Album = await this.findAlbumById(id);
    album.name = updateAlbumDto.name;
    album.year = updateAlbumDto.year;
    album.artistId = updateAlbumDto.artistId;
    await this.albumRepository.save(album);
    return album;
  }
}
