import { Location } from "@angular/common";
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { TokenStorageService } from "app/shared/token-storage.service";
import * as moment from "moment";

@Component({
  selector: "app-terms-conditions",
  templateUrl: "./terms-conditions.component.html",
  styleUrls: ["./terms-conditions.component.scss"],
})
export class TermsConditionsComponent implements OnInit {
  @Output() onConfirmEvent: EventEmitter<any> = new EventEmitter();
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  checked: boolean = false;
  customerName: any;
  customerData: any;
  requestDate: any;
  loamAmount: any;
  currencySymboll = "₹";
  otherUserInfo: any;

  constructor(
    private _location: Location,
    private tokenStore: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.otherUserInfo = this.tokenStore.getUserOtherInfo();
    this.customerData = JSON.parse(sessionStorage.getItem("customerData"));
    this.loamAmount = JSON.parse(
      sessionStorage.getItem("loanAmmount")
    )?.loanAmount;
    this.requestDate = moment(new Date()).format();
  }

  isValidated() {
    if (!this.checked) {
      return true;
    }
    return false;
  }

  onConfirm() {
    this.onConfirmEvent.emit();
  }

  onBack() {
    this.onBackEvent.emit();
  }
}
