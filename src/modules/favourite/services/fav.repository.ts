import { FavoritesResponse } from '../dtos/favouriteResponse.dto.js';
import { TrackRepository } from '../../track/services/track.repository.js';
import { Injectable } from '@nestjs/common';
import { ArtistRepository } from '../../artist/services/artist.repository.js';
import { AlbumRepository } from '../../album/services/album.repository.js';
import { OnEvent } from '@nestjs/event-emitter';
import { ArtistDeletedEvent } from '../../../events/artist/artistDeleted.event.js';
import { AlbumDeletedEvent } from '../../../events/album/albumDeleted.event.js';
import { TrackDeletedEvent } from '../../../events/track/trackDeleted.event.js';
import { InjectRepository } from '@nestjs/typeorm';
import { FavouritesEntity } from '../models/favourite.js';
import { In, Repository } from 'typeorm';
import { FavouriteEnum } from '../types/favourite.enum.js';
import { Track } from '../../track/models/track.js';
import { Album } from '../../album/models/album.js';
import { Artist } from '../../artist/models/artist.js';

@Injectable()
export class FavRepository {
  constructor(
    private trackRepository: TrackRepository,
    private artistRepository: ArtistRepository,
    private albumRepository: AlbumRepository,
    @InjectRepository(Track) private trackEntity: Repository<Track>,
    @InjectRepository(Album) private albumEntity: Repository<Album>,
    @InjectRepository(Artist) private artistEntity: Repository<Artist>,
    @InjectRepository(FavouritesEntity)
    private favRepository: Repository<FavouritesEntity>,
  ) {}

  async getAll(): Promise<FavoritesResponse> {
    const artistIds = await this.favRepository.find({
      where: {
        entityType: FavouriteEnum.ARTIST,
      },
    });

    const albumIds = await this.favRepository.find({
      where: {
        entityType: FavouriteEnum.ALBUM,
      },
    });

    const trackIds = await this.favRepository.find({
      where: {
        entityType: FavouriteEnum.TRACK,
      },
    });

    const tracksPromise: Promise<Track[]> = this.trackEntity.find({
      where: {
        id: In(trackIds.map((track) => track.entityId)),
      },
      select: {
        id: true,
        name: true,
        duration: true,
        artistId: true,
        albumId: true,
      },
    });

    const albumsPromise: Promise<Album[]> = this.albumEntity.find({
      where: {
        id: In(albumIds.map((album) => album.entityId)),
      },
      select: {
        id: true,
        name: true,
        year: true,
        artistId: true,
      },
    });

    const artistsPromise: Promise<Artist[]> = this.artistEntity.find({
      where: {
        id: In(artistIds.map((artist) => artist.entityId)),
      },
      select: {
        id: true,
        name: true,
        grammy: true,
      },
    });

    const [tracks, albums, artists] = await Promise.all([
      tracksPromise,
      albumsPromise,
      artistsPromise,
    ]);

    return { tracks, albums, artists };
  }

  async addTrackToFav(id: string) {
    const track: Track = await this.trackRepository.findOneById(id);
    await this.favRepository.save({
      entityId: track.id,
      entityType: FavouriteEnum.TRACK,
    });
    return 'Track added to favourites';
  }

  async addArtistToFav(id: string) {
    const artist: Artist = await this.artistRepository.findArtistById(id);
    await this.favRepository.save({
      entityId: artist.id,
      entityType: FavouriteEnum.ARTIST,
    });
    return 'Artist added to favourites';
  }

  async addAlbumToFav(id: string) {
    const album: Album = await this.albumRepository.findAlbumById(id);
    await this.favRepository.save({
      entityId: album.id,
      entityType: FavouriteEnum.ALBUM,
    });
    return 'Album added to favourites';
  }

  async removeTrackFromFav(id: string) {
    const deletedTrack: Track = await this.trackRepository.findOneById(id);
    await this.favRepository.delete({
      entityId: deletedTrack.id,
      entityType: FavouriteEnum.TRACK,
    });
    return 'Track removed from favourites';
  }

  async removeAlbumFromFav(id: string) {
    const deletedAlbum: Album = await this.albumRepository.findAlbumById(id);
    await this.favRepository.delete({
      entityId: deletedAlbum.id,
      entityType: FavouriteEnum.ALBUM,
    });
    return 'Album removed from favourites';
  }

  async removeArtistFromFav(id: string) {
    const deletedArtist: Artist = await this.artistRepository.findArtistById(
      id,
    );
    await this.favRepository.delete({
      entityId: deletedArtist.id,
      entityType: FavouriteEnum.ARTIST,
    });

    return 'Artist removed from favourites';
  }

  @OnEvent('artist.deleted')
  async handleArtistDeletedEvent(artistDeletedEvent: ArtistDeletedEvent) {
    await this.favRepository.delete({
      entityId: artistDeletedEvent.getArtistId(),
      entityType: FavouriteEnum.ARTIST,
    });
  }

  @OnEvent('album.deleted')
  async handleAlbumsDeletedEvent(albumDeletedEvent: AlbumDeletedEvent) {
    await this.favRepository.delete({
      entityId: albumDeletedEvent.getAlbumId(),
      entityType: FavouriteEnum.ARTIST,
    });
  }

  @OnEvent('track.deleted')
  async handleTrackDeletedEvent(trackDeletedEvent: TrackDeletedEvent) {
    await this.favRepository.delete({
      entityId: trackDeletedEvent.getTrackId(),
      entityType: FavouriteEnum.TRACK,
    });
  }
}
