import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-loan-terms-conditions",
  templateUrl: "./loan-terms-conditions.component.html",
  styleUrls: ["./loan-terms-conditions.component.scss"]
})
export class LoanTermsConditionsComponent implements OnInit {
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Output() onCustomSubmit: EventEmitter<any> = new EventEmitter();
  @Input("updateParentModel") updateParentModel:
    | ((value: Partial<any>) => void)
    | any;
  stepperTitle: string;

  constructor(private activatedRoute: ActivatedRoute) {
    this.stepperTitle = this.activatedRoute.snapshot["queryParams"]["title"];
  }

  ngOnInit(): void {}

  onConfirm() {
    this.updateParentModel({ updateMasterSave: false });
    this.onCustomSubmit.emit({ gotoNext: true });
  }

  onBack() {
    this.onBackEvent.emit();
  }
}
