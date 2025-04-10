import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-collateral-details',
  templateUrl: './collateral-details.component.html',
  styleUrls: ['./collateral-details.component.scss'],
})
export class CollateralDetailsComponent implements OnInit {
  collateralDetailsForm!: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildCollateralForm();
  }

  buildCollateralForm() {
    this.collateralDetailsForm = this.fb.group({
      collateralDescriptionForCredit: [''],
      ownershipForCredit: ['false'],
      assetMonetaryWorthForCredit: [''],
      collateralDescriptionForVaf: [''],
      ownershipForVaf: ['false'],
      assetMonetaryWorthForVaf: [''],
      securityCover: [''],
      totalAssetWorth: [''],
      loanType: [''],
      originationInfoId: 1412,
    });
  }
}
