import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from '../dtos/createTrack.dto.js';
import { ValidationError } from '../../../errors/validation.error.js';
import { NotFoundError } from 'rxjs';
import { UpdateTrackDto } from '../dtos/updateTrack.dto.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TrackDeletedEvent } from '../../../events/track/trackDeleted.event.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Track } from '../models/track.js';
import { EntityNotFoundError, QueryFailedError, Repository } from 'typeorm';
import { DuplicateEntryError } from '../../../errors/duplicateEntry.error.js';

@Injectable()
export class TrackRepository {
  constructor(
    private eventEmitter: EventEmitter2,
    @InjectRepository(Track) private trackRepository: Repository<Track>,
  ) {}

  async getAll(): Promise<Track[]> {
    return this.trackRepository.find();
  }

  async createTrack(createTrackDto: CreateTrackDto): Promise<Track> {
    try {
      return await this.trackRepository.save(createTrackDto);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.code === '23505') {
          throw new DuplicateEntryError(error.message, createTrackDto);
        }
      }
      throw error;
    }
  }

  async findOneById(id: string): Promise<Track> {
    try {
      return await this.trackRepository.findOneByOrFail({ id });
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

  async deleteTrack(id: string): Promise<Track> {
    const track: Track = await this.findOneById(id);
    await this.trackRepository.delete(id);
    this.eventEmitter.emit('track.deleted', new TrackDeletedEvent(track));
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track: Track = await this.findOneById(id);
    track.name = updateTrackDto.name;
    track.albumId = updateTrackDto.albumId;
    track.artistId = updateTrackDto.artistId;
    track.duration = updateTrackDto.duration;
    await this.trackRepository.save(track);
    return track;
  }
}
