import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Job } from './Job';

@Entity('Users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50 })
  name!: string;

  @Column({ type: 'varchar', length: 50 })
  surname!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  nickname!: string;

  @Column({ type: 'date' })
  date_of_birth!: Date;

  @Column({ type: 'varchar' })
  password!: string;

  @Column({ type: 'int2', default: 0 })
  role!: number;

  @ManyToOne(() => Job, (job) => job.user)
  job!: Job;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updated_at!: Date;
}
