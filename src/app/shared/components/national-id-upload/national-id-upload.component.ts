import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges
} from "@angular/core";
import { LoanService } from "app/shared/services/loan/loan.service";

@Component({
  selector: "app-national-id-upload",
  templateUrl: "./national-id-upload.component.html",
  styleUrls: ["./national-id-upload.component.scss"]
})
export class NationalIdUploadComponent implements OnInit {
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Output() onCustomSubmit: EventEmitter<any> = new EventEmitter();
  @Input("updateParentModel") updateParentModel:
    | ((value: Partial<any>) => void)
    | any;
  @Input("nationalIdDocumentList") nationalIdDocumentList: any[] = [];
  @Input("numberOfDirectors") numberOfDirectors: number | any;

  custId: any;
  stepperTitle: any;
  documentTypeArray: any[] = [{}];
  staticData = {
    DOCUMENTTYPE: []
  };
  screenName: string = "Loan Document";
  verificationType: string = "Other Document";
  documentList: any;
  genericScreenInfo = {
    screenName: "Loan Document",
    staticData: {
      DOCUMENTNAME: []
    }
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
        documentTypes: null
      }
    ]
  };

  constructor(private loanApi: LoanService) {}

  ngOnInit(): void {
    var originationId = sessionStorage.getItem("originationId");
    if (originationId) this.getOrigination(originationId);
    this.custId = localStorage.getItem("customerId");
    this.custId = JSON.parse(this.custId);
    console.log(this.numberOfDirectors);
    if (this.numberOfDirectors) {
      this.checkListDocList.requiredDocument.pop();
      for (let i = 0; i < this.numberOfDirectors; i++) {
        this.checkListDocList.requiredDocument.push({
          id: i + 1,
          seq: i + 1,
          document: `National Id of Director ${i + 1}`,
          summary: `National Id of Director ${i + 1}`,
          mandatoryForNxtStg: false,
          mandatoryForApproval: false,
          docRequired: true,
          documentTypes: null
        });
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes, "nationalIdDocumentList");
  }

  // ngOnChanges(changes: SimpleChange): void {
  //   console.log(changes, "nationalIdDocumentList");
  // }

  getOrigination(originationId: any) {
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
  onSubmit(event: any) {
    console.log(event, "......");
    var docIds: any = [];
    let customerDetails: any = [];
    if (this.numberOfDirectors) {
      event.documentDetails.otherDocument.forEach((element: any) => {
        if (element.docIds?.length > 0) {
          const docId = {
            docIds: element.docIds
          };
          docIds.push(docId);
          customerDetails.push(element.fileInfo[0]);
          console.log(customerDetails);
        }
      });
    } else {
      event.documentDetails.otherDocument.forEach((element: any) => {
        if (element.docIds?.length > 0) {
          const docId = {
            docIds: element.docIds
          };
          docIds.push(docId);
          console.log(customerDetails);
          console.log(element);
          element.fileInfo.forEach((item: any) => {
            console.log(item, ".......");
            if (item.applicantName || item.gender || item.dateOfBirth) {
              console.log(";;;;;;;");
              customerDetails.push(item);
              return;
            }
          });
        }
      });
    }

    sessionStorage.setItem("loanDoc", JSON.stringify(docIds));
    this.updateParentModel({
      kycDoc: docIds,
      updateMasterSave: true,
      customerDetails: customerDetails
    });
    this.onCustomSubmit.emit();
  }

  onBack() {
    this.onBackEvent.emit();
  }
}
