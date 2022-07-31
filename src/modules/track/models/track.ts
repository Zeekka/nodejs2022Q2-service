import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Artist } from '../../artist/models/artist';
import { Album } from '../../album/models/album';

@Entity()
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string; // uuid v4

  @Column()
  name: string;

  @Column({ nullable: true })
  @ManyToOne(() => Artist, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'artistId', referencedColumnName: 'id' })
  artistId: string | null; // refers to Artist

  @Column({ nullable: true })
  @ManyToOne(() => Album, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'albumId', referencedColumnName: 'id' })
  albumId: string | null; // refers to Album

  @Column()
  duration: number; // integer number
}
