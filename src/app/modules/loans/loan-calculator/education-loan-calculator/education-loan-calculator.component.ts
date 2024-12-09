import { Component, OnInit } from "@angular/core";
import { EducationLoan } from "./education-calculator.constant";

@Component({
  selector: "app-education-loan-calculator",
  templateUrl: "./education-loan-calculator.component.html",
  styleUrls: ["./education-loan-calculator.component.scss"]
})
export class EducationLoanCalculatorComponent implements OnInit {
  educationSteeper = EducationLoan.EDUCATION_STEEPER;
  educationIndex: any = 0;

  constructor() {}

  ngOnInit(): void {}
  customExpenseDetails() {
    this.next();
  }

  next() {
    this.educationIndex += 1;
    if (this.educationIndex)
      this.educationSteeper[this.educationIndex].isCompleted = true;
  }
  customEmiDetails() {
    this.next();
  }

  back() {
    this.educationIndex -= 1;
  }
}
