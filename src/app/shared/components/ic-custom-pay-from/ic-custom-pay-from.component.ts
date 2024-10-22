import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { CardService } from "app/modules/net-banking/modules/card/card.service";
import { SessionStorageService } from "app/shared/services/session-storage.service";

@Component({
  selector: "app-ic-custom-pay-from",
  templateUrl: "./ic-custom-pay-from.component.html",
  styleUrls: ["./ic-custom-pay-from.component.scss"],
})
export class IcCustomPayFromComponent implements OnInit {
  @Input("control") control: AbstractControl;
  @Input("inputLabel") inputLabel: string;
  @Input("customClass") customClass: string;
  @Input("message") message: number;
  @Input("balance") balance: number;
  @Input("accountType") accountType: string;
  @Input("items") items: any[];
  @Input("layout") layout: string;
  @Input("layoutAlign") layoutAlign: string;
  @Input("bindValueKey") bindValueKey: string;
  @Input("bindLabelKey") bindLabelKey: string;
  @Input("currencyCode") currencyCode: string;
  @Input("skipBalanceCheck") skipBalanceCheck: boolean = false;
  @Output() selectionChange = new EventEmitter();
  @Output() remainedBalance = new EventEmitter();
  @Output() currencyCodeValue = new EventEmitter();
  errorMessage: string;

  constructor(
    private payFromService: CardService,
    private sessionStorageService: SessionStorageService
  ) {}

  ngOnInit(): void {
    if (!this.items) this.setDefaultAccount();
  }

  setDefaultAccount() {
    let listAccounts = this.sessionStorageService.getListOfAccounts();
    this.items = listAccounts || [];
    this.control?.setValue(this.sessionStorageService.getSelectedAccountNo());
    this.fetchBalance(this.control.value);
  }

  fetchBalance(event) {
    this.errorMessage = null;
    this.selectionChange.emit(event);
    this.currencyCodeValue.emit(this.currencyCode);
    this.accountType = this.items.find(
      (item) => item?.accountNo == event
    )?.accountType;
    if (event)
      this.payFromService.getBalance(event).subscribe((res: any) => {
        if (res?.data) {
          this.balance = res?.data?.currbal;
          this.remainedBalance.emit(this.balance);
          if (this.skipBalanceCheck) return;
          if (this.balance < 0) {
            this.errorMessage = "Minimum balance is required";
          } else this.errorMessage = "";
        }
      });
  }
}
