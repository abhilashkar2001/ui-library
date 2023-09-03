import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonService } from "app/shared/services/common-service/common.service";

@Component({
  selector: "app-loan-user-select-kyc",
  templateUrl: "./loan-user-select-kyc.component.html",
  styleUrls: ["./loan-user-select-kyc.component.scss"],
})
export class LoanUserSelectKycComponent implements OnInit {
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Output() onConfirmEvent: EventEmitter<any> = new EventEmitter();
  showKyc: boolean = true;
  stepperTitle: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService
  ) {
    commonService.isUserUsingDifferentMobile(true);
    this.stepperTitle = this.activatedRoute.snapshot["queryParams"]["title"];
  }

  ngOnInit(): void {}

  onVerify(event: any) {
    this.onConfirmEvent.emit();
  }

  onSubmit(event: any) {
    this.onConfirmEvent.emit();
    // this.apiService.uploadMultipleDocument(event).subscribe((resp: any) => {
    //   console.log(resp);
    //   this.onVerify();
    // })
  }

  onBack() {
    this.onBackEvent.emit();
  }
}
