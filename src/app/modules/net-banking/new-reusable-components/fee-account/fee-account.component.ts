import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-fee-account',
  templateUrl: './fee-account.component.html',
  styleUrls: ['./fee-account.component.scss']
})
export class FeeAccountComponent implements OnInit {
  @Input('feeAccArray') feeAccArray: any = [];
  feeAccountForm: FormGroup;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    console.log(this.feeAccArray);
    this.buildInfoForm();
  }


  buildInfoForm() {
    this.feeAccountForm = this.formBuilder.group({
      feeAccountModel: this.formBuilder.array([]),
    });
  }

  public get feeAccountModel(): FormArray {
    return this.feeAccountForm?.get("feeAccountModel") as FormArray;
  }

  addTitleCategory(index: number, accountName: string): void {
    this.feeAccountModel.push(this.formBuilder.control(accountName));
    this.feeAccArray.splice(index, 1);
  }

  removeTitleCategoty(index: number, accountName: string): void {
    this.feeAccountModel.removeAt(index);
    this.feeAccArray.push(accountName);
  }

}
