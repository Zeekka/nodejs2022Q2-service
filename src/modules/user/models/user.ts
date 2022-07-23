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

  @Column({
    transformer: {
      to(password) {
        return bcrypt.hashSync(password, 10);
      },
      from(password) {
        return password;
      },
    },
  })
  password: string;

  @VersionColumn()
  version: number;

  @Column()
  createdAt: number;

  @Column()
  updatedAt: number;
}
