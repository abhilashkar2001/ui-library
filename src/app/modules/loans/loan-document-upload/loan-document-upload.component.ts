import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LoanService } from "app/shared/services/loan/loan.service";
import { SharedService } from "app/shared/shared.service";

@Component({
  selector: "app-loan-document-upload",
  templateUrl: "./loan-document-upload.component.html",
  styleUrls: ["./loan-document-upload.component.scss"]
})
export class LoanDocumentUploadComponent implements OnInit {
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Output() onCustomSubmit: EventEmitter<any> = new EventEmitter();
  @Input("updateParentModel") updateParentModel:
    | ((value: Partial<any>) => void)
    | any;
  @Input() docCustomerDetails: any;
  custId: any;
  stepperTitle: any;
  documentTypeArray: any[] = [{}];
  staticData = {
    DOCUMENTTYPE: []
  };
  screenName: string = "Loan Document";
  verificationType: string = "Other Document";
  documentList: any[] = [];
  genericScreenInfo = {
    screenName: "Loan Document",
    staticData: {
      DOCUMENTNAME: []
    }
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
        parseInt(<string>sessionStorage.getItem("currentStage")),
        parseInt(<string>sessionStorage.getItem("currentScreenCode"))
      )
      .subscribe((resp) => {
        if (resp?.statusCode == 200) {
          this.checkListDocList = this.groupBy(resp.data);
          let screenCode = parseInt(
            <string>sessionStorage.getItem("otherDocScreenCode")
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

  getCheckListDoc(originationId: any, screenCode: any) {
    this.loanApi
      .getSavedChecklist(
        originationId,
        screenCode,
        parseInt(<string>sessionStorage.getItem("currentStage"))
      )
      .subscribe((resp) => {
        if (resp?.statusCode === 200) {
          this.documentList = resp.data
            .filter((item: any) => item.docInfoModel)
            .map((item: any) => {
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

  groupBy(documents: any) {
    return documents.reduce((result: any, doc: any) => {
      const groupName = doc.docRequired
        ? "requiredDocument"
        : "nonRequiredDocument";
      (result[groupName] = result[groupName] || []).push(doc);
      return result;
    }, {});
  }

  getOrigination(originationId: any) {
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

  onSubmit(event: any) {
    var docIds: any = [];
    event.documentDetails.otherDocument.forEach((element: any) => {
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
      loanDisbursement: event.loanDisbursement
    });
    this.onCustomSubmit.emit();
    sessionStorage.removeItem("docAppliName");
  }

  onBack() {
    this.onBackEvent.emit();
  }
}
