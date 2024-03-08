import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { countryStateService } from 'app/shared/components/reusable-pincode-popup/countrySateCityService';
import { ReusablePincodePopupComponent } from 'app/shared/components/reusable-pincode-popup/reusable-pincode-popup.component';

@Component({
  selector: 'app-applicants-info',
  templateUrl: './applicants-info.component.html',
  styleUrls: ['./applicants-info.component.scss']
})
export class ApplicantsInfoComponent implements OnInit {
  applicantForm:FormGroup
  //list of country state and city
  countryArr: any[]=[];
  feeAccArray:any[] = ["dummy Option 1" , "dummy Option 2"]
  constructor(private fb:FormBuilder , private cntStService:countryStateService, private dialog :MatDialog) { }

  ngOnInit(): void {
    this.getStaticData();
    this.buildFormGroup()
  }
  getStaticData(){
    this.cntStService.fetchAuthCountry().subscribe((res)=>{
      if (res.statusCode === 200) {
        this.countryArr = res?.data;
      }
    })
  }
  buildFormGroup(item?){
    this.applicantForm = this.fb.group({
      applicantType:[""],
      applicant:[item?.applicant??""],
      issuingBranch:[item?.issuingBranch??""],
      deliveryBranch:[item?.deliveryBranch??""],
      applicantReferences:[item?.applicantReferences??""],
      deliveryMode:[item?.deliveryMode??""],
      feeAccount:[item?.feeAccount??""],
      contact: this.fb.group({
        address: this.fb.array([])
      })
    })
    this.addUserAddress()
  }

  get Contact() {
    return this.applicantForm.get("contact") as FormGroup;
  }
  get addressControle(){
    return this.Contact.get("address") as FormArray;
  }

  addUserAddress(address?){
    const newAddress = this.fb.group({
      addressId: [address?.addressId ?? null],
      address1: [address?.address1 ?? "", [Validators.required]],
      address2: [address?.address2 ?? ""],
      addressType: [
        address?.addressType ?? this.addressControle.length == 0
          ? "Communication"
          : "Permanent",
      ],
      residenceType: [address?.residenceType ?? "", [Validators.required]],
      countryName: [address?.countryName ?? "", [Validators.required]],
      pincode: [address?.pincode ?? "", [Validators.required]],
      stateName: [address?.stateName ?? ""],
      cityId: [address?.cityId ?? ""],
      cityName: [address?.cityName ?? ""],
    });
    this.addressControle.push(newAddress);
  }
  pincodeExpansion(index , formGroup){
    const dialogRef = this.dialog.open(ReusablePincodePopupComponent, {
      width: "60%",
      disableClose: true,
      panelClass: "dialog-class",
    });
    dialogRef.afterClosed().subscribe((res)=>{
      console.log(res);
      if(res){
        formGroup.get("countryName").patchValue(res?.countryName);
        formGroup.get("stateName").patchValue(res?.stateName);
        formGroup.get("cityId").patchValue(res?.cityId);
        formGroup.get("cityName").patchValue(res?.cityName);
        formGroup.get("pincode").patchValue(res?.pincode);
        
      }
      
    })
  }
}
