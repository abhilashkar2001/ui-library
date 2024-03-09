import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { BeneficiaryService } from "../beneficiary.service";

@Component({
  selector: "app-add-edit-benificiary",
  templateUrl: "./add-edit-benificiary.component.html",
  styleUrls: ["./add-edit-benificiary.component.scss"],
})
export class AddEditBenificiaryComponent implements OnInit {
  benificiaryDetailsForm: FormGroup;
  countryValue: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private benificiaryApi: BeneficiaryService
  ) {}

  ngOnInit(): void {
    this.getAllCountry();
    this.buildForm({});
  }

  buildForm(item?) {
    this.benificiaryDetailsForm = this.fb.group({
      accountNumber: ["", Validators.required],
      confirmAccountNumber: ["", Validators.required],
      payeeName: ["", Validators.required],
      nickName: ["", Validators.required],
      bankCode: [""],
      countryName: ["", Validators.required],
      visibility: ["", Validators.required],
      account: [item?.account ?? true],
      beneficiaryStatus: [item?.beneficiaryStatus ?? true],
    });
  }

  getAllCountry() {
    this.benificiaryApi.getAllCountry().subscribe((resp) => {
      this.countryValue = resp?.data;
    });
  }

  onSubmit() {
    if (this.benificiaryDetailsForm.invalid) {
      this.benificiaryDetailsForm.markAllAsTouched();
      return;
    }
    let payload: any = {
      ...this.benificiaryDetailsForm.value,
    };
    this.benificiaryApi.saveBeneficiary(payload).subscribe((resp: any) => {
      console.log("resp-----", resp);
      this.router.navigate(["/user/dashboard/trade/beneficiary"]);
    });
  }
  goBack() {
    this.router.navigate([`/user/dashboard/trade/beneficiary`]);
  }
}
