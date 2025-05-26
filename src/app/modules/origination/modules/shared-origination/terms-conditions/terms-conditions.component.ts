import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { AppState, selectLocaleData } from '@onerumango/utils';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { LoanService } from 'app/shared/services/net-loan-service/loan.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomPopupComponent } from 'app/shared/components/custom-popup/custom-popup.component';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss'],
})
export class TermsConditionsComponent implements OnInit, OnDestroy {
  @Output() confirmEvent: EventEmitter<undefined> = new EventEmitter();
  @Output() backEvent: EventEmitter<undefined> = new EventEmitter();
  checked = false;
  customerName: string | undefined;
  customerData: any;
  requestDate!: Date | string;
  loamAmount!: number;
  otherUserInfo: any;
  subscriptions: Subscription[] = [];

  constructor(
    private sessionStorageService: SessionStorageService,
    private loanService: LoanService,
    private store: Store<AppState>,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    const otherUserInfo$ = this.store
      .select(selectLocaleData)
      .subscribe((userInfo) => {
        if (userInfo) {
          this.otherUserInfo = userInfo;
          this.customerData = JSON.parse(
            this.sessionStorageService.getCustomerData(),
          );
          this.loamAmount = this.sessionStorageService.getLoanAmount();
          this.requestDate = moment(new Date()).format();
        }
      });
    this.subscriptions.push(otherUserInfo$);
  }

  onConfirm() {
    const payload = {
      originationId: this.sessionStorageService.getOriginationId(),
      screenCode: this.sessionStorageService.getCurrentScreenCode(),
      termsAndCondChecked: true,
    };
    this.loanService.saveTermsandCreditFields(payload).subscribe((res) => {
      console.log(res);
      if (res?.statusCode === 200) {
        this.confirmEvent.emit();
      }
    });
  }

  onBack() {
    this.backEvent.emit();
  }

  onDecline() {
    console.log('decline functionality need to implement');
  }

  // Open Terms&Conditons Popup
  openTermsCond() {
    this.dialog.open(CustomPopupComponent, {
      width: '800px',
      height: 'auto',
      maxHeight: '90vh',
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
