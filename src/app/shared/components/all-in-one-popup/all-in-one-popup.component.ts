import { Component, Inject, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-all-in-one-popup",
  templateUrl: "./all-in-one-popup.component.html",
  styleUrls: ["./all-in-one-popup.component.scss"],
})
export class AllInOnePopupComponent implements OnInit {
  hide = true;
  confirmationForm;
  remark: AbstractControl = new FormControl("");

  constructor(
    private dialogRef: MatDialogRef<AllInOnePopupComponent>,
    private fb: FormBuilder,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }
  buildForm() {
    this.confirmationForm = this.fb.group({
      transactionPassword: [""],
      oneTimePassword: [""],
    });
  }
}
