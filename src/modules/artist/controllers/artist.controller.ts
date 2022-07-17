import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { Artist } from '../types/artist.interface.js';
import { ArtistRepository } from '../services/artist.repository.js';
import { CreateArtistDto } from '../dtos/createArtist.dto.js';
import { ValidationError } from '../../../errors/validation.error.js';
import { NotFoundError } from 'rxjs';

@Controller('artist')
export class ArtistController {
  constructor(private artistRepository: ArtistRepository) {}
  @Get()
  async getAll(): Promise<Artist[]> {
    return await this.artistRepository.getAll();
  }

  @Post()
  async create(@Body() artistDto: CreateArtistDto): Promise<Artist> {
    try {
      return await this.artistRepository.createArtist(artistDto);
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
  async delete(@Param('id') id: string): Promise<Artist> {
    try {
      return await this.artistRepository.deleteArtist(id);
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
