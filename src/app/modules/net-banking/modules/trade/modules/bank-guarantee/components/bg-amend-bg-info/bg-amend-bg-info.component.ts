import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { countryStateService } from "app/shared/components/reusable-pincode-popup/countrySateCityService";
import { ReusablePincodePopupComponent } from "app/shared/components/reusable-pincode-popup/reusable-pincode-popup.component";

@Component({
  selector: "app-bg-amend-bg-info",
  templateUrl: "./bg-amend-bg-info.component.html",
  styleUrls: ["./bg-amend-bg-info.component.scss"]
})
export class BgAmendBgInfoComponent implements OnInit {
  @Input() bgAmendBgInfoForm!: FormGroup;
  countries: any;

  constructor(
    private countryService: countryStateService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllCountry();
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
      panelClass: "dialog-class"
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        const control: any = this.addressControle["controls"][0];
        control.get("countryName").setValue(res.countryName);
        control.get("stateName").setValue(res.stateName);
        control.get("cityId").setValue(res.cityId);
        control.get("cityName").setValue(res.cityName);
        control.get("pincode").setValue(res.pincode);
      }
    });
  }
  get addressControle(): any {
    return this.Contact.get("address") as FormArray;
  }
  get Contact() {
    return this.bgAmendBgInfoForm.get("contactInfo") as FormGroup;
  }
}
