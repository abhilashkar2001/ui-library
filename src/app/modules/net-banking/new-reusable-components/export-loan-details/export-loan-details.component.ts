import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-export-loan-details",
  templateUrl: "./export-loan-details.component.html",
  styleUrls: ["./export-loan-details.component.scss"],
})
export class ExportLoanDetailsComponent implements OnInit {
  radioArr: any[] = [
    { value: "Packing(LCY)", label: "Packing(LCY)" },
    { value: "Packing(FCY)", label: "Packing(FCY)" },
  ];

  exportLoan: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.bulidForm();
  }

  bulidForm() {
    this.exportLoan = this.fb.group({
      rquestDate: [""],
      disbrusementDate: [""],
      facility: [""],
      docType: [""],
      loanCurrency: [""],
      loanAmount: [""],
      epc: [""],
      creditType: [""],
      opAcc: [""],
      interestAcc: [""],
    });
  }
}
