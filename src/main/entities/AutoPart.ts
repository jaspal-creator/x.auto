import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { ReportAutoPart } from './ReportAutoPart';

@Entity('AutoParts')
export class AutoPart extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar', nullable: true })
  code!: string;

  @Column({ type: 'varchar', nullable: true })
  manufacturer!: string;

  @OneToMany(() => ReportAutoPart, (ReportAutoPart) => ReportAutoPart.autopart)
  report_autoparts!: ReportAutoPart[];

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updated_at!: Date;
}
