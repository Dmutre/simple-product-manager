import {
  Column,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Token } from './token.entity';
import { Product } from './product.entity';
import { Category } from './category.entity';

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

  @OneToMany(() => Product, (product) => product.user)
  products?: Product[];

  @OneToMany(() => Category, (category) => category.user)
  categories?: Category[];

  @Column({ type: 'timestamp', default: new Date() })
  createdAt: Date;
}
