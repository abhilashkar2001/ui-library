import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SuccessPopupComponent } from 'app/shared/components/success-popup/success-popup.component';
import { FdCalculatorServiceService } from '../fd-calculator-service.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-book-fd',
  templateUrl: './book-fd.component.html',
  styleUrls: ['./book-fd.component.scss'],
})
export class BookFdComponent implements OnInit {
  @Input() depositType: any;
  isPaymentEnabled = false; // should be false initially
  customerDetails: any;
  depositDetails:
    | {
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
        email: string;
        maturityInstruction: any;
        ownership: any;
        bankDetails: any;
        created: any;
      }
    | any;

  @Output() customBookFdBack = new EventEmitter<{}>();
  idDepositId: any;
  email: any;

  constructor(
    private summaryService: FdCalculatorServiceService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.idDepositId = sessionStorage.getItem('depositOriginationId');
    if (this.idDepositId) {
      this.summaryService
        .fetchDepositeSummary(this.idDepositId, this.depositType)
        .subscribe((resp: any) => {
          this.depositDetails = resp.data;
          this.email = resp.data.email;
        });
    }
  }
  proceedFd() {
    if (sessionStorage.getItem('paymentType') == 'Account')
      this.isPaymentEnabled = true;
    else {
      const dialogRef = this.dialog.open(SuccessPopupComponent, {
        data: {
          originationId: this.idDepositId,
          type: this.depositType,
          email: this.email,
        },
        width: '750px',
        disableClose: true,
        panelClass: 'popup-dialog-class',
        backdropClass: 'bdrop',
      });
      dialogRef.afterClosed().subscribe((resp: any) => {
        if (resp === true) {
          sessionStorage.removeItem('holderType');
          sessionStorage.removeItem('depositOriginationId');
          sessionStorage.removeItem('selectedStep');
          localStorage.removeItem('basisDetails');
        }
      });
    }
  }
  goBack() {
    this.customBookFdBack.emit();
  }
}
