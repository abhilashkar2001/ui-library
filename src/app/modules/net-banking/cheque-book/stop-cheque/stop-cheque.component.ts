import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { ServiceCallHandler } from "app/shared/service-call.handler";
import { ChequeService } from "../cheque-service";

@Component({
  selector: "app-stop-cheque",
  templateUrl: "./stop-cheque.component.html",
  styleUrls: ["./stop-cheque.component.scss"],
})
export class StopChequeComponent implements OnInit {
  stopChequeForm: FormGroup;
  stopChequeOptions: any[] = [
    { label: "Number", value: "Number" },
    { label: "Range", value: "Range" },
  ];

  customerInfo: any;
  accountNumberList: any[] = [];

  chequeNumber: boolean = false;
  currencyCode: any;

  constructor(
    private fb: FormBuilder,
    private chequeService: ChequeService,
    private serviceCallHandler: ServiceCallHandler,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchCustomerInfo();
    // this.fetchBenifiiary();
    this.buildForm();
  }

  fetchCustomerInfo() {
    const custInfo = sessionStorage.getItem("customer-Info");
    this.customerInfo = JSON.parse(custInfo);

    this.accountNumberList = JSON.parse(
      sessionStorage.getItem("listOfAccounts")
    );
  }

  buildForm() {
    this.stopChequeForm = this.fb.group({
      accountNo: [""],
      stopChequeBy: ["Number"],
      chequeNo: [""],
      from: [""],
      to: [""],
      reason: [""],
    });
    // const selectedAccountNo = this.sessionStorageService.getSelectedAccountNo();
    // if (selectedAccountNo) {
    //   this.stopChequeForm.get("accountNo").setValue(selectedAccountNo);
    //   this.handleAccountNumberChange(selectedAccountNo);
    // }
  }

  handleAccountNumberChange(event) {
    this.chequeNumber = true;
    const accDetails = this.accountNumberList?.find(
      (acc) => acc?.accountNo == event
    );
    this.currencyCode = accDetails?.accountCurrency;
  }

  stopCheque() {
    const stopChequeValue = this.stopChequeForm.value;
    const payloadNumber = {
      stopChequeBy: stopChequeValue?.stopChequeBy,
      accountNo: stopChequeValue?.accountNo,
      chequeBookNumber: stopChequeValue?.chequeNo,
      reason: stopChequeValue?.reason,
    };

    const payloadRange = {
      stopChequeBy: stopChequeValue?.stopChequeBy,
      accountNo: stopChequeValue?.accountNo,
      fromChequeBook: stopChequeValue?.from,
      toChequeBookNo: stopChequeValue?.to,
      reason: stopChequeValue?.reason,
    };

    const payload =
      stopChequeValue?.stopChequeBy === "Number" ? payloadNumber : payloadRange;

    let paymentDetailsArr = [
      {
        eventType: "cheque Book",
        status: "confirm",
        statusHeader: "Request Summary",
        statusNews: "Stop Cheque Successfully!",
        summary: [
          {
            header: "Account Details",
            details: [
              {
                Name: this.customerInfo?.customerName,
              },
              {
                "Account No": stopChequeValue?.accountNo,
              },
              {
                "Account Type": this.customerInfo?.accounts?.[0]?.accountType,
              },
            ],
          },
          {
            header: "Cheque Book Detail",
            details:
              stopChequeValue?.stopChequeBy === "Number"
                ? [
                    {
                      "Cheque Book Number": stopChequeValue?.chequeNo,
                    },
                    {
                      Reason: stopChequeValue?.reason,
                    },
                  ]
                : [
                    {
                      From: stopChequeValue?.fromChequeBook,
                    },
                    {
                      To: stopChequeValue?.toChequeBookNo,
                    },
                    {
                      Reason: stopChequeValue?.reason,
                    },
                  ],
          },
        ],
        qrToggle: false,
      },
    ];

    this.serviceCallHandler.put(
      "serviceHandler",
      payload,
      paymentDetailsArr,
      (payload) => this.chequeService.stopCheque(payload)
    );

    this.router.navigate(["/account/payment-summary"]);
  }
}
