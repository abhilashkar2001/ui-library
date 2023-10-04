import { Component, OnInit } from "@angular/core";
import { EducationLoan } from "./education-calculator.constant";

@Component({
  selector: "app-education-loan-calculator",
  templateUrl: "./education-loan-calculator.component.html",
  styleUrls: ["./education-loan-calculator.component.scss"],
})
export class EducationLoanCalculatorComponent implements OnInit {
  educationSteeper = EducationLoan.EDUCATION_STEEPER;
  educationIndex = 0;

  constructor() {}

  ngOnInit(): void {}
  customExpenseDetails(event) {
    this.next();
  }

  next() {
    this.educationIndex += 1;
    this.educationSteeper[this.educationIndex].isCompleted = true;
  }
  customEmiDetails(e) {
    this.next();
  }

  back() {
    this.educationIndex -= 1;
  }
}
