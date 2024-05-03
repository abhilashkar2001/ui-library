import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-add-new-eefc",
  templateUrl: "./add-new-eefc.component.html",
  styleUrls: ["./add-new-eefc.component.scss"],
})
export class AddNewEefcComponent implements OnInit {
  eefcForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.buildEefcForm();
  }

  buildEefcForm() {
    this.eefcForm = this.fb.group({
      applicantName: [""],
      customerCode: [""],
      requestDate: [""],
      eefcAccount: [""],
      addressLine1: [""],
      addressLine2: [""],
      country: [""],
      pin: [""],
      state: [""],
      city: [""],
      currConversion: [""],
      fcyAmount: [""],
      creditAccountType: [""],
      operativeAccount: [""],
    });
  }

  onSubmit() {}
  editRecord() {}

  goBack() {
    this.router.navigate([`/user/dashboard/trade/eefc-summary`]);
  }
}
