import { IcHttpResponseModel } from '@onerumango/utils';
import { Observable } from 'rxjs';
import { GenericValueInfoModel } from '../models/generic-value.model';

export abstract class GenericValue {
  abstract loadGenericValue(
    genericName: string[],
    screenCode: number,
  ): Observable<IcHttpResponseModel<GenericValueInfoModel>>;
}
