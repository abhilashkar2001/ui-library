import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonService } from "app/shared/services/common-service/common.service";
import { NewDepositService } from "../../new-deposit/new-deposit.service";

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
    private commonService: CommonService,
    private depositApi: NewDepositService
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
  customSaveDocuments(e) {
    var docIds = [];
    e.documentDetails.otherDocument.forEach((element) => {
      const docId = {
        docIds: element.docIds,
      };
      docIds.push(docId);
    });

    var payload = {
      // here customerId need to add
      customerId: 10056,
      documentInfo: docIds,
    };
    this.depositApi.submitAllDocument(payload).subscribe((resp) => {
      if (resp?.statusCode === 200) {
      }
    });
    console.log(docIds);
  }

  onBack() {
    this.onBackEvent.emit();
  }
}
