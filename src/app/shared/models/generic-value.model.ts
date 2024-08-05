export interface GenericValuePayloadModel {
  screenName: string[];
  genericName: string[];
}

export interface GenericValueInfoModel {
  [key: string]: GenericValueData[];
}

export interface GenericValueData {
  id: number;
  values: string;
}