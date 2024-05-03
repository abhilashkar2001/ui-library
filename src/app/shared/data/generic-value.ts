import { Observable } from "rxjs";

export abstract class GenericValue {
  abstract loadGenericValue(
    screenName: string,
    genericName: string[]
  ): Observable<any>;
}
