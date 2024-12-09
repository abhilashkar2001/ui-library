import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class EducationCalculatorService {
  constructor() {}
  private expenseDetails = new BehaviorSubject<any>({});
  private emiDetails = new BehaviorSubject<any>({});

  setExpenseDetails(expense: any) {
    this.expenseDetails.next(expense);
  }
  getExpenseDetails() {
    return this.expenseDetails.asObservable();
  }
  setEmiDetails(emiData: any) {
    this.emiDetails.next(emiData);
  }
  getEmiDetails() {
    return this.emiDetails.asObservable();
  }
}
