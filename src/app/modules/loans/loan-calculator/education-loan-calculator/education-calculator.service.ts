import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EducationCalculatorService {
  constructor() {}
  private expenseDetails = new BehaviorSubject<any>({});

  setExpenseDetails(expense) {
    this.expenseDetails.next(expense);
  }
  getExpenseDetails() {
    return this.expenseDetails.asObservable();
  }
}
