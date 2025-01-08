import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { TokenStorageService } from 'app/shared/token-storage.service';
import * as moment from 'moment';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss'],
})
export class TermsConditionsComponent implements OnInit {
  @Output() confirmEvent: EventEmitter<undefined> = new EventEmitter();
  @Output() backEvent: EventEmitter<undefined> = new EventEmitter();
  checked = false;
  customerName: string | undefined;
  customerData: any;
  requestDate!: Date | string;
  loamAmount!: number;
  currencySymboll = '₹';
  otherUserInfo: any;

  constructor(
    private tokenStore: TokenStorageService,
    private sessionStorageService: SessionStorageService,
  ) {}

  ngOnInit(): void {
    this.otherUserInfo = this.tokenStore.getUserOtherInfo();
    this.customerData = this.sessionStorageService.getCustomerData();
    this.loamAmount = this.sessionStorageService.getLoanAmount()?.loanAmount;
    this.requestDate = moment(new Date()).format();
  }

  isValidated() {
    if (!this.checked) {
      return true;
    }
    return false;
  }

  onConfirm() {
    this.confirmEvent.emit();
  }

  onBack() {
    this.backEvent.emit();
  }
}
