import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

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

  constructor(
    private router: Router,
    private loanService: LoanService,
    private activatedRoute: ActivatedRoute,
    private el: ElementRef,
    private sessionStorageService: SessionStorageService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params: any) => {
      this.basisClass = params.get('subClass');
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

  customApply(event: any) {
    if (event?.selectedLoan?.productDetails)
      this.subLoanList = event?.selectedLoan?.productDetails;
    else {
      this.isShowCalculator = event.isShowCalculator;
      this.calculatorInfo = {
        interestRate: parseInt(event.selectedLoan?.interestRate ?? '0'),
        productCode: event.selectedLoan.productCode,
      };
      this.basisClass = event.subClass;
      this.basisId = event.selectedLoan.basisId;
      setTimeout(() => {
        this.scrollToCalculator();
      }, 200);
    }
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
    this.router.navigate([`/origination/loan/create-loan/${this.basisId}`]);
    // this.router.navigate([`/loan/login`]);
  }
}
