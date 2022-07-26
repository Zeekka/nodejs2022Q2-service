import { Column, Entity, PrimaryGeneratedColumn, VersionColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  login: string;

  @Column()
  password: string;

  @VersionColumn()
  version: number;

  @Column()
  createdAt: number;

  @Column()
  updatedAt: number;
}
