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

@Component({
  selector: "app-terms-conditions",
  templateUrl: "./terms-conditions.component.html",
  styleUrls: ["./terms-conditions.component.scss"],
})
export class TermsConditionsComponent implements OnInit {
  @Output() onConfirmEvent: EventEmitter<any> = new EventEmitter();
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  checked = false;
  customerName: any;
  customerData: any;
  requestDate: any;

  constructor(private _location: Location) {}

  ngOnInit(): void {
    this.customerData = JSON.parse(localStorage.getItem("customerData"));
    this.customerName =
      this.customerData?.firstName + " " + this.customerData?.lastName;
    //this.requestDate = this.customerData?.requestDate.replace(/[a-zA-Z]/g, " ");
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
