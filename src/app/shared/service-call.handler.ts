import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ServiceCallHandler {
  private serviceCallMap: Map<
    string,
    {
      payload: Record<string, any>;
      paymentDetails: Record<string, any>;
      serviceCallMethod: (payload) => Observable<Record<string, any>>;
    }
  > = new Map();

  constructor() {}

  put(
    key: string,
    payload,
    paymentDetails,
    serviceMethod?: (payload) => Observable<Record<string, any>>
  ) {
    this.serviceCallMap.set(key, {
      payload: payload,
      paymentDetails: paymentDetails,
      serviceCallMethod: serviceMethod,
    });
  }

  get(key: string, paymentDetails: boolean) {
    const serviceCall = this.serviceCallMap.get(key);
    if (serviceCall) {
      if (paymentDetails) {
        return serviceCall.paymentDetails;
      } else if (!serviceCall.serviceCallMethod)
        return throwError("Service Call method not added ");
      return new Promise((resolve, reject) => {
        serviceCall.serviceCallMethod(serviceCall.payload).subscribe(
          (res) => {
            resolve({ status: "success", res });
          },
          (err) => resolve({ status: "failed", err })
        );
      });
    } else {
      return throwError("Service Call method not added ");
    }
  }

  remove(key: string) {
    this.serviceCallMap.delete(key);
  }
}
