import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Artist } from '../../artist/models/artist.js';
import { Album } from '../../album/models/album.js';

@Entity()
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string; // uuid v4

  @Column()
  name: string;

  @ManyToOne(() => Artist, (artist) => artist.id, {
    onDelete: 'SET NULL',
  })
  artistId: string | null; // refers to Artist

  @ManyToOne(() => Album, (album) => album.id, {
    onDelete: 'SET NULL',
  })
  albumId: string | null; // refers to Album

  @Column()
  duration: number; // integer number
}
