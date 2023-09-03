import { Location } from "@angular/common";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "app/shared/services/common-service/common.service";

@Component({
  selector: "app-cibil-score-container",
  templateUrl: "./cibil-score-container.component.html",
  styleUrls: ["./cibil-score-container.component.scss"],
})
export class CibilScoreContainerComponent implements OnInit {
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Output() onConfirmEvent: EventEmitter<any> = new EventEmitter();
  @Output() isDifferentMobileNumber: EventEmitter<any> = new EventEmitter();

  isDifferentMobile: boolean = false;
  showCibilScoreResult: boolean = false;
  selectedOption: "different" | "same" = "same";
  optionalSteps: any;

  constructor(
    private router: Router,
    private location: Location,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {}

  onBack() {
    this.onBackEvent.emit();
  }

  radioChange(event: any) {
    this.isDifferentMobile = event.value === "same" ? false : true;
    this.commonService.isUserUsingDifferentMobile(this.isDifferentMobile);
    let tempRow = [
      { stepName: "Personal Details" },
      { stepName: "Select KYC" },
    ];
    this.isDifferentMobile
      ? this.isDifferentMobileNumber.emit({
          steps: tempRow,
          isDifferentMobile: true,
        })
      : this.isDifferentMobileNumber.emit({
          steps: [],
          isDifferentMobile: false,
        });
  }

  onBackCIBILScoreResult(event: any) {
    this.showCibilScoreResult = false;
  }

  onContinue() {
    this.showCibilScoreResult = true;
  }

  onConfirmFromCibilScoreResult() {
    this.onConfirmEvent.emit();
  }

  onVerify() {
    // this.router.navigate(['/loans/personal-details'])
    this.onConfirmEvent.emit();
  }
}
