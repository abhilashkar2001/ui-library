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

  @Output() customBookFdBack = new EventEmitter<{}>();
  idDepositId: any;

  constructor(
    private rdApi: CreateRdService,
    private summaryService: FdCalculatorServiceService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.idDepositId = sessionStorage.getItem("depositOriginationId");
    if (this.idDepositId) {
      this.summaryService
        .fetchDepositeSummary(this.idDepositId)
        .subscribe((resp: any) => {
          this.depositDetails = resp.data;
        });
    }
  }
  proceedFd() {
    if (sessionStorage.getItem("paymentType") == "Account")
      this.isPaymentEnabled = true;
    else {
      const dialogRef = this.dialog.open(SuccessPopupComponent, {
        data: {
          originationId: this.idDepositId,
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
          sessionStorage.removeItem("depositOriginationId");
          sessionStorage.removeItem("selectedStep");
          localStorage.removeItem("basisDetails");
        }
      });
    }
  }
  goBack() {
    this.customBookFdBack.emit();
  }
}
