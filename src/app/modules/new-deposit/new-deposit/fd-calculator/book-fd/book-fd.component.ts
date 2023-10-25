import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CreateRdService } from "../../rd-calculator/create-rd.service";
import { MatDialog } from "@angular/material/dialog";
import { SuccessPopupComponent } from "app/shared/components/success-popup/success-popup.component";
import { FdCalculatorServiceService } from "../fd-calculator-service.service";

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
  originId: any;

  @Output() customBookFdBack = new EventEmitter<{}>();

  constructor(
    private rdApi: CreateRdService,
    private summaryService: FdCalculatorServiceService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    let idDepositId = sessionStorage.getItem("depositOriginationId");

    if (this.depositType === "RD") {
      this.rdApi.getRdOriginationSummary(idDepositId).subscribe((resp) => {
        this.depositDetails = resp.data;
      });
    } else {
      this.summaryService
        .fetchFdSummary(sessionStorage.getItem("originationId"))
        .subscribe((resp: any) => {
          this.depositDetails = resp.data;
        });
    }
  }
  proceedFd() {
    if (sessionStorage.getItem("paymentType") == "Account") {
      this.isPaymentEnabled = true;
    } else {
      if (this.depositType == "RD") {
        this.originId = sessionStorage.getItem("depositOriginationId");
      } else {
        this.originId = sessionStorage.getItem("originationId");
      }
      const dialogRef = this.dialog.open(SuccessPopupComponent, {
        data: {
          originationId: this.originId,
          type: "Fd",
        },
        width: "750px",
        disableClose: true,
        panelClass: "popup-dialog-class",
        backdropClass: "bdrop",
      });
      dialogRef.afterClosed().subscribe((resp: any) => {
        if (resp === true) {
          sessionStorage.removeItem("holderType");
          sessionStorage.removeItem("originationId");
          sessionStorage.removeItem("selectedStep");
          localStorage.removeItem("FdDetails");
          localStorage.removeItem("basisDetails");
        }
      });
    }
  }
  goBack() {
    this.customBookFdBack.emit();
  }
}
