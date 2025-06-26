import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-collateral-details',
  templateUrl: './collateral-details.component.html',
  styleUrls: ['./collateral-details.component.scss'],
})
export class CollateralDetailsComponent implements OnInit {
  collateralForm: FormGroup | undefined;
  tableHeaders = [
    { key: 'collateralName', label: 'Collateral Name' },
    { key: 'ownership', label: 'Ownership of the collateral' },
    { key: 'assetWorth', label: 'Asset Monetary Worth' },
    { key: 'description', label: 'Description of Collateral' },
    { key: 'document', label: 'Document Upload' },
    { key: 'action', label: 'Action' },
  ];

  tableData = [
    {
      collateralName: 'Credit Card Details',
      ownership: 'Self',
      assetWorth: '3,00,000',
      description:
        'Detailed information regarding the collateral, including usage history.',
    },
    {
      collateralName: 'VAF Details',
      ownership: 'Self',
      assetWorth: '3,00,000',
      description: 'Detailed information regarding vehicle ownership details.',
    },
    {
      collateralName: 'Credit Card Details',
      ownership: 'Self',
      assetWorth: '3,00,000',
      description:
        'Detailed information regarding the collateral, including usage history.',
    },
    {
      collateralName: 'VAF Details',
      ownership: 'Self',
      assetWorth: '3,00,000',
      description: 'Detailed information regarding vehicle ownership details.',
    },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildCollateralForm();
  }

  buildCollateralForm() {
    this.collateralForm = this.fb.group({
      search: [''],
      collateralName: [''],
      ownership: [''],
      assetWorth: [''],
      description: [''],
      document: [''],
      securityCover: ['', Validators.required],
      totalAssetWorth: [''],
      loanType: ['', Validators.required],
    });
  }
}
