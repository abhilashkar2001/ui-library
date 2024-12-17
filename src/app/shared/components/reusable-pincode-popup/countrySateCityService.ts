import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class countryStateService {
  protected basePath = environment.microServiceURL;

  private subjectMaintenanceData = new BehaviorSubject({});

  constructor(private httpClient: HttpClient) {}

  setCountryDetails(value: any) {
    this.subjectMaintenanceData.next(value);
  }

  getCountryDetails(): Observable<any> {
    return this.subjectMaintenanceData.asObservable();
  }

  getAllCountry() {
    return this.httpClient.get<any>(`${this.basePath}/country`);
  }

  getState(filterBy: any, page: any, size: any, sortName: any, direction: any) {
    let filterEndpoint = '';
    if (filterBy) {
      const keys = Object.keys(filterBy);
      keys.forEach((key) => {
        if (filterBy[key])
          key == 'newFilter'
            ? (filterEndpoint = filterEndpoint + `branchCode=${filterBy[key]}&`)
            : (filterEndpoint = filterEndpoint + `${key}=${filterBy[key]}&`);
      });
    }
    const filter = `${filterEndpoint}&`;
    const pagination = `page=${page}&size=${size}&`;
    const sortOperation = `sort=${sortName}&sortOrder=${direction}&`;

    return this.httpClient.get<any>(
      `${this.basePath}/state?${filterBy ? `${filter}` : ''}${
        page ? `${pagination}` : ''
      }${sortName ? `${sortOperation}` : ''}`,
    );
  }

  getAllState() {
    return this.httpClient.get<any>(
      `${this.basePath}/state?authStatus=AUTHORIZED&recordStatus=OPEN`,
    );
  }

  getStateById(id: any) {
    return this.httpClient.get(`${this.basePath}/state?stateId=${id}`);
  }
  getStateById1(id: any) {
    return this.httpClient.get(
      `${this.basePath}/loginApi/${id}/revisions?fetchChanges=true&classname='icState'`,
    );
  }

  getStateByCountry(countryId: any) {
    return this.httpClient.get<any>(
      `${this.basePath}/state?countryId=${countryId}&authStatus=AUTHORIZED&recordStatus=OPEN`,
    );
  }

  upsertCountryDetails(payload: any) {
    return this.httpClient.post<any>(`${this.basePath}/country`, payload);
  }

  deleteCountry(id: any) {
    return this.httpClient.delete<any>(`${this.basePath}/country?id=${id}`);
  }

  getCountryById(id: any) {
    return this.httpClient.get(`${this.basePath}/country?countryId=${id}`);
  }

  getStateByCountryId(
    filterBy: any,
    filterValue: any,
    page: any,
    size: any,
    countryId: any,
    sortName: any,
    direction: any,
  ) {
    const filter = `${filterBy}=${filterValue}`;
    const pagination = `page=${page}&size=${size}`;
    const sortOperation = `sort=${sortName}&sortOrder=${direction}`;

    const payload =
      sortName && filterBy
        ? `&${filter}&${sortOperation}&${pagination}`
        : sortName
          ? `&${sortOperation}&${pagination}`
          : page && size
            ? filterBy
              ? `&${filter}&${pagination}`
              : `&${pagination}`
            : '';
    return this.httpClient.get<any>(
      `${this.basePath}/state?countryId=${countryId}${payload}`,
    );
  }

  upsertState(statePayload: any) {
    console.log(statePayload);
    return this.httpClient.post<any>(`${this.basePath}/state`, statePayload);
  }

  deleteState(stateId: any, countryId?: string) {
    return this.httpClient.delete<any>(
      `${this.basePath}/state?countryId=${countryId}&id=${stateId}`,
    );
  }

  /**
   * Once upload and auditlog api avialable end points need to update.
   */
  uploadExelFile(file: any) {
    return this.httpClient.post<any>(`${this.basePath}/country`, file);
  }

  // city
  upsertCities(payload: any) {
    return this.httpClient.post<any>(`${this.basePath}/city`, payload);
  }

  getRevisons(id: any, className: any) {
    return this.httpClient.get<any>(
      `${this.basePath}/loginApi/${id}/revisions?fetchChanges=true&classname=${className}`,
    );
  }

  getDataByCityPage(
    filterBy: any,
    page: any,
    size: any,
    sortName: any,
    direction: any,
  ) {
    let filterEndpoint = '';
    if (filterBy) {
      const keys = Object.keys(filterBy);
      keys.forEach((key) => {
        if (filterBy[key])
          key == 'newFilter'
            ? (filterEndpoint = filterEndpoint + `branchCode=${filterBy[key]}&`)
            : (filterEndpoint = filterEndpoint + `${key}=${filterBy[key]}&`);
      });
    }
    const filter = `${filterEndpoint}&`;
    const pagination = `page=${page}&size=${size}&`;
    const sortOperation = `sort=${sortName}&sortOrder=${direction}&`;

    return this.httpClient.get<any>(
      `${this.basePath}/city?${filterBy ? `${filter}` : ''}${
        page ? `${pagination}` : ''
      }${sortName ? `${sortOperation}` : ''}`,
    );
  }

  getAllCity() {
    return this.httpClient.get<any>(
      `${this.basePath}/city?authStatus=AUTHORIZED&recordStatus=OPEN`,
    );
  }

  getCityById(cityId: any) {
    return this.httpClient.get<any>(`${this.basePath}/city?cityId=${cityId}`);
  }
  deleteCity(cityId: any) {
    return this.httpClient.delete<any>(`${this.basePath}/city?id=${cityId}`);
  }

  checkduplicate(code: any) {
    return this.httpClient.get(
      `${this.basePath}/country/dupCountry?countryCode=${code}`,
    );
  }

  checkduplicateCountryCode(code: any) {
    return this.httpClient.get(
      `${this.basePath}/country/dupCountryCode?countryCode2=${code}`,
    );
  }

  checkduplicateState(code: any) {
    return this.httpClient.get(
      `${this.basePath}/state/checkStateCode?stateCode=${code}`,
    );
  }

  checkDuplicateCountryName(countryName: any) {
    return this.httpClient.get(
      `${this.basePath}/country/name-exist?countryName=${countryName}`,
    );
  }

  checkDuplicateStateName(stateName: any) {
    return this.httpClient.get(
      `${this.basePath}/state/isname-exist?stateName=${stateName}`,
    );
  }

  checkDuplicatePincode(pincode: any) {
    return this.httpClient.get(
      `${this.basePath}/city/pincode-exist?pincode=${pincode}`,
    );
  }

  checkDuplicateCity(city: any) {
    return this.httpClient.get(
      `${this.basePath}/city/checkCityName?cityName=${city}`,
    );
  }

  fetchAuthCountry() {
    return this.httpClient.get<any>(
      `${this.basePath}/country?authStatus=AUTHORIZED&recordStatus=OPEN`,
    );
  }
  getCityByState(stateId: any) {
    return this.httpClient.get<any>(
      `${this.basePath}/city?stateId=${stateId}&authStatus=AUTHORIZED&recordStatus=OPEN`,
    );
  }

  fetchZipcodeList(payload: any, page: any, size: any) {
    const pagination = `page=${page ?? 1}&size=${size ?? 5}`;
    return this.httpClient.get(
      `${this.basePath}/city/fetch-PinCodeDetail?${pagination}${
        payload?.countryId ? '&countryId=' + payload.countryId : ''
      }${payload?.stateId ? '&stateId=' + payload.stateId : ''}${
        payload?.cityId ? '&cityId=' + payload.cityId : ''
      }${payload?.pincode ? '&searchValue=' + payload.pincode : ''}`,
    );
  }
}
