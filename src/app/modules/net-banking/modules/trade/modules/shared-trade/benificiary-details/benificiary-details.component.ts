import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";
import { countryStateService } from "app/shared/components/reusable-pincode-popup/countrySateCityService";
import { ReusablePincodePopupComponent } from "app/shared/components/reusable-pincode-popup/reusable-pincode-popup.component";

@Component({
  selector: "app-benificiary-details",
  templateUrl: "./benificiary-details.component.html",
  styleUrls: ["./benificiary-details.component.scss"],
})
export class BenificiaryDetailsComponent implements OnInit {
  @Input() benificiaryDetailsForm: FormGroup;
  @Input() componentName: string = "";
  countries: any;

  constructor(
    private fb: FormBuilder,
    private countryService: countryStateService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllCountry();
  }

  onSave() {
    console.log("on save benificiary");
  }

  getAllCountry() {
    this.countryService.getAllCountry().subscribe((resp) => {
      this.countries = resp?.data;
    });
  }
  populatePincodeData() {
    const dialogRef = this.dialog.open(ReusablePincodePopupComponent, {
      width: "60%",
      disableClose: true,
      panelClass: "dialog-class",
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        const control = this.addressControle["controls"][0];
        control.get("countryName").setValue(res.countryName);
        control.get("stateName").setValue(res.stateName);
        control.get("cityId").setValue(res.cityId);
        control.get("cityName").patchValue(res?.cityName);
        control.get("pincode").setValue(res.pincode);
      }
    });
  }
  get addressControle() {
    return this.Contact.get("address") as FormArray;
  }
  get Contact() {
    return this.benificiaryDetailsForm.get("contactInfo") as FormGroup;
  }
}
