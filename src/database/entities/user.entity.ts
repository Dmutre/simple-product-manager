import {
  Column,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Token } from './token.entity';

export enum UserRole {
  BOSS = 'BOSS',
  EMPLOYEE = 'EMPLOYEE',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  id: string;

  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'bool', default: false })
  emailApproved: boolean;

  @Column({ type: 'varchar' })
  password: string;

  @OneToMany(() => Token, (token) => token.user)
  tokens?: Token[];
}
