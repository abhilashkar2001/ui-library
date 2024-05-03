import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ReusablePincodePopupComponent } from 'app/shared/components/reusable-pincode-popup/reusable-pincode-popup.component';

@Component({
  selector: 'app-bill-section-a',
  templateUrl: './bill-section-a.component.html',
  styleUrls: ['./bill-section-a.component.scss']
})
export class BillSectionAComponent implements OnInit {
  billSectionAForm: FormGroup
  constructor( private fb:FormBuilder,
    private dialog: MatDialog) { }
  customerCodesList=[
    {label:"123",value:"123"},
    {label:"234",value:"234"},
    {label:"345",value:"345"}

  ]
  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(){
    this.billSectionAForm=this.fb.group({
      applicantName:[],
      customerCode:[],
      issuingBranch:[],
      iECCode:[],
      country:[],
      pincode:[],
      state:[],
      city:[],
      beneficiaryAddress1:[],
      beneficiaryAddress2:[],
      beneficiaryCountry:[],
      beneficiaryPincode:[],
      beneficiaryState:[],
      beneficiaryCity:[],
      letterofPermission:[],
      dateOfLOPIssued:[],
      provider:[],
      beneficiaryBank:[],
      branch:[],
      swiftCode:[],
    })
  }
  pincodeExpansion() {
    const dialogRef = this.dialog.open(ReusablePincodePopupComponent, {
      width: "60%",
      disableClose: true,
      panelClass: "dialog-class",
    });
    dialogRef.afterClosed().subscribe((res) => {})
  }
  beneficiary(){
   
  }

}
