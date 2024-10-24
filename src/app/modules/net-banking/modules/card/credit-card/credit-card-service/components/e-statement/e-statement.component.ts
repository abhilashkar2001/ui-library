import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NavigationEnd, Router } from "@angular/router";
import { ServiceCallHandler } from "app/shared/service-call.handler";
import { GenericValueService } from "app/shared/services/generic-value.service";
import { SessionStorageService } from "app/shared/services/session-storage.service";
import { TokenStorageService } from "app/shared/token-storage.service";
import { CardService } from "../../../../card.service";

@Component({
  selector: "app-e-statement",
  templateUrl: "./e-statement.component.html",
  styleUrls: ["./e-statement.component.scss"],
})
export class EStatementComponent implements OnInit {
  customerInfo: any;
  screenName: string;
  eStatementForm: FormGroup;
  accountNumberList: any[] = [];
  selectedAccInfo: any;
  genericValue = { DOCUMENTTYPE: [], SCHEDULEPAYMENT: [] };
  profileInfo: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private serviceCallHandler: ServiceCallHandler,
    private sessionStorageService: SessionStorageService,
    private genericValueService: GenericValueService,
    private tokenStorageService: TokenStorageService,
    private cardService: CardService
  ) {
    this.profileInfo = this.tokenStorageService.getUser();
  }

  ngOnInit(): void {
    this.customerInfo = this.sessionStorageService.getCustomerInfo();
    this.accountNumberList = this.sessionStorageService.getListOfCards();
    this.fetchGenericValues();
    this.bulidForm();
  }

  fetchGenericValues() {
    this.genericValueService
      .loadGenericValue("Common", Object.keys(this.genericValue))
      .subscribe((res: any) => {
        if (res?.statusCode === 200 && res?.data) {
          Object.keys(res?.data).forEach(
            (k) => (this.genericValue[k] = res.data[k])
          );
        }
      });
  }

  bulidForm() {
    this.eStatementForm = this.fb.group({
      accountNumber: ["", [Validators.required]],
      accountType: [""],
      email: ["", [Validators.required]],
      frequency: ["", [Validators.required]],
      format: ["", [Validators.required]],
    });

    const defaultAccNo = this.sessionStorageService.getSelectedAccountNo();
    if (defaultAccNo) {
      this.eStatementForm.get("accountNumber").setValue(defaultAccNo);
      this.handleAccountNumberChange(defaultAccNo);
    }
  }

  handleAccountNumberChange(accountNo) {
    console.log(accountNo);
    this.selectedAccInfo = this.accountNumberList.find(
      (item) => item?.accountNo == accountNo
    );
    this.eStatementForm
      .get("accountType")
      .patchValue(this.selectedAccInfo?.cardType);
    this.eStatementForm.get("email").patchValue(this.profileInfo?.emailId);
  }

  onSubscribe() {}

  proceed() {
    const payload: any = {
      ...this.eStatementForm.value,
      name: this.customerInfo?.customerName,
    };

    let summaryDetails = [
      {
        eventType: "mmidTransfer",
        operationType: "E Statement",
        status: "confirm",
        statusHeader: "Comfirm Subscription",
        statusNews: "E Statement Subscribed Successfully",
        summary: [
          {
            header: "Account Details",
            details: [
              { Name: this.customerInfo?.customerName },
              {
                "Account No": this.eStatementForm.value.accountNumber,
              },
              { "Account Type": this.customerInfo?.accounts[0]?.accountType },
            ],
          },
          {
            header: "Subscription Details",
            details: [
              { Email: this.eStatementForm.value.email },
              {
                Frequency: this.eStatementForm.value.frequency,
              },
              { Format: this.eStatementForm.value.format },
            ],
          },
        ],
      },
    ];

    this.serviceCallHandler.put(
      "serviceHandler",
      payload,
      summaryDetails,
      (payload) => this.cardService.eStatementSubscribe(payload)
    );

    this.router.navigate(["/send-money/payment-summary"]);
  }
  close() {
    throw new Error("Method not implemented.");
  }
}
