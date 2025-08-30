import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { CommonService } from 'app/shared/services/common-service/common.service';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

@Component({
  selector: 'app-loans-landing',
  templateUrl: './loans-landing.component.html',
  styleUrls: ['./loans-landing.component.scss'],
})
export class LoansLandingComponent implements OnInit {
  carowselData = [];
  imageUrl: any;
  profileHeader: any;
  profileHint: any;
  routeUrl: any;
  category: any;
  type: any;
  businessSuiteName!: string;
  @ViewChild('custom_carousel') customCarousel!: ElementRef<HTMLDivElement>;
  constructor(
    private router: Router,
    // private commonService: CommonService,
    private loanService: LoanService,
    // private el: ElementRef,
    private activatedRoute: ActivatedRoute,
    private sessionStorage: SessionStorageService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.type = params['type'] || 'Cheque';
      console.log(this.type);
      if (this.type) {
        this.sessionStorage.setTypeOfFlow(this.type);
      }
      this.updateLandingContent();
    });
  }

  updateLandingContent(): void {
    if (this.type === 'Account') {
      this.imageUrl = 'assets/images/account_landing.svg';
      this.profileHeader =
        'Savings Made Simple: Open Your Account in 3 Easy Steps';
      this.profileHint =
        'Supercharge your savings for a wealthier you. Say hello to financial freedom! Join now and watch your money flourish.';
      this.routeUrl = 'loan/loan-type';
      this.category = 'Accounts';
      this.businessSuiteName = 'Account Opening Services';
      this.getLoanServices();
    } else if (this.type === 'Cheque') {
      this.imageUrl = 'assets/images/account_landing.svg';
      this.profileHeader = 'Cheque Book Services at Your Fingertips';
      this.profileHint =
        'Experience the convenience of managing your cheque book services online. Request, track, and manage your cheques with ease.';
      this.routeUrl = 'loan/loan-type';
      this.category = 'Cheque';
      this.businessSuiteName = 'Cheque Book Services';
      this.getLoanServices();
    } else if (this.type === 'Card') {
      this.imageUrl = 'assets/images/account_landing.svg';
      this.profileHeader =
        'Savings Made Simple: Open Your Account in 3 Easy Steps';
      this.profileHint =
        'Supercharge your savings for a wealthier you. Say hello to financial freedom! Join now and watch your money flourish.';
      this.routeUrl = 'loan/loan-type';
      this.category = 'Card';
      this.businessSuiteName = 'Account Opening Services';
      this.getLoanServices();
    } else {
      this.imageUrl = 'assets/images/Loan_Gold_img.png';
      this.profileHeader = 'Achieve Your Dreams with Our Loan Service.';
      this.profileHint =
        'Unlock your dreams with our loan accounts. Enjoy competitive interest rates, flexible repayment options, and quick approval processes.';
      this.routeUrl = 'loan/loan-type';
      this.category = 'Lending';
      this.businessSuiteName = 'Loan Opening Services';
      this.getLoanServices();
    }

    window.scrollTo(0, 0);
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
    if (e.toLowerCase().includes('card')) {
      this.router.navigate(['/apply-card/landing'], {
        queryParams: {
          subClass: e,
          category: this.type === 'Cheque' ? this.type : this.category,
        },
      });
    } else {
      this.router.navigate(['/origination/loan/loan-type'], {
        queryParams: {
          subClass: e,
          category: this.type === 'Cheque' ? this.type : this.category,
        },
      });
    }
  }

  customApply() {
    if (this.customCarousel && this.customCarousel.nativeElement) {
      this.customCarousel.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
