import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { CardService } from 'app/modules/net-banking/modules/card/card.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

@Component({
  selector: 'app-ic-custom-pay-from',
  templateUrl: './ic-custom-pay-from.component.html',
  styleUrls: ['./ic-custom-pay-from.component.scss'],
})
export class IcCustomPayFromComponent implements OnInit {
  @Input() control: AbstractControl | any;
  @Input() inputLabel: string | any;
  @Input() customClass: string | any;
  @Input() message: number | any;
  @Input() balance: number | any;
  @Input() accountType: string | any;
  @Input() items: any[] | any;
  @Input() layout: string | any;
  @Input() layoutAlign: string | any;
  @Input() bindValueKey: string | any;
  @Input() bindLabelKey: string | any;
  @Input() currencyCode: string | any;
  @Input() skipBalanceCheck = false;
  @Output() selectionChange = new EventEmitter();
  @Output() remainedBalance = new EventEmitter();
  @Output() currencyCodeValue = new EventEmitter();
  errorMessage: string | any;

  constructor(
    private payFromService: CardService,
    private sessionStorageService: SessionStorageService,
  ) {}

  ngOnInit(): void {
    if (!this.items) this.setDefaultAccount();
  }

  setDefaultAccount() {
    const listAccounts = this.sessionStorageService.getListOfAccounts();
    this.items = listAccounts || [];
    console.log(this.items, 'itemss');
    this.control?.setValue(this.sessionStorageService.getSelectedAccountNo());
    this.fetchBalance(this.control?.value);
  }

  fetchBalance(event: any) {
    this.errorMessage = null;
    this.selectionChange.emit(event);
    this.currencyCodeValue.emit(this.currencyCode);
    this.accountType = this.items.find(
      (item: any) => item?.accountNo == event,
    )?.accountType;
    if (event)
      this.payFromService.getBalance(event).subscribe((res: any) => {
        if (res?.data) {
          this.balance = res?.data?.currbal;
          this.remainedBalance.emit(this.balance);
          if (this.skipBalanceCheck) return;
          if (this.balance < 0) {
            this.errorMessage = 'Minimum balance is required';
          } else this.errorMessage = '';
        }
      });
  }
}
