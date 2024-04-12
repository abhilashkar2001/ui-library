import { Location } from "@angular/common";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LoanService } from "app/shared/services/loan/loan.service";

@Component({
  selector: "app-loan-terms-conditions",
  templateUrl: "./loan-terms-conditions.component.html",
  styleUrls: ["./loan-terms-conditions.component.scss"],
})
export class LoanTermsConditionsComponent implements OnInit {
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Output() onCustomSubmit: EventEmitter<any> = new EventEmitter();
  stepperTitle: string;

  constructor(
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loanApi: LoanService
  ) {
    this.stepperTitle = this.activatedRoute.snapshot["queryParams"]["title"];
  }

  ngOnInit(): void {}

  onConfirm() {
    const originationId = sessionStorage.getItem("originationId");
    var mapPayload = {
      id: parseInt(sessionStorage.getItem("loanDisburseId")),
      originationId: parseInt(originationId),
    };

    this.loanApi.updateOrigination(mapPayload).subscribe((data) => {
      this.onCustomSubmit.emit({ gotoNext: true });
    });
  }

  onBack() {
    this.onBackEvent.emit();
  }
}
