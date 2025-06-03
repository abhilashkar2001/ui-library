import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { CommonService } from 'app/shared/services/common-service/common.service';
import { LoanService } from 'app/shared/services/loan/loan.service';

@Component({
  selector: 'app-loans-landing',
  templateUrl: './loans-landing.component.html',
  styleUrls: ['./loans-landing.component.scss'],
})
export class LoansLandingComponent implements OnInit {
  carowselData = [];
  imageUrl = 'assets/images/Loan_Gold_img.png';
  profileHeader = 'Achieve Your Dreams with Our Loan Service.';
  profileHint =
    ' Unlock your dreams with our loan accounts. Enjoy competitive interest rates, flexible repayment options, and quick approval processes. Experience financial empowerment with tailored solutions that meet your needs, exclusively from our bank.';
  routeUrl = 'loan/loan-type';
  category = 'Lending';
  constructor(
    private router: Router,
    // private commonService: CommonService,
    private loanService: LoanService,
    private el: ElementRef,
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    // this.updateCurrentRoute();
    this.getLoanServices();
  }

  // updateCurrentRoute() {
  //   this.commonService.updateData(this.router.url);
  // }

  getLoanServices() {
    this.loanService.getLoanTypes(this.category).subscribe((response: any) => {
      this.carowselData = response.data;
    });
  }

  customApplyLoan(e: any) {
    this.router.navigate(['/origination/loan/loan-type'], {
      queryParams: { subClass: e },
    });
  }

  customApply() {
    const targetElement =
      this.el.nativeElement.querySelector('#custom-carousel');
    const targetPosition = targetElement.getBoundingClientRect().top;
    targetPosition > 200 ? targetPosition - 120 : targetPosition;
    if (targetElement) {
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  }
}
