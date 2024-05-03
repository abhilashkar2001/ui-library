import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-transaction-details",
  templateUrl: "./transaction-details.component.html",
  styleUrls: ["./transaction-details.component.scss"],
})
export class TransactionDetailsComponent implements OnInit {
  transactionDetailsForm: FormGroup;
  customerCode: any[] = ["Code 1", "Code 2"];
  documents: any[] = ["document 1", "document 2"];
  shipments: any[] = ["shipment 1", "shipment 2"];
  customers: any[] = ["charge 1", "charge 2"];
  tenures: any[] = ["short", "long"];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildFormGroup();
  }
  buildFormGroup() {
    this.transactionDetailsForm = this.fb.group({
      customerCode: [""],
      drawee: [""],
      billAmount: [""],
      currency: [""],
      overseas: [""],
      branch: [""],
      bankCode: [""],
    });
  }
}
