import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-education-loan-calculator",
  templateUrl: "./education-loan-calculator.component.html",
  styleUrls: ["./education-loan-calculator.component.scss"],
})
export class EducationLoanCalculatorComponent implements OnInit {
  educationSteeper = [
    {
      name: "Expense Details",
      imageUrl: "assets/images/education.svg",
      fxFlexPercentage: 33,
      isCompleted: true,
    },
    {
      name: "EMI Ammount",
      imageUrl: "assets/images/education_emi.svg",
      fxFlexPercentage: 33,
      isCompleted: false,
    },
    {
      name: "Tac Benefits",
      imageUrl: "assets/images/education_tax.svg",
      fxFlexPercentage: 17,
      isCompleted: false,
    },
  ];

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
