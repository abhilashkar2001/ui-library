import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonService } from "app/shared/services/common-service/common.service";

@Component({
  selector: "app-card-cibil-score",
  templateUrl: "./card-cibil-score.component.html",
  styleUrls: ["./card-cibil-score.component.scss"]
})
export class CardCibilScoreComponent implements OnInit {
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Output() onConfirmEvent: EventEmitter<any> = new EventEmitter();
  @Output() isDifferentMobileNumber: EventEmitter<any> = new EventEmitter();

  isDifferentMobile: boolean = false;
  showCibilScoreResult: boolean = false;
  stepperTitle: string;
  selectedOption: "different" | "same" = "same";

  constructor(
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute
  ) {
    this.stepperTitle = this.activatedRoute.snapshot["queryParams"]["title"];
  }

  ngOnInit(): void {}

  onContinue() {
    this.showCibilScoreResult = true;
  }

  onBack() {
    this.onBackEvent.emit();
  }

  onBackCIBILScoreResult() {
    this.showCibilScoreResult = false;
  }

  radioChange(event: any) {
    this.isDifferentMobile = event.value === "same" ? false : true;
    this.commonService.isUserUsingDifferentMobile(this.isDifferentMobile);
    let tempRow = [
      { stepName: "Personal Details" },
      { stepName: "Select KYC" }
    ];
    this.isDifferentMobile
      ? this.isDifferentMobileNumber.emit({
          steps: tempRow,
          isDifferentMobile: true
        })
      : this.isDifferentMobileNumber.emit({
          steps: [],
          isDifferentMobile: false
        });
  }

  onVerify() {
    this.showCibilScoreResult = true;
  }

  onConfirm() {
    this.onConfirmEvent.emit();
  }
}
