export interface IcHttpResponseModel<T> {
  statusCode: number;
  status: string;
  data: T;
  message: string;
}
