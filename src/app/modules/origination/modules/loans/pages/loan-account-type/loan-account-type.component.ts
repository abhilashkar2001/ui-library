import { Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountSelectionComponent } from 'app/modules/create-account/components/account-selection/account-selection.component';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { ProductState } from '../../../../../../shared/models/router-state.model';

@Component({
  selector: 'app-loan-account-type',
  templateUrl: './loan-account-type.component.html',
  styleUrls: ['./loan-account-type.component.scss'],
})
export class LoanAccountTypeComponent implements OnInit {
  basisClass: string | any;
  subLoanList: any = [];
  isShowCalculator = false;
  selectedLoan: any;
  basisId: any;
  calculatorInfo: any;
  category: any;

  constructor(
    private router: Router,
    private loanService: LoanService,
    private activatedRoute: ActivatedRoute,
    private el: ElementRef,
    private sessionStorageService: SessionStorageService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params: any) => {
      this.basisClass = params.get('subClass');
      this.category = params.get('category');
    });
    this.getLoanSubTypes();
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 200);
  }

  getLoanSubTypes() {
    this.loanService
      .getSubLoanTypes(this.basisClass)
      .subscribe((response: any) => {
        this.subLoanList = response.data.filter(
          (item: any) => !!item?.productDetails,
        );
      });
  }

  async customApply(event: any) {
    if (event?.selectedLoan?.productDetails)
      this.subLoanList = event?.selectedLoan?.productDetails;
    else {
      if (
        this.category === 'Accounts' &&
        this.basisClass == 'CURRENT ACCOUNT'
      ) {
        this.basisClass = event.subClass;
        this.basisId = event.selectedLoan.basisId;
        const dialogRef = this.dialog.open(AccountSelectionComponent, {
          width: '100%',
          height: '90%',
          backdropClass: 'confirmDialogComponent',
          hasBackdrop: true,
          disableClose: true,
          data: { category: this.category, basisClass: this.basisClass },
        });
        dialogRef.afterClosed().subscribe((res) => {
          console.log(res);
        });
      } else if (
        this.category == 'Accounts' &&
        this.basisClass == 'CORPORATE ACCOUNT'
      ) {
        this.goToLogin();
      } else {
        this.isShowCalculator = event.isShowCalculator;
        this.calculatorInfo = {
          interestRate: parseInt(event.selectedLoan?.interestRate ?? '0'),
          productCode: event.selectedLoan.productCode,
        };
        this.basisClass = event.subClass;
        this.basisId = event.selectedLoan.basisId;

        if (this.basisClass.toLowerCase().includes('new')) {
          const state: ProductState = {
            productId: event.selectedLoan.basisId,
            selectedLoan: event.selectedLoan,
          };
          await this.router.navigate(['/loan/emi-calculator'], {
            state,
          });
          return;
        }

        setTimeout(() => {
          this.scrollToCalculator();
        }, 200);
      }
    }
  }

  goToLogin() {
    this.sessionStorageService.setItem('category', this.category);
    this.sessionStorageService.setItem('basisClass', this.basisClass);
    this.router.navigate(['loan/login']);
  }

  /**
   * once product apply click then scrolling to calculator.
   */
  scrollToCalculator() {
    const targetElement =
      this.el.nativeElement.querySelector('#loanCalculator');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  customCalculatorValues(event: any) {
    this.selectedLoan = event;
    const emiStartDate = new Date();
    emiStartDate.setDate(emiStartDate.getDate() + 1);
    this.sessionStorageService.removeLoanStep();

    if (this.basisClass.toLowerCase().includes('new')) {
      this.router.navigate([`/loan/login`]);
    } else {
      this.router.navigate([`/origination/loan/create-loan/${this.basisId}`]);
    }
  }
}
