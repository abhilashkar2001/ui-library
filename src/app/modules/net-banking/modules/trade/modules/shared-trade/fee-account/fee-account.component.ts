import { Component, Input, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl
} from "@angular/forms";

@Component({
  selector: "app-fee-account",
  templateUrl: "./fee-account.component.html",
  styleUrls: ["./fee-account.component.scss"]
})
export class FeeAccountComponent implements OnInit {
  @Input("feeAccArray") feeAccArray: any = [];
  @Input() control: AbstractControl = new FormControl();
  constructor(private formBuilder: FormBuilder) {
    this.control = this.formBuilder.array([]);
  }

  ngOnInit(): void {}

  addTitleCategory(index: number, accountName: string): void {
    if (this.control instanceof FormArray) {
      (this.control as FormArray).push(this.formBuilder.control(accountName));
    } else {
      const newArray = this.formBuilder.array([accountName]);
      this.control = newArray;
    }
    this.feeAccArray.splice(index, 1);
  }

  removeTitleCategoty(index: number, accountName: string): void {
    if (this.control instanceof FormArray) {
      (this.control as FormArray).removeAt(index);
    }
    this.feeAccArray.push(accountName);
  }
}
