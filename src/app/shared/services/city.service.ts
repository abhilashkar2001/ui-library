import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

const MICROSERVICE_URL = environment.microServiceURL;
@Injectable({
  providedIn: "root",
})
export class CityService {
  cities: any;
  constructor(private http: HttpClient) {}

  fetchZipcodeDetails(pincode) {
    return this.http.get(
      `${MICROSERVICE_URL}/city/fetchByPinCode?pincode=${pincode}`
    );
  }

  fetchCitiesByCountryCode(countryCode) {
    return this.http.get(
      `${MICROSERVICE_URL}/city?countryCode=${countryCode}&authStatus=AUTHORIZED&recordStatus=OPEN`
    );
  }

  fetchAuthCountry() {
    return this.http.get(
      `${MICROSERVICE_URL}/country?authStatus=AUTHORIZED&recordStatus=OPEN`
    );
  }

  getAllState() {
    return this.http.get<any>(
      `${MICROSERVICE_URL}/state?authStatus=AUTHORIZED&recordStatus=OPEN`
    );
  }

  getAllCity() {
    return this.http.get<any>(
      `${MICROSERVICE_URL}/city?authStatus=AUTHORIZED&recordStatus=OPEN`
    );
  }

  getStateByCountry(countryId) {
    return this.http.get<any>(
      `${MICROSERVICE_URL}/state?countryId=${countryId}&authStatus=AUTHORIZED&recordStatus=OPEN`
    );
  }

  getCityByState(stateId) {
    return this.http.get<any>(
      `${MICROSERVICE_URL}/city?stateId=${stateId}&authStatus=AUTHORIZED&recordStatus=OPEN`
    );
  }

  fetchZipcodeList(payload, page, size) {
    const pagination = `page=${page ?? 1}&size=${size ?? 5}`;
    return this.http.get(
      `${MICROSERVICE_URL}/city/fetch-PinCodeDetail?${pagination}${
        payload?.countryId ? "&countryId=" + payload.countryId : ""
      }${payload?.stateId ? "&stateId=" + payload.stateId : ""}${
        payload?.cityId ? "&cityId=" + payload.cityId : ""
      }${payload?.pincode ? "&searchValue=" + payload.pincode : ""}`
    );
  }
}
