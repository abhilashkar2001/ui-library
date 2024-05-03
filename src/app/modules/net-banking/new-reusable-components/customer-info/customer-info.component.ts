import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ReusablePincodePopupComponent } from 'app/shared/components/reusable-pincode-popup/reusable-pincode-popup.component';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.scss']
})
export class CustomerInfoComponent implements OnInit {
  customerInfoForm: FormGroup;
  constructor(private fb: FormBuilder, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.buildCustomerInfo({});
  }

  buildCustomerInfo(data) {
    this.customerInfoForm = this.fb.group({
      applicantName: [data?.applicantName ?? ""],
      customerCode: [data?.customerCode ?? ""],
      issuingBranch: [data?.issuingBranch ?? ""],
      billType: [data?.billType ?? "LCY packing"],
      contactInfo: this.fb.group({
        address: this.fb.array([]),
      }),
      IecCode: [data?.IecCode ?? ""],
      dateOfShipment: [data?.dateOfShipment ?? ""],
      billAmount: [data?.billAmount ?? ""],
      dueDate: [data?.dueDate ?? ""],
      billReferenanceNo: [data?.billReferenanceNo ?? ""],
      tenor: [data?.tenor ?? ""],
      feeAmount: [data?.feeAmount ?? ""],
    });
    this.addUserAddress(data?.contactInfo?.address[0] ?? {});
  }

  get Contact() {
    return this.customerInfoForm.get("contactInfo") as FormGroup;
  }
  get addressControle() {
    return this.Contact.get("address") as FormArray;
  }

  addUserAddress(address?) {
    const newAddress = this.fb.group({
      address1: [address?.address1 ?? "", [Validators.required]],
      address2: [address?.address2 ?? ""],
      countryName: [address?.countryName ?? "", [Validators.required]],
      pincode: [address?.pincode ?? "", [Validators.required]],
      stateName: [address?.stateName ?? ""],
      cityId: [address?.cityId ?? ""],
      cityName: [address?.cityName ?? ""],
    });
    this.addressControle.push(newAddress);
  }
  pincodeExpansion(index) {
    const dialogRef = this.dialog.open(ReusablePincodePopupComponent, {
      width: "60%",
      disableClose: true,
      panelClass: "dialog-class",
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.addressControle.at(index).patchValue(res);
      }
    });
  }

}
