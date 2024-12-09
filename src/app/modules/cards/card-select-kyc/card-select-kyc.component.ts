import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonService } from "app/shared/services/common-service/common.service";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";

@Component({
  selector: "app-card-select-kyc",
  templateUrl: "./card-select-kyc.component.html",
  styleUrls: ["./card-select-kyc.component.scss"]
})
export class CardSelectKycComponent implements OnInit {
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Output() onConfirmEvent: EventEmitter<any> = new EventEmitter();
  showKyc: boolean = true;
  stepperTitle: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: OpenAccountService,
    private commonService: CommonService
  ) {
    this.stepperTitle = this.activatedRoute.snapshot["queryParams"]["title"];
    this.commonService.isUserUsingDifferentMobile(true);
  }

  ngOnInit(): void {}

  onVerify() {
    this.onConfirmEvent.emit();
  }

  onSubmit(payload: any) {
    this.apiService.uploadMultipleDocument(payload).subscribe((resp: any) => {
      console.log(resp);
      this.onConfirmEvent.emit();
    });
  }

  onBack() {
    this.onBackEvent.emit();
  }

  onKycSubmit() {}
}
