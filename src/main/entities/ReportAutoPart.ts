import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Report } from './Report';
import { AutoPart } from './AutoPart';

@Entity('Reports-AutoParts')
export class ReportAutoPart extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Report, (Report) => Report.report_autoparts, { onDelete: 'CASCADE' })
  report!: Report;

  @ManyToOne(() => AutoPart, (AutoPart) => AutoPart.report_autoparts, { onDelete: 'CASCADE' })
  autopart!: AutoPart;

  @Column({ type: 'decimal' })
  quantity!: number;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updated_at!: Date;
}
