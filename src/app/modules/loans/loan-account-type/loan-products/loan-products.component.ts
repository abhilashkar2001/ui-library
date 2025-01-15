import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-loan-products',
  templateUrl: './loan-products.component.html',
  styleUrls: ['./loan-products.component.scss'],
})
export class LoanProductsComponent implements OnInit, OnChanges {
  @Input() subLoanList: any;
  @Output() customApply = new EventEmitter<any>();
  @Output() isShowCalculator = new EventEmitter<any>();
  selectedLoan: any;
  endPoints = environment.microServiceURL;

  constructor(
    private cdr: ChangeDetectorRef,
    private sessionStorageService: SessionStorageService,
  ) {}

  ngOnInit(): void {
    this.scrollToTop();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.subLoanList = changes['subLoanList']?.currentValue;
    // this.subLoanList.forEach((item) => {
    //   item.isReadMore = false;
    // });
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  goForCalculator(subAccount: any) {
    this.selectedLoan = subAccount;
    if (this.selectedLoan?.productDetails?.length > 1) {
      this.customApply.emit({
        selectedLoan: this.selectedLoan,
        isShowCalculator: false,
        subClass: this.selectedLoan?.subClass,
      });
    } else if (this.selectedLoan?.productDetails?.length == 1) {
      const payload = {
        processCycleCode: this.selectedLoan?.productDetails[0].processCycleCode,
        basisName: this.selectedLoan?.productDetails[0].basisName,
        basisId: this.selectedLoan?.productDetails[0].basisId,
      };
      this.sessionStorageService.setLoanBasisDetails(payload);
      this.customApply.emit({
        selectedLoan: this.selectedLoan,
        isShowCalculator: true,
      });
    } else {
      const payload = {
        processCycleCode: this.selectedLoan?.processCycleCode,
        basisName: this.selectedLoan?.basisName,
        basisId: this.selectedLoan?.basisId,
      };
      this.sessionStorageService.setLoanBasisDetails(payload);
      this.customApply.emit({
        selectedLoan: this.selectedLoan,
        isShowCalculator: true,
        subClass: this.selectedLoan?.basisName,
      });
    }
  }
  getFileUrl(url: any) {
    if (url.includes('https')) {
      return 'assets/images/normal_loan.svg';
    } else {
      return `${this.endPoints}${url}`;
    }
  }

  readMoreLess(card: any, i: any) {
    this.subLoanList.forEach((otherCard: any) => {
      if (otherCard !== card) {
        otherCard.isReadMore = false;
      }
    });
    this.subLoanList[i].isReadMore = !this.subLoanList[i].isReadMore;
    this.cdr.detectChanges();
  }
  customClassApply(event: any) {
    this.subLoanList = event?.clasDetails?.productDetails;
    this.scrollToTop();
  }
}
