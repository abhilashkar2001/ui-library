import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-others-info',
  templateUrl: './others-info.component.html',
  styleUrls: ['./others-info.component.scss']
})
export class OthersInfoComponent implements OnInit {
  @Input("bgType") bgType: any = "BG Amendment";// 'BG Issuance' - Dynamically both names it should be work
  otherInfoForm: FormGroup;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.buildOtherInfoForm({})
  }

  buildOtherInfoForm(item) {
    this.otherInfoForm = this.fb.group({
      specifyCounter: [item.specifyCounter ? item.specifyCounter : ""],
      swiftCode: [item.swiftCode ? item.swiftCode : ""],
      bankName: [item.bankName ? item.bankName : ""],
      branchName: [item.branchName ? item.branchName : ""],
      address1: [item.address1 ? item.address1 : "", Validators.required],
      address2: [item.address2 ? item.address2 : ""],
      country: [item.country ? item.country : "", Validators.required],
      pinCode: [item.pinCode ? item.pinCode : "", Validators.required],
      state: [item.state ? item.state : "", Validators.required],
      city: [item.city ? item.city : "", Validators.required],
      textualDesc: [item.textualDesc ? item.textualDesc : ""],
      instructDemoBank: [item.instructDemoBank ? item.instructDemoBank : ""],
      instructDelivery: [item.instructDelivery ? item.instructDelivery : ""],
      counterGuarantee: [item.counterGuarantee ? item.counterGuarantee : ""],
      deliveryMode: [item.deliveryMode ? item.deliveryMode : ""],
      deliveryBranch: [item.deliveryBranch ? item.deliveryBranch : ""],
      margin: [item.margin ? item.margin : ""],
      feeAccount: [item.feeAccount ? item.feeAccount : ""],
    });

  }
}
