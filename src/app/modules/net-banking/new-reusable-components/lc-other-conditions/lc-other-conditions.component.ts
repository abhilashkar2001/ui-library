import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-lc-other-conditions',
  templateUrl: './lc-other-conditions.component.html',
  styleUrls: ['./lc-other-conditions.component.scss']
})
export class LcOtherConditionsComponent implements OnInit {
  lcOtherConditionForm: FormGroup


  constructor(private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.buildForm()
  }

  buildForm(data?) {
    this.lcOtherConditionForm = this.fb.group({
      receiptto: [data?.receiptto ?? ""],
      receiptfrom: [data?.receiptfrom ?? ""],
      destinationTo: [data?.destinationTo ?? ""],
      destinationfrom: [data?.destinationfrom ?? ""],
      loadingTo: [data?.loadingTo ?? ""],
      loadingForm: [data?.loadingForm ?? ""],
      disChargeTo: [data?.disChargeTo ?? ""],
      disChargeFrom: [data?.disChargeFrom ?? ""],
      documentWithIn: [data?.documentWithIn ?? ""],
      daysDate: [data?.daysDate ?? ""],
      additionalCondition: [data?.additionalCondition ?? ""]
    });
  }
}
