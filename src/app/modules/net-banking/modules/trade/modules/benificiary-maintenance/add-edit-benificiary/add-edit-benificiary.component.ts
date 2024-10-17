import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { BeneficiaryService } from "../beneficiary-summary/beneficiary.service";

@Component({
  selector: "app-add-edit-benificiary",
  templateUrl: "./add-edit-benificiary.component.html",
  styleUrls: ["./add-edit-benificiary.component.scss"],
})
export class AddEditBenificiaryComponent implements OnInit {
  benificiaryDetailsForm: FormGroup;
  countryValue: any;
  id: string;
  isEdit: boolean = false;
  responseItm: any;
  readorWrite: boolean = false;
  saveTheEdit: boolean = false;
  accountNumberExists: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private benificiaryApi: BeneficiaryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.buildForm({});
    this.getAllCountry();
    this.route.queryParamMap.subscribe((params: any) => {
      this.id = params.get("id");
      this.isEdit = params.get("isEdit");
      if (this.isEdit && this.id) {
        this.isEdit = true;
        this.getBeneficiarybyId(this.id);
        this.readorWrite = true;
        console.log(this.id);
      }
    });
  }

  buildForm(item?) {
    this.benificiaryDetailsForm = this.fb.group({
      accountNo: [item ? item.accountNumber : "", Validators.required],
      confirmAccountNumber: [
        item ? item.confirmAccountNumber : "",
        Validators.required,
      ],
      name: [item ? item.payeeName : "", Validators.required],
      nickName: [item ? item.nickName : "", Validators.required],
      bankCode: [item ? item.bankCode : ""],
      countryId: [item ? item.countryCode : "", Validators.required],
      visibility: [item ? item.visibility : ""],
      accountType: [item.item?.account ?? "I"],
      beneficiaryStatus: [item.item?.beneficiaryStatus ?? true],
    });
  }

  getAllCountry() {
    this.benificiaryApi.getAllCountry().subscribe((resp) => {
      if (resp.statusCode === 200 || resp.statusCode === 201) {
        this.countryValue = resp?.data;
      }
    });
  }

  checkAccountNumber() {
    let accNo = this.benificiaryDetailsForm.get("accountNo").value;
    this.benificiaryApi.checkCorpAccountNumber(accNo).subscribe((res) => {
      this.accountNumberExists = res;
    });
  }

  getBeneficiarybyId(id: string) {
    this.benificiaryApi.getBeneficiaryById(this.id).subscribe((resp: any) => {
      if (resp?.statusCode === 200 || resp.statusCode === 201) {
        this.responseItm = resp.data[0];
        this.benificiaryDetailsForm?.patchValue(this.responseItm);
        this.benificiaryDetailsForm
          .get("confirmAccountNumber")
          .setValue(this.responseItm?.accountNo);
      }
    });
  }

  editRecord() {
    this.readorWrite = false;
    this.saveTheEdit = true;
  }

  onSubmit() {
    if (this.benificiaryDetailsForm.invalid) {
      this.benificiaryDetailsForm.markAllAsTouched();
      return;
    }
    console.log(this.benificiaryDetailsForm, "benificiaryDetailsForm");

    let payload: any = {
      ...this.benificiaryDetailsForm.value,
    };
    if (this.responseItm?.benificiaryId) {
      payload.benificiaryId = this.responseItm.benificiaryId;
    }
    this.benificiaryApi.saveBeneficiary(payload).subscribe((resp: any) => {
      this.goBack();
    });
  }
  goBack() {
    this.router.navigate([`/user/trade/beneficiary`]);
  }
}
