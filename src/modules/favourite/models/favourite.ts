import { Column, Entity, PrimaryColumn } from 'typeorm';
import { FavouriteEnum } from '../types/favourite.enum';

@Entity()
export class FavouritesEntity {
  @PrimaryColumn()
  entityId: string;

  @Column({
    type: 'enum',
    enum: FavouriteEnum,
  })
  entityType: FavouriteEnum;
}
