import { FACTORYPOPULATE } from './factory-populate.models';

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
  selected?: boolean;
}

export interface GETGENERICVALUE {
  statusCode: number | string;
  status: string | number;
  data:
    | Record<string, object | undefined | boolean | null>[]
    | FACTORYPOPULATE[];
  message: string;
  error?: string;
}

export interface Data {
  DOCUMENTNAME: Documentname[];
}

export interface Documentname {
  id: number;
  values: string;
}
