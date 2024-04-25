import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LoanService } from "app/shared/services/loan/loan.service";
import { SharedService } from "app/shared/shared.service";

@Component({
  selector: "app-loan-document-upload",
  templateUrl: "./loan-document-upload.component.html",
  styleUrls: ["./loan-document-upload.component.scss"],
})
export class LoanDocumentUploadComponent implements OnInit {
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Output() onCustomSubmit: EventEmitter<any> = new EventEmitter();
  @Input("updateParentModel") updateParentModel: (value: Partial<any>) => void;

  custId: any;
  stepperTitle: any;
  documentTypeArray: any;
  staticData = {
    DOCUMENTTYPE: [],
  };
  screenName: string = "Loan Document";
  verificationType: string = "Other Document";
  documentList: any;
  genericScreenInfo = {
    screenName: "Loan Document",
    staticData: {
      DOCUMENTNAME: [],
    },
  };
  ocrProcess: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private loanApi: LoanService
  ) {
    this.stepperTitle = this.activatedRoute.snapshot["queryParams"]["title"];
    // this.buildDocumentForm();
  }

  ngOnInit(): void {
    var originationId = sessionStorage.getItem("originationId");
    this.getGenericDetails();
    if (originationId) this.getOrigination(originationId);
    this.custId = localStorage.getItem("customerId");
    this.custId = JSON.parse(this.custId);
  }

  getOrigination(originationId) {
    this.loanApi
      .getOriginationMaster(parseInt(originationId))
      .subscribe((resp) => {
        if (resp?.statusCode === 200) {
          if (
            resp.data[0].loanAccountInfo.documnentsInfo.docInfoModel?.length > 0
          ) {
            this.documentList =
              resp.data[0].loanAccountInfo.documnentsInfo.docInfoModel;
          }
        }
      });
  }

  getGenericDetails() {
    this.sharedService
      .genericValue(this.screenName, Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.documentTypeArray = resp.data["DOCUMENTTYPE"];
        }
      });
  }

  onSubmit(event) {
    var docIds = [];
    event.documentDetails.otherDocument.forEach((element) => {
      const docId = {
        docIds: element.docIds,
      };
      docIds.push(docId);
    });

    sessionStorage.setItem("loanDoc", JSON.stringify(docIds));
    this.updateParentModel({ otherLoanDoc: docIds, updateMasterSave: true });
    this.onCustomSubmit.emit();
  }

  onBack() {
    this.onBackEvent.emit();
  }
}
