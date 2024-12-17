export interface COUNTRYCURRENCY {
  currency: any;
  statusCode: number;
  status: string;
  data: Data;
  Data?: Data;
  message: string;
}

export interface Data {
  country: string;
  dateFormat: Date;
  currency: string;
}
