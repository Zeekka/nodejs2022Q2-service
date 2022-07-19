import { Track } from '../types/track.interface.js';
import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from '../dtos/createTrack.dto.js';
import { TrackValidator } from './trackValidator.js';
import { ValidationError } from '../../../errors/validation.error.js';
import { v4 as uuidv4, validate } from 'uuid';
import { NotFoundError } from 'rxjs';
import { UpdateTrackDto } from '../dtos/updateTrack.dto.js';
import { OnEvent } from '@nestjs/event-emitter';
import { ArtistDeletedEvent } from '../../../events/artist/artistDeleted.event.js';
import { AlbumDeletedEvent } from '../../../events/album/albumDeleted.event.js';

let tracks: Track[] = [];

@Injectable()
export class TrackRepository {
  constructor(private trackValidator: TrackValidator) {}

  async getAll(): Promise<Track[]> {
    return tracks;
  }

  async createTrack(createTrackDto: CreateTrackDto): Promise<Track> {
    if (!this.trackValidator.isValidCreateDto(createTrackDto)) {
      throw new ValidationError('Error validating track data', createTrackDto);
    }

    const track: Track = {
      id: uuidv4(),
      name: createTrackDto.name,
      duration: createTrackDto.duration,
      artistId: createTrackDto.artistId ?? null,
      albumId: createTrackDto.albumId ?? null,
    };

    tracks.push(track);
    return track;
  }

  async findOneById(id: string): Promise<Track> {
    if (!validate(id)) {
      throw new ValidationError(`Provided id: ${id} is not valid`, id);
    }
    const track: Track = tracks.find((track) => track.id === id);
    if (!track) {
      throw new NotFoundError(`User with id: ${id} not found`);
    }

    return track;
  }

  async deleteTrack(id: string): Promise<Track> {
    if (!validate(id)) {
      throw new ValidationError(`Provided id: ${id} is not valid`, id);
    }
    const track: Track = tracks.find((track) => track.id === id);
    tracks = tracks.filter((track) => track.id !== id);

    if (!track) {
      throw new NotFoundError(`User with id: ${id} not found`);
    }

    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    if (!validate(id)) {
      throw new ValidationError('Invalid track id provided', id);
    }

    if (!this.trackValidator.isValidUpdateDto(updateTrackDto)) {
      throw new ValidationError('Error validating update data', updateTrackDto);
    }

    let updatedTrack: Track | null;

    tracks.forEach((track) => {
      if (track.id === id) {
        updatedTrack = track;
        track.name = updateTrackDto.name ?? track.name;
        track.duration = updateTrackDto.duration ?? track.duration;
        track.artistId = updateTrackDto.artistId ?? track.artistId;
        track.albumId = updateTrackDto.albumId ?? track.albumId;
      }
    });

    if (!updatedTrack) {
      throw new NotFoundError(`Track with id: ${id} not found`);
    }

    return updatedTrack;
  }

  @OnEvent('artist.deleted')
  async handleArtistDeletedEvent(artistDeletedEvent: ArtistDeletedEvent) {
    tracks.forEach((track) => {
      if (track.artistId === artistDeletedEvent.getArtistId()) {
        track.artistId = null;
      }
    });
  }

  @OnEvent('album.deleted')
  async handleAlbumDeletedEvent(albumDeletedEvent: AlbumDeletedEvent) {
    tracks.forEach((track) => {
      if (track.albumId === albumDeletedEvent.getAlbumId()) {
        track.albumId = null;
      }
    });
  }
}
