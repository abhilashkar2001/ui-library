import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { LoanService } from "app/shared/services/loan/loan.service";

@Component({
  selector: "app-national-id-upload",
  templateUrl: "./national-id-upload.component.html",
  styleUrls: ["./national-id-upload.component.scss"],
})
export class NationalIdUploadComponent implements OnInit {
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Output() onCustomSubmit: EventEmitter<any> = new EventEmitter();
  @Input("updateParentModel") updateParentModel: (value: Partial<any>) => void;

  custId: any;
  stepperTitle: any;
  documentTypeArray: any[] = [{}];
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
  ocrProcess: boolean = true;
  checkListDocList: any = {
    requiredDocument: [
      {
        id: 1,
        seq: 1,
        document: "National Id",
        summary: "National Id",
        mandatoryForNxtStg: false,
        mandatoryForApproval: false,
        docRequired: true,
        documentTypes: null,
      },
    ],
  };

  constructor(private loanApi: LoanService) {}

  ngOnInit(): void {
    var originationId = sessionStorage.getItem("originationId");
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
  onSubmit(event) {
    var docIds = [];
    let customerDetails: any;
    event.documentDetails.otherDocument.forEach((element) => {
      if (element.docIds?.length > 0) {
        const docId = {
          docIds: element.docIds,
        };
        docIds.push(docId);
        if (!customerDetails) {
          element.fileInfo.forEach((item) => {
            if (item.applicantName && item.dateOfBirth && !customerDetails) {
              customerDetails = item;
              return;
            }
          });
        }
      }
    });
    sessionStorage.setItem("loanDoc", JSON.stringify(docIds));
    this.updateParentModel({
      kycDoc: docIds,
      updateMasterSave: true,
      customerDetails: customerDetails,
    });
    this.onCustomSubmit.emit();
  }

  onBack() {
    this.onBackEvent.emit();
  }
}
