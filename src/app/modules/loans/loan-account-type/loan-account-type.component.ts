import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common-service/common.service';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { environment } from 'environments/environment';
import * as moment from 'moment';

@Component({
  selector: 'app-loan-account-type',
  templateUrl: './loan-account-type.component.html',
  styleUrls: ['./loan-account-type.component.scss'],
})
export class LoanAccountTypeComponent implements OnInit {
  loanType = 'Personal';
  selectedCalculator: boolean | any;
  basisClass: string | any;
  subLoanList: any = [];
  isShowCalculator = false;
  endPoints = environment.microServiceURL;
  selectedLoan: any;
  basisId: any;
  calculatorInfo: any | {};

  constructor(
    private router: Router,
    private commonService: CommonService,
    private loanService: LoanService,
    private activatedRoute: ActivatedRoute,
    private el: ElementRef,
  ) {
    //   this.basisClass = this.activatedRoute.snapshot["queryParams"]["basisClass"];
  }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params: any) => {
      this.basisClass = params.get('subClass');
    });
    this.updateCurrentRoute();
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

  updateCurrentRoute() {
    this.commonService.updateData(this.router.url.split('?')[0]);
  }

  onSelect() {
    this.selectedCalculator = !this.selectedCalculator;
  }

  loanCalculatorsData(event: any) {
    this.commonService.loanCalculatorsDataSave(event);
  }
  getFileUrl(url: any) {
    if (url.includes('https')) {
      return 'assets/images/normal_loan.svg';
    } else {
      return `${this.endPoints}${url}`;
    }
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

  goForCalculator(subAccount: any) {
    this.isShowCalculator = true;
    this.selectedLoan = subAccount;
    console.log(this.selectedLoan);
    const payload = JSON.stringify({
      processCycleCode: this.selectedLoan?.productDetails[0].processCycleCode,
      basisName: this.selectedLoan?.productDetails[0].basisName,
      basisId: this.selectedLoan?.productDetails[0].basisId,
    });

    sessionStorage.setItem('loanBasisDetails', payload);
  }
  customCalculatorValues(event: any) {
    this.selectedLoan = event;
    const emiStartDate = new Date();
    emiStartDate.setDate(emiStartDate.getDate() + 1);
    const payload = {
      emiAmount: parseInt(this.selectedLoan.emiAmount),
      interestRate: parseFloat(this.selectedLoan.interestRate),
      interestPayable: parseFloat(this.selectedLoan.interestPayable),
      principalAmount: this.selectedLoan.amount,
      totalPayableAmount: parseFloat(this.selectedLoan.totalPayableAmount),
      disbursementType: '',
      accountNumber: null,
      emiStartDate: moment(emiStartDate).format(),
      // originationId: 9821,
    };
    this.loanService.submitLoanDetail(payload).subscribe((resp) => {
      if (resp?.statusCode === 201) {
        sessionStorage.removeItem('loanstep');
        sessionStorage.setItem('loanDisburseId', resp?.data.id);
        // const url = this.location.prepareExternalUrl(
        //   this.router.serializeUrl(
        //     this.router.createUrlTree([`/loan/create-loan/${this.basisId}`])
        //   )
        // );
        // window.open(`${url}`, "_blank");
        this.router.navigate([`/loan/create-loan/${this.basisId}`]);
      }
    });
  }
  showCalculator(event: any) {
    console.log(event);
    // this.isShowCalculator = event;
  }
}
