import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";

@Component({
  selector: "app-transaction-details",
  templateUrl: "./transaction-details.component.html",
  styleUrls: ["./transaction-details.component.scss"],
})
export class TransactionDetailsComponent implements OnInit {
  customerCode: any[] = ["Code 1", "Code 2"];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {}
  createDocArray(data?) {
    return this.formBuilder.group({
      customerCode: [data ? data.customerCode : "", ,],
    });
  }
}
