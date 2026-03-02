export interface IDownloadPdf {
  invoice: number;
  car_number: string;
  client?: boolean;
  manager?: boolean;
  payment?: boolean;
  full?: boolean;
}
