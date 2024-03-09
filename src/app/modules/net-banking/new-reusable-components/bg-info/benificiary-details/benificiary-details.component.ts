import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
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
        console.log(res, "res");
        this.benificiaryDetailsForm.get("country").setValue(res.countryName);
        this.benificiaryDetailsForm.get("state").setValue(res.stateName);
        this.benificiaryDetailsForm.get("city").setValue(res.cityName);
        this.benificiaryDetailsForm.get("pincode").setValue(res.cityName);
      }
    });
  }
}
