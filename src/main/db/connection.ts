import { DataSource } from 'typeorm';
import { app } from 'electron';
import { resolve } from 'path';
import {
  Company,
  User,
  Job,
  AutoPart,
  Service,
  Customer,
  Car,
  Report,
  ReportService,
  ReportAutoPart,
  Invoice
} from '../entities';

const isProduction = process.env.NODE_ENV === 'production';

// Validate required environment variables
const dbName = process.env.MAIN_VITE_DB_NAME || import.meta.env.MAIN_VITE_DB_NAME || 'x.auto.db';
if (!dbName) {
  throw new Error('MAIN_VITE_DB_NAME environment variable is required');
}

console.log(`Database configuration: ${isProduction ? 'production' : 'development'} mode`);
console.log(`Database name: ${dbName}`);
console.log(`Database path: ${resolve(app.getPath('userData'), dbName)}`);

export const xautodb = new DataSource({
  type: 'better-sqlite3',
  database: resolve(app.getPath('userData'), dbName),
  logging: !isProduction,
  synchronize: true,
  entities: [
    Job,
    User,
    Company,
    AutoPart,
    Service,
    Customer,
    Car,
    Report,
    ReportService,
    ReportAutoPart,
    Invoice
  ],
  migrations: [],
  subscribers: []
});
