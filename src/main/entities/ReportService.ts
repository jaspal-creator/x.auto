import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Report } from './Report';
import { Service } from './Service';

@Entity('Reports-Services')
export class ReportService extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Report, (Report) => Report.report_services, { onDelete: 'CASCADE' })
  report!: Report;

  @ManyToOne(() => Service, (Service) => Service.report_services, { onDelete: 'CASCADE' })
  service!: Service;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updated_at!: Date;
}
