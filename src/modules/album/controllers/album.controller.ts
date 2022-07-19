import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AlbumRepository } from '../services/album.repository.js';
import { Album } from '../types/album.interface.js';
import { ValidationError } from '../../../errors/validation.error.js';
import { CreateAlbumDto } from '../dtos/createAlbum.dto.js';

@Controller('album')
export class AlbumController {
  constructor(private albumRepository: AlbumRepository) {}

  @Get()
  async getAll(): Promise<Album[]> {
    return this.albumRepository.getAll();
  }

  @Post()
  async create(@Body() albumDto: CreateAlbumDto): Promise<Album> {
    try {
      return await this.albumRepository.createAlbum(albumDto);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
