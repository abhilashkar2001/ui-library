import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
} from "@angular/core";
import { LoanService } from "app/shared/services/loan/loan.service";
import { environment } from "environments/environment";
import { ScanComponent } from "../scan/scan.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-national-id-upload",
  templateUrl: "./national-id-upload.component.html",
  styleUrls: ["./national-id-upload.component.scss"],
})
export class NationalIdUploadComponent implements OnInit {
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Output() onCustomSubmit: EventEmitter<any> = new EventEmitter();
  @Input("updateParentModel") updateParentModel: (value: Partial<any>) => void;
  @Input("nationalIdDocumentList") nationalIdDocumentList: any[] = [];
  @Input("numberOfDirectors") numberOfDirectors: number;

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

  constructor(private loanApi: LoanService, private dialog: MatDialog) {}

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
          documentTypes: null,
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
    console.log(event, "......");
    var docIds = [];
    let customerDetails: any;
    if (this.numberOfDirectors) {
      event.documentDetails.otherDocument.forEach((element) => {
        if (element.docIds?.length > 0) {
          const docId = {
            docIds: element.docIds,
          };
          docIds.push(docId);
        }
      });
      customerDetails = event.documentDetails.otherDocument[0]?.fileInfo;
    } else {
      event.documentDetails.otherDocument.forEach((element) => {
        if (element.docIds?.length > 0) {
          const docId = {
            docIds: element.docIds,
          };
          docIds.push(docId);
          if (!customerDetails) {
            console.log(element);
            element.fileInfo.forEach((item) => {
              console.log(item, ".......");
              if (
                (item.applicantName || item.name || item.dateOfBirth) &&
                !customerDetails
              ) {
                console.log(";;;;;;;");
                customerDetails = item;
                return;
              }
            });
          }
        }
      });
    }

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
