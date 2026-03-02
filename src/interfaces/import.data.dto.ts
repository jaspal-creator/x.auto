import { AutoPart, Customer, Service } from '../main/entities';

export interface IImportData {
  customers?: Customer[];
  services?: Service[];
  auto_parts?: AutoPart[];
}
