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
  @Input() docCustomerDetails: any;
  custId: any;
  stepperTitle: any;
  documentTypeArray: any[] = [{}];
  staticData = {
    DOCUMENTTYPE: [],
  };
  screenName: string = "Loan Document";
  verificationType: string = "Other Document";
  documentList: any[] = [];
  genericScreenInfo = {
    screenName: "Loan Document",
    staticData: {
      DOCUMENTNAME: [],
    },
  };
  ocrProcess: boolean = false;
  checkListDocList: any[] = [];
  checkListDoc: any = [];
  docAppliName: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private loanApi: LoanService
  ) {
    this.stepperTitle = this.activatedRoute.snapshot["queryParams"]["title"];
    // this.buildDocumentForm();
  }

  ngOnInit(): void {
    if (this.docCustomerDetails) {
      this.docAppliName = this.docCustomerDetails?.applicantName;
      sessionStorage.setItem(
        "docAppliName",
        this.docCustomerDetails?.applicantName
      );
    } else {
      this.docAppliName = sessionStorage.getItem("docAppliName");
    }
    var originationId = sessionStorage.getItem("originationId");
    this.loanApi
      .getCheckListDoc(
        parseInt(sessionStorage.getItem("currentStage")),
        parseInt(sessionStorage.getItem("currentScreenCode"))
      )
      .subscribe((resp) => {
        if (resp?.statusCode == 200) {
          this.checkListDocList = this.groupBy(resp.data, "docRequired");
          let screenCode = parseInt(
            sessionStorage.getItem("loanDocScreenCode")
          );
          if (screenCode) this.getCheckListDoc(originationId, screenCode);
        } else {
          this.checkListDocList = [];
        }
      });
    // this.getGenericDetails();
    // if (originationId) this.getOrigination(originationId);
    this.custId = localStorage.getItem("customerId");
    this.custId = JSON.parse(this.custId);
  }

  getCheckListDoc(originationId, screenCode) {
    this.loanApi
      .getSavedChecklist(
        originationId,
        screenCode,
        parseInt(sessionStorage.getItem("currentStage"))
      )
      .subscribe((resp) => {
        if (resp?.statusCode === 200) {
          this.documentList = resp.data
            .filter((item) => item.docInfoModel)
            .map((item) => {
              if (item.hasOwnProperty("docInfoModel")) {
                item.docs = item.docInfoModel;
                delete item.docInfoModel;
              }
              return item;
            });
          console.log(this.documentList, "this.documentList ");
        }
      });
  }

  groupBy(documents, groupName) {
    return documents.reduce((result, doc) => {
      const groupName = doc.docRequired
        ? "requiredDocument"
        : "nonRequiredDocument";
      (result[groupName] = result[groupName] || []).push(doc);
      return result;
    }, {});
  }

  getOrigination(originationId) {
    this.loanApi
      .getOriginationMaster(parseInt(originationId))
      .subscribe((resp) => {
        if (resp?.statusCode === 200) {
          if (
            resp.data[0].loanAccountInfo.documnentsInfo.docInfoModel?.length > 0
          ) {
            // this.documentList =
            //   resp.data[0].loanAccountInfo.documnentsInfo.docInfoModel;
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
      if (element.docIds?.length > 0) {
        // const docId = {
        //   docIds: element.docIds,
        // };
        // docIds.push(docId);
        docIds = [...docIds, ...element.docIds];
      }
    });
    sessionStorage.setItem("loanDoc", JSON.stringify(docIds));
    this.updateParentModel({
      otherLoanDoc: docIds,
      updateMasterSave: true,
      isCheckListDoc: true,
      loanDisbursement: event.loanDisbursement,
    });
    this.onCustomSubmit.emit();
    sessionStorage.removeItem("docAppliName");
  }

  onBack() {
    this.onBackEvent.emit();
  }
}
