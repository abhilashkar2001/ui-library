import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ContainerContextData,
  SidenavService,
} from 'app/shared/services/sidenav.service';
import { MatSidenav } from '@angular/material/sidenav';
import { AddAccountCollateralComponent } from './add-collateral/add-collateral.component';
@Component({
  selector: 'app-collateral-details',
  templateUrl: './collateral-details.component.html',
  styleUrls: ['./collateral-details.component.scss'],
})
export class AccountCollateralDetailsComponent implements OnInit {
  @ViewChild('sidenavPanel') sidenavPanel!: MatSidenav;
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

  constructor(
    private fb: FormBuilder,
    public sidenavService: SidenavService,
  ) {}

  ngOnInit() {
    this.buildCollateralForm();
  }

  buildCollateralForm() {
    this.collateralForm = this.fb.group({
      search: [''],
      securityCover: ['', Validators.required],
      totalAssetWorth: [''],
      loanTypeId: ['', Validators.required],
      collateralDetails: this.fb.array([]),
    });
  }

  address() {
    return this.collateralForm?.get('address') as FormArray;
  }

  addAddress() {
    return this.address().push({
      collateralName: [''],
      ownership: [''],
      description: [''],
      document: this.fb.array([]),
    });
  }

  openSidePanel(index: number) {
    console.log(index);
    const contextData: ContainerContextData = {
      component: AddAccountCollateralComponent,
      data: 3,
    };
    this.sidenavService.open(contextData);
  }
}
