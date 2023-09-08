import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "app/shared/services/common-service/common.service";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";

@Component({
  selector: "app-loan-user-personal-details",
  templateUrl: "./loan-user-personal-details.component.html",
  styleUrls: ["./loan-user-personal-details.component.scss"],
})
export class LoanUserPersonalDetailsComponent implements OnInit {
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Output() onConfirmEvent: EventEmitter<any> = new EventEmitter();
  stepperTitle: string;

  constructor(
    private commonService: CommonService,
    private router: Router,
    private openAccountService: OpenAccountService,
    private activatedRoute: ActivatedRoute
  ) {
    commonService.isUserUsingDifferentMobile(true);
    this.stepperTitle = this.activatedRoute.snapshot["queryParams"]["title"];
  }

  ngOnInit(): void {}

  onConfirm(event: any) {
    this.openAccountService.savePersonalDetails(event.payLoad).subscribe(
      (response: any) => {
        console.log("Response: ", response);
        localStorage.setItem("customerId", response.data.customerId);
        this.onConfirmEvent.emit();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  onBack() {
    this.onBackEvent.emit();
  }
}
