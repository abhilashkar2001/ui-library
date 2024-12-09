import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { LoanService } from "app/shared/services/loan/loan.service";
import { DataService } from "app/shared/services/table-service/data.service";

@Component({
  selector: "app-other-checklist-doc-upload",
  templateUrl: "./other-checklist-doc-upload.component.html",
  styleUrls: ["./other-checklist-doc-upload.component.scss"]
})
export class OtherChecklistDocUploadComponent implements OnInit {
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Output() onCustomSubmit: EventEmitter<any> = new EventEmitter();
  @Input("updateParentModel") updateParentModel:
    | ((value: Partial<any>) => void)
    | any;
  @Input() docCustomerDetails: any;
  @Input() accountType: any;
  @Input("mobileVerifyInfo") mobileVerifyInfo: any;
  verificationType: string = "Other Document";
  documentList: any[] = [];

  ocrProcess: boolean = false;
  checkListDocList: any[] = [];
  checkListDoc: any = [];
  docAppliName: any;
  isDisbursement: boolean = false;

  constructor(private loanApi: LoanService, private dataService: DataService) {}

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
    console.log(event.loanDisbursement);

    this.dataService.setDisbursementDetails(event.loanDisbursement);
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
