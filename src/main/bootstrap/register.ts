import { Auth } from '../channels/auth/auth.channels';
import { AutoPart } from '../channels/auto-parts/auto-parts.channels';
import { Backup } from '../channels/backup/backup.channels';
import { Cache } from '../channels/cache/cache.channels';
import { Car } from '../channels/cars/cars.channels';
import { Company } from '../channels/company/company.channels';
import { Customer } from '../channels/customers/customers.channels';
import { Exporter } from '../channels/exporter/exporter.channels';
import { Importer } from '../channels/importer/importer.channels';
import { Invoice } from '../channels/invoices/invoices.channels';
import { Job } from '../channels/jobs/jobs.channels';
import { Pdf } from '../channels/pdf/pdf.channels';
import { Printer } from '../channels/printer/printer.channels';
import { Report } from '../channels/reports/reports.channels';
import { Service } from '../channels/services/services.channels';
import { Stats } from '../channels/stats/stats.channels';
import { User } from '../channels/users/users.channels';

export const Register: { name: string; channel: any }[] = [
  { name: 'Users', channel: User },
  { name: 'Jobs', channel: Job },
  { name: 'Company', channel: Company },
  { name: 'Auth', channel: Auth },
  { name: 'AutoParts', channel: AutoPart },
  { name: 'Services', channel: Service },
  { name: 'Customers', channel: Customer },
  { name: 'Cars', channel: Car },
  { name: 'Exporter', channel: Exporter },
  { name: 'Importer', channel: Importer },
  { name: 'Backup', channel: Backup },
  { name: 'Report', channel: Report },
  { name: 'Invoice', channel: Invoice },
  { name: 'Stats', channel: Stats },
  { name: 'Pdf', channel: Pdf },
  { name: 'Printer', channel: Printer },
  { name: 'Cache', channel: Cache }
];
