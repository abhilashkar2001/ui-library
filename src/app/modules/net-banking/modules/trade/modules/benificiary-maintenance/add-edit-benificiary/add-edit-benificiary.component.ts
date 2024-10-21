import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { BeneficiaryService } from "../beneficiary-summary/beneficiary.service";
import { BankCodePopupComponent } from "app/shared/components/bank-code-popup/bank-code-popup.component";
import { MatDialog } from "@angular/material/dialog";
import { IconService } from "app/shared/services/icon.service";

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
  customerInfo: any;
  bankDetails: any;
  bankInfoTableColumn: any = [
    {
      headerDef: "bankCode",
      headerCell: "Bank Code",
    },
    {
      headerDef: "city",
      headerCell: "City",
    },
  ];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private benificiaryApi: BeneficiaryService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private iconService: IconService
  ) {
    this.iconService
      .addIconIfNotExists("search-icon", "assets/images/search-icon.svg")
      .subscribe(() => {});
  }

  ngOnInit(): void {
    this.customerInfo = JSON.parse(sessionStorage.getItem("customer-Info"));
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
      countryId: [item ? item.countryCode : ""],
      visibility: [item ? item.visibility : ""],
      accountType: [item.item?.account ?? "I"],
      beneficiaryStatus: [item.item?.beneficiaryStatus ?? true],
      city: [""],
      ifscCode: [""],
      countryName: [""],
    });
    console.log(this.benificiaryDetailsForm);
    console.log(item);
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
        if (this.responseItm?.accountType == "E")
          this.fetchBankCode(this.responseItm?.bankCode);
      }
    });
  }

  async openSearchDialog() {
    const resp = await this.fetchBankCode(
      this.benificiaryDetailsForm?.value.bankCode ?? ""
    );
    if (resp) {
      const dialogRef = this.dialog.open(BankCodePopupComponent, {
        data: {
          tableColumns: this.bankInfoTableColumn,
          bankDetails: this.bankDetails,
        },
        disableClose: true,
        height: "auto",
        width: "80%",
        panelClass: "search-dialog-container",
        backdropClass: "auditLog-backdrop",
      });

      dialogRef.afterClosed().subscribe((value) => {
        if (value) {
          console.log(value);
          this.setOtherBankValues(value);
        }
      });
    }
  }

  fetchBankCode(event): Promise<any> {
    return new Promise((resolve, reject) => {
      this.benificiaryApi.fetchBankCode(event).subscribe(
        (res) => {
          this.bankDetails = res?.data;
          if (this.isEdit && this.id)
            this.setOtherBankValues(this.bankDetails[0]);

          resolve(res?.data);
        },
        () => reject(null)
      );
    });
  }
  setOtherBankValues(value: any) {
    console.log(value);
    this.benificiaryDetailsForm.get("ifscCode").patchValue(value?.ifscCode);
    this.benificiaryDetailsForm.get("city").patchValue(value?.city);
    this.benificiaryDetailsForm.get("countryName").patchValue(value?.country);
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
      corpCustId: this.customerInfo?.customerId,
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
