import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { CardService } from "app/modules/net-banking/modules/card/card.service";
import { Payee } from "app/shared/models/card.model";
import { IcHttpResponseModel } from "app/shared/models/ic-http-response.model";
import { ServiceCallHandler } from "app/shared/service-call.handler";
import { SessionStorageService } from "app/shared/services/session-storage.service";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: "app-dashboard-instant-pay",
  templateUrl: "./dashboard-instant-pay.component.html",
  styleUrls: ["./dashboard-instant-pay.component.scss"]
})
export class DashboardInstantPayComponent implements OnInit {
  @Input("accountNumberList") accountNumberList: any;
  payeeDetails: Payee[] | any;
  @Output() paymentDone = new EventEmitter<any>();
  @Input("instantPay") instantPay: any;
  @Input("accountBlock") accountBlock: any;
  @Input("balance") totalBalance: any;
  payeeForm!: FormGroup;
  selectedPayee: any;
  customerId: any;
  accountBalance: number = 0;
  customerDetils: any;
  currencySymbol: any = "INR";
  constructor(
    private fb: FormBuilder,
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private cardService: CardService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private serviceCallHandler: ServiceCallHandler,
    private sessionStorageService: SessionStorageService
  ) {
    this.matIconRegistry.addSvgIcon(
      "extend-icon",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/svg/extend-arrow.svg"
      )
    );
  }

  ngOnInit(): void {
    this.customerDetils = this.sessionStorageService.getCustomerInfo();
    this.customerId = this.customerDetils?.customerId;
    this.buildForm();
    this.fetchPayeeList();

    const selectedAccount = this.sessionStorageService.getSelectedAccountNo();
    if (selectedAccount) {
      this.payeeForm.get("accountNumber")?.setValue(selectedAccount);
      this.cardService
        .fetchAccountBalance(selectedAccount)
        .subscribe((res: any) => {
          this.accountBalance = res?.data?.currbal;
        });
    }
  }

  ngOnChanges(changes: SimpleChanges | any): void {
    if (changes.accountNumberList) {
      this.accountNumberList = changes.accountNumberList.currentValue;
    }
  }

  buildForm() {
    this.payeeForm = this.fb.group({
      accountNumber: ["", [Validators.required]],
      amount: ["", [Validators.required]],
      benificiaryAccountNo: ["", [Validators.required]]
    });

    this.payeeForm
      .get("accountNumber")
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe((resp) => {
        this.accountBalance =
          this.accountNumberList?.find((item: any) => item.accountNo == resp)
            ?.accountBalance ?? 0;
      });
    this.payeeForm
      .get("amount")
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe((resp) => {
        if (resp > this.accountBalance) {
          this.payeeForm.get("amount")?.setErrors({ notEnoughAmount: true });
        }
      });
  }

  fetchPayeeList() {
    const payload = { source: "I", customerId: this.customerId };
    console.log(this.customerId);

    this.cardService
      .fetchPayeeList(payload)
      .subscribe((res: IcHttpResponseModel<Payee[]>) => {
        if (res?.statusCode === 200 && res?.data) {
          this.payeeDetails = res.data.filter(
            (item: any) => item?.accountNo && item.customerId && item.branchCode
          );
        }
      });
  }
  onPayeeSelect(payee: any) {
    this.selectedPayee = payee;
    this.payeeForm.get("benificiaryAccountNo")?.setValue(payee?.accountNo);
    this.cdr.markForCheck();
  }
  openAllPayee() {
    this.router.navigate([`/send-money/payee/view-payee/dashboard/domestic`]);
  }
  getCurrencySymbol(data: any) {
    this.currencySymbol = this.accountNumberList.find(
      (acc: any) => acc?.accountNo == data
    )?.accountCurrency;
  }

  doPay() {
    if (this.payeeForm.invalid) {
      this.payeeForm.markAllAsTouched();
      return;
    }
    const payload = {
      debitAccount: this.payeeForm.value.accountNumber,
      debitAmount: this.payeeForm.value.amount,
      debitBranch: this.accountNumberList.find(
        (item: any) => item.accountNo == this.payeeForm.value.accountNumber
      )?.accountBranch,
      creditAccount: this.selectedPayee.accountNo,
      beneficiaryName: this.selectedPayee.payeeName,
      retailFundTransferMasterId: null,
      customerId: this.selectedPayee.customerId,
      creditAmount: this.payeeForm.value.amount,
      narrative: "",
      source: "M",
      creditBranch: this.selectedPayee?.branchCode,
      transferType: "transfer money"
    };

    let paymentDetailsArr = [
      {
        eventType: "mmidTransfer",
        operationType: "Transfer_Money",
        status: "confirm",
        masterId: "retailFundTransferMasterId",
        statusHeader: "Comfirm Payment",
        statusNews: "Payment sent successfully!",
        summary: [
          {
            header: "Send From",
            details: [
              { Name: this.customerDetils?.customerName },
              {
                "Account No": this.payeeForm.get("accountNumber")?.value
              }
            ]
          },
          {
            header: "Send To",
            details: [
              { Name: this.selectedPayee?.payeeName },
              {
                "Account No": this.selectedPayee.accountNo
              },
              {
                "Account Type": this.selectedPayee.accountType
              },
              {
                "Bank Name": this.selectedPayee?.bankName
              },
              { "Bank Code": this.selectedPayee?.bankCode },
              { Amount: this.payeeForm.get("amount")?.value }
            ]
          }
        ]
      }
    ];

    this.serviceCallHandler.put(
      "serviceHandler",
      payload,
      paymentDetailsArr,
      (payload) => this.cardService.instantPay(payload)
    );
    this.router.navigate(["/send-money/payment-summary"]);
  }
}
