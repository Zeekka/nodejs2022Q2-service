import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AlbumRepository } from '../services/album.repository.js';
import { Album } from '../types/album.interface.js';
import { ValidationError } from '../../../errors/validation.error.js';
import { CreateAlbumDto } from '../dtos/createAlbum.dto.js';
import { NotFoundError } from 'rxjs';
import { UpdateAlbumDto } from '../dtos/updateAlbum.dto.js';

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

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<Album> {
    try {
      return await this.albumRepository.deleteAlbum(id);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else if (error instanceof NotFoundError) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Album> {
    try {
      return await this.albumRepository.findAlbumById(id);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else if (error instanceof NotFoundError) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ): Promise<UpdateAlbumDto> {
    try {
      return await this.albumRepository.updateAlbum(id, updateAlbumDto);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else if (error instanceof NotFoundError) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
