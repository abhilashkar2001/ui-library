import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ReusablePincodePopupComponent } from 'app/shared/components/reusable-pincode-popup/reusable-pincode-popup.component';

@Component({
  selector: 'app-supplier-info',
  templateUrl: './supplier-info.component.html',
  styleUrls: ['./supplier-info.component.scss']
})
export class SupplierInfoComponent implements OnInit {
  supplierInfoForm: FormGroup;
  constructor(private fb: FormBuilder, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.buildSupplierInfoForm({});
  }

  buildSupplierInfoForm(data) {
    this.supplierInfoForm = this.fb.group({
      benificiaryDetails: [data?.benificiaryDetails ?? ""],
      contactInfo: this.fb.group({
        address: this.fb.array([
          this.fb.group({
            address1: [
              data.contactInfo?.address[0]?.address1
                ? data.contactInfo?.address[0]?.address1
                : "",
              Validators.required,
            ],
            address2: [
              data.contactInfo?.address[0]?.address2
                ? data.contactInfo?.address[0]?.address2
                : "",
            ],
            countryName: [
              data.contactInfo?.address[0]?.countryName
                ? data.contactInfo?.address[0]?.countryName
                : "",
              Validators.required,
            ],
            pincode: [
              data.contactInfo?.address[0]?.pincode
                ? data.contactInfo?.address[0]?.pincode
                : "",
              Validators.required,
            ],
            stateName: [
              data.contactInfo?.address[0]?.stateName
                ? data.contactInfo?.address[0]?.stateName
                : "",
              Validators.required,
            ],
            cityName: [
              data.contactInfo?.address[0]?.cityName
                ? data.contactInfo?.address[0]?.cityName
                : "",
              Validators.required,
            ],
            cityId: [
              data?.contactInfo?.address[0]?.cityId ?? "",
              [Validators.required],
            ],
          }),
        ]),
      }),
      benificiaryBank: [data?.benificiaryBank ?? ""],
      benificiaryBranch: [data?.benificiaryBranch ?? ""],
      benificiaryBankCode: [data?.benificiaryBankCode ?? ""],
      contactInfo1: this.fb.group({
        benificiaryAddress: this.fb.array([
          this.fb.group({
            address1: [
              data.contactInfo1?.benificiaryAddress[0]?.address1
                ? data.contactInfo1?.benificiaryAddress[0]?.address1
                : "",
              Validators.required,
            ],
            address2: [
              data.contactInfo1?.benificiaryAddress[0]?.address2
                ? data.contactInfo1?.benificiaryAddress[0]?.address2
                : "",
            ],
            countryName: [
              data.contactInfo1?.benificiaryAddress[0]?.countryName
                ? data.contactInfo1?.benificiaryAddress[0]?.countryName
                : "",
              Validators.required,
            ],
            pincode: [
              data.contactInfo1?.benificiaryAddress[0]?.pincode
                ? data.contactInfo1?.benificiaryAddress[0]?.pincode
                : "",
              Validators.required,
            ],
            stateName: [
              data.contactInfo1?.benificiaryAddress[0]?.stateName
                ? data.contactInfo1?.benificiaryAddress[0]?.stateName
                : "",
              Validators.required,
            ],
            cityName: [
              data.contactInfo1?.benificiaryAddress[0]?.cityName
                ? data.contactInfo1?.benificiaryAddress[0]?.cityName
                : "",
              Validators.required,
            ],
            cityId: [
              data?.contactInfo1?.benificiaryAddress[0]?.cityId ?? "",
              [Validators.required],
            ],
          }),
        ]),
      }),
      fundingBank: [data?.fundingBank ?? ""],
      fundingBranch: [data?.fundingBranch ?? ""],
      fundingBankCode: [data?.fundingBankCode ?? ""],
      contactInfo2: this.fb.group({
        fundingAddress: this.fb.array([
          this.fb.group({
            address1: [
              data.contactInfo2?.fundingAddress[0]?.address1
                ? data.contactInfo2?.fundingAddress[0]?.address1
                : "",
              Validators.required,
            ],
            address2: [
              data.contactInfo2?.fundingAddress[0]?.address2
                ? data.contactInfo2?.fundingAddress[0]?.address2
                : "",
            ],
            countryName: [
              data.contactInfo2?.fundingAddress[0]?.countryName
                ? data.contactInfo2?.fundingAddress[0]?.countryName
                : "",
              Validators.required,
            ],
            pincode: [
              data.contactInfo2?.fundingAddress[0]?.pincode
                ? data.contactInfo2?.fundingAddress[0]?.pincode
                : "",
              Validators.required,
            ],
            stateName: [
              data.contactInfo2?.fundingAddress[0]?.stateName
                ? data.contactInfo2?.fundingAddress[0]?.stateName
                : "",
              Validators.required,
            ],
            cityName: [
              data.contactInfo2?.fundingAddress[0]?.cityName
                ? data.contactInfo2?.fundingAddress[0]?.cityName
                : "",
              Validators.required,
            ],
            cityId: [
              data?.contactInfo2?.fundingAddress[0]?.cityId ?? "",
              [Validators.required],
            ],
          }),
        ]),
      }),
    })
  }


  get addressControl(): FormArray {
    return this.Contact.get("address") as FormArray;
  }

  get Contact() {
    return this.supplierInfoForm.get("contactInfo") as FormGroup;
  }

  get benificiaryAddressControl(): FormArray {
    return this.benificiaryContact.get("benificiaryAddress") as FormArray;
  }

  get benificiaryContact() {
    return this.supplierInfoForm.get("contactInfo1") as FormGroup;
  }

  get fundingAddressControl(): FormArray {
    return this.fundingContact.get("fundingAddress") as FormArray;
  }

  get fundingContact() {
    return this.supplierInfoForm.get("contactInfo2") as FormGroup;
  }

  populatePincodeData(i) {
    const dialogRef = this.dialog.open(ReusablePincodePopupComponent, {
      width: "60%",
      disableClose: true,
      panelClass: "dialog-class",
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.addressControl.at(i).patchValue(res);
      }
    });
  }

}
