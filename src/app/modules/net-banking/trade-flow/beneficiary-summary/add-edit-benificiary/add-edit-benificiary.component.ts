import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { BeneficiaryService } from "../beneficiary.service";

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
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private benificiaryApi: BeneficiaryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
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

    this.getAllCountry();
    this.buildForm({});
  }

  buildForm(item?) {
    this.benificiaryDetailsForm = this.fb.group({
      accountNumber: [item ? item.accountNumber : "", Validators.required],
      confirmAccountNumber: [
        item ? item.confirmAccountNumber : "",
        Validators.required,
      ],
      payeeName: [item ? item.payeeName : "", Validators.required],
      nickName: [item ? item.nickName : "", Validators.required],
      bankCode: [item ? item.bankCode : ""],
      countryCode: [item ? item.countryCode : "", Validators.required],
      visibility: [item ? item.visibility : "", Validators.required],
      account: [item.item?.account ?? true],
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

  getBeneficiarybyId(id: string) {
    this.benificiaryApi.getBeneficiaryById(this.id).subscribe((resp: any) => {
      if (resp?.statusCode === 200 || resp.statusCode === 201) {
        this.responseItm = resp.data[0];
        this.buildForm(this.responseItm);
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
    this.router.navigate([`/user/dashboard/trade/beneficiary`]);
  }
}
