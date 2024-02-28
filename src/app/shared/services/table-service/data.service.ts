import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Observable, Subject } from "rxjs";

export interface ErrorPayload {
  code: number;
  message: string;
}

@Injectable({
  providedIn: "root",
})
export class DataService {
  private refresh = new BehaviorSubject(false);
  isRefresh = this.refresh.asObservable();

  doRefresh(data) {
    this.refresh.next(data);
  }
}
