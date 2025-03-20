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
    private store: Store<AppState>,
  ) {}

  ngOnInit(): void {
    const otherUserInfo$ = this.store
      .select(selectLocaleData)
      .subscribe((userInfo) => {
        if (userInfo) {
          this.otherUserInfo = userInfo;
          this.customerData = this.sessionStorageService.getCustomerData();
          this.loamAmount =
            this.sessionStorageService.getLoanAmount()?.loanAmount;
          this.requestDate = moment(new Date()).format();
        }
      });
    this.subscriptions.push(otherUserInfo$);
  }

  onConfirm() {
    this.confirmEvent.emit();
  }

  onBack() {
    this.backEvent.emit();
  }

  onDecline() {
    console.log('decline functionality need to implement');
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
