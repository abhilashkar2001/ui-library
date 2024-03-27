import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-transaction-info",
  templateUrl: "./transaction-info.component.html",
  styleUrls: ["./transaction-info.component.scss"],
})
export class TransactionInfoComponent implements OnInit {
  @Input() transactionInfoForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
