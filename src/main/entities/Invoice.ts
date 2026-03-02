import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Report } from './Report';
import { InvoiceSatatus } from '../../interfaces';

@Entity('Invoices')
export class Invoice extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'varchar', default: InvoiceSatatus.READY })
  status!: InvoiceSatatus;

  @Column({ type: 'text' })
  actions_prices!: string;

  @Column({ type: 'text' })
  details_prices!: string;

  @Column({ type: 'decimal', unsigned: true, precision: 6, scale: 2 })
  tva!: number;

  @Column({ type: 'decimal', unsigned: true, precision: 6, scale: 2 })
  total!: number;

  @OneToOne(() => Report, (Report) => Report.invoice, { onDelete: 'CASCADE' })
  @JoinColumn()
  report!: Report;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updated_at!: Date;
}
