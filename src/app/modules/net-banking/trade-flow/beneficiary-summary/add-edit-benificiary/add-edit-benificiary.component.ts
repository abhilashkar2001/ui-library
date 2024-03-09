import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-add-edit-benificiary",
  templateUrl: "./add-edit-benificiary.component.html",
  styleUrls: ["./add-edit-benificiary.component.scss"],
})
export class AddEditBenificiaryComponent implements OnInit {
  benificiaryDetailsForm: FormGroup;
  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.benificiaryDetailsForm = this.fb.group({
      accountNumber: ["", Validators.required],
      confirmAccountNumber: ["", Validators.required],
      name: ["", Validators.required],
      nickName: ["", Validators.required],
      bankCode: ["", Validators.required],
      country: ["", Validators.required],
      visibility: ["", Validators.required],
      account: [""],
      beneficiaryStatus: [""],
    });
  }

  onSubmit() {
    this.router.navigate(["/user/dashboard/trade/beneficiary"]);
  }
}
