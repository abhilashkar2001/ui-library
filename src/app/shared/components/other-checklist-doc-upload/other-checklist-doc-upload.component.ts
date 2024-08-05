import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LoanService } from "app/shared/services/loan/loan.service";
import { SharedService } from "app/shared/shared.service";

@Component({
  selector: "app-other-checklist-doc-upload",
  templateUrl: "./other-checklist-doc-upload.component.html",
  styleUrls: ["./other-checklist-doc-upload.component.scss"],
})
export class OtherChecklistDocUploadComponent implements OnInit {
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Output() onCustomSubmit: EventEmitter<any> = new EventEmitter();
  @Input("updateParentModel") updateParentModel: (value: Partial<any>) => void;
  @Input() docCustomerDetails: any;
  @Input() accountType: any;
  @Input("mobileVerifyInfo") mobileVerifyInfo;
  verificationType: string = "Other Document";
  documentList: any[] = [];

  ocrProcess: boolean = false;
  checkListDocList: any[] = [];
  checkListDoc: any = [];
  docAppliName: any;
  isDisbursement: boolean = false;

  constructor(private loanApi: LoanService) {}

  ngOnInit(): void {
    if (this.accountType === "loan") this.isDisbursement = true;
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
            sessionStorage.getItem("otherDocScreenCode")
          );
          if (screenCode) this.getCheckListDoc(originationId, screenCode);
        } else {
          this.checkListDocList = [];
        }
      });
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
