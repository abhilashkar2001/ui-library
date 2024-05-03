import { IcHttpResponseModel } from "./ic-http-response.model";

export interface FlexBalanceModel extends IcHttpResponseModel {
  data: Data;
}

export interface Data {
  currbal: number;
}
