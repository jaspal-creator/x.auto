import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Car } from './Car';
import { Customer } from './Customer';
import { ReportService } from './ReportService';
import { ReportAutoPart } from './ReportAutoPart';
import { Invoice } from './Invoice';
import { expiresIn } from '../lib/expires-date';

@Entity('Reports')
export class Report extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'int', unsigned: true })
  mileage!: number;

  @OneToOne(() => Invoice, (Invoice) => Invoice.report)
  // @JoinColumn()
  invoice!: Invoice;

  @ManyToOne(() => Car, (Car) => Car.report)
  car!: Car;

  // User snapshot fields (no foreign key relationship)
  @Column({ type: 'varchar', length: 36, nullable: true })
  user_id!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  user_name!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  user_surname!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  user_nickname!: string;

  @ManyToOne(() => Customer, (Customer) => Customer.report)
  customer!: Customer;

  @OneToMany(() => ReportService, (ReportService) => ReportService.report)
  report_services!: ReportService[];

  @OneToMany(() => ReportAutoPart, (ReportAutoPart) => ReportAutoPart.report)
  report_autoparts!: ReportAutoPart[];

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updated_at!: Date;

  @Column({
    type: 'datetime',
    nullable: true,
    default: () => expiresIn({ days: 7 })
  })
  expires_at!: Date;

  @Column({ type: 'boolean', default: false })
  updated_flag!: boolean;
}
