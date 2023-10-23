import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FdCalculatorServiceService } from "../fd-calculator-service.service";
import { CreateRdService } from "../../rd-calculator/create-rd.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-book-fd",
  templateUrl: "./book-fd.component.html",
  styleUrls: ["./book-fd.component.scss"],
})
export class BookFdComponent implements OnInit {
  @Input("depositType") depositType: any;
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

  constructor(
    private rdApi: CreateRdService,
    private fdApi: FdCalculatorServiceService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
   let idDepositId = (sessionStorage.getItem('depositOriginationId'))
    // this.fdApi.getCustomerDetails().subscribe((resp) => {
    //   this.customerDetails = resp?.data;
    // });

    if ( this.depositType === "RD") {
      this.rdApi.getRdOriginationSummary(idDepositId).subscribe((resp) => {
        this.depositDetails = resp.data;
      })
      // console.log('.///////////////////////////////////////////////////')
      // var id = this.route.snapshot.params["id"];
      // this.rdApi.getRdfromId(id).subscribe((resp: any) => {
      //   this.depositDetails = resp?.data[0];
      // });
      // return;
    }

    // this.fdApi
    //   .getFixedDeposit(parseInt(sessionStorage.getItem("fixedDepositId")))
    //   .subscribe((resp) => {
    //     this.depositDetails = resp.data[0];
    //   });
  }
  proceedFd() {
    this.isPaymentEnabled = true;
  }
  goBack() {
    this.customBookFdBack.emit();
  }
}
