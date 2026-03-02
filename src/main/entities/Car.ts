import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Customer } from './Customer';
import { Report } from './Report';

@Entity('Cars')
export class Car extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50 })
  brand!: string;

  @Column({ type: 'varchar', length: 50 })
  model!: string;

  @Column({ type: 'varchar', length: 10 })
  car_number!: string;

  @Column({ type: 'int', unsigned: true })
  year!: number;

  @Column({ type: 'decimal', unsigned: true, precision: 2 })
  engine_capacity!: number;

  @Column({ type: 'varchar', length: 17, unique: true })
  vin!: string;

  @ManyToOne(() => Customer, (Customer) => Customer.car)
  customer!: Customer;

  @OneToMany(() => Report, (Report) => Report.car)
  report!: Report[];

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updated_at!: Date;
}
