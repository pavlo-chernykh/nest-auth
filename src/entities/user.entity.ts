import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';
import { Roles } from './roles.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ default: null, nullable: true, select: false })
  password: string;

  @Column({ default: null, nullable: true })
  name: string;

  @Column({ default: null, nullable: true })
  profile_image: string;

  @Column({ default: null, nullable: true, select: false })
  confirm_email_key: string;

  @CreateDateColumn()
  created: Date;

  @ManyToMany(() => Roles)
  @JoinTable()
  roles: Roles[];
}
