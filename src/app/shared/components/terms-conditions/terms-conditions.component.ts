import { Location } from "@angular/common";
import { Component, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-terms-conditions",
  templateUrl: "./terms-conditions.component.html",
  styleUrls: ["./terms-conditions.component.scss"],
})
export class TermsConditionsComponent implements OnInit {
  @Output() onConfirmEvent: EventEmitter<any> = new EventEmitter();
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  checked = false;

  constructor(private _location: Location) {}

  ngOnInit(): void {}

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
