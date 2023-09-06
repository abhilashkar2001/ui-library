import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FdCalculatorServiceService } from "../fd-calculator-service.service";

@Component({
  selector: "app-book-fd",
  templateUrl: "./book-fd.component.html",
  styleUrls: ["./book-fd.component.scss"],
})
export class BookFdComponent implements OnInit {
  isPaymentEnabled: boolean = false; // should be false initially
  customerDetails: any;
  depositDetails: {
    fixedDepositId: number;
    scheme: string;
    ownerShip: string;
    amount: number;
    typeOfCustomer: string;
    tenureYear: string;
    tenureMonth: string;
    tenureDays: string;
    intrestPayout: string;
    maturityAmount: number;
    intrestRate: number;
    maturityDate: string;
    autoRenew: boolean;
    paymentType?: string;
  };

  @Output() customBookFdBack = new EventEmitter<{}>();

  constructor(private fdApi: FdCalculatorServiceService) {}

  ngOnInit(): void {
    this.fdApi.getCustomerDetails().subscribe((resp) => {
      this.customerDetails = resp.data;
    });
    this.fdApi
      .getFixedDeposit(parseInt(sessionStorage.getItem("fixedDepositId")))
      .subscribe((resp) => {
        this.depositDetails = resp.data[0];
      });
  }
  proceedFd() {
    this.isPaymentEnabled = true;
  }
  goBack() {
    this.customBookFdBack.emit();
  }
}
