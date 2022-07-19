import { FavoritesResponse } from '../dtos/favouriteResponse.dto.js';
import { validate } from 'uuid';
import { ValidationError } from '../../../errors/validation.error.js';
import { TrackRepository } from '../../track/services/track.repository.js';
import { Track } from '../../track/types/track.interface.js';
import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { Artist } from '../../artist/types/artist.interface.js';
import { ArtistRepository } from '../../artist/services/artist.repository.js';
import { AlbumRepository } from '../../album/services/album.repository.js';
import { Album } from '../../album/types/album.interface.js';

const favs: FavoritesResponse = {
  albums: [],
  artists: [],
  tracks: [],
};

@Injectable()
export class FavRepository {
  constructor(
    private trackRepository: TrackRepository,
    private artistRepository: ArtistRepository,
    private albumRepository: AlbumRepository,
  ) {}
  async getAll(): Promise<FavoritesResponse> {
    return favs;
  }

  async addTrackToFav(id: string) {
    const track: Track = await this.trackRepository.findOneById(id);
    favs.tracks.push(track);
    return 'Track added to favourites';
  }

  async addArtistToFav(id: string) {
    const artist: Artist = await this.artistRepository.findArtistById(id);
    favs.artists.push(artist);
    return 'Artist added to favourites';
  }

  async addAlbumToFav(id: string) {
    const album: Album = await this.albumRepository.findAlbumById(id);
    favs.albums.push(album);
    return 'Album added to favourites';
  }

  async removeTrackFromFav(id: string) {
    let deletedTrack: Track = await this.trackRepository.findOneById(id);
    deletedTrack = null;
    favs.tracks = favs.tracks.filter((track) => {
      if (track.id === id) {
        deletedTrack = track;
      }
      return track.id !== id;
    });

    if (!deletedTrack) {
      throw new NotFoundError('Track is not found in favourites');
    }

    return 'Track removed from favourites';
  }

  async removeAlbumFromFav(id: string) {
    let deletedAlbum: Album = await this.albumRepository.findAlbumById(id);
    deletedAlbum = null;
    favs.albums = favs.albums.filter((album) => {
      if (album.id === id) {
        deletedAlbum = album;
      }
      return album.id !== id;
    });

    if (!deletedAlbum) {
      throw new NotFoundError('Track is not found in favourites');
    }

    return 'Album removed from favourites';
  }

  async removeArtistFromFav(id: string) {
    let deletedArtist: Artist = await this.artistRepository.findArtistById(id);
    deletedArtist = null;
    favs.artists = favs.artists.filter((artist) => {
      if (artist.id === id) {
        deletedArtist = artist;
      }
      return artist.id !== id;
    });

    if (!deletedArtist) {
      throw new NotFoundError('Artist is not found in favourites');
    }

    return 'Artist removed from favourites';
  }
}
