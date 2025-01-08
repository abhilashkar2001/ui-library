import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { DataService } from 'app/shared/services/table-service/data.service';

@Component({
  selector: 'app-other-checklist-doc-upload',
  templateUrl: './other-checklist-doc-upload.component.html',
  styleUrls: ['./other-checklist-doc-upload.component.scss'],
})
export class OtherChecklistDocUploadComponent implements OnInit {
  @Output() backEvent: EventEmitter<any> = new EventEmitter();
  @Output() CustomSubmit: EventEmitter<any> = new EventEmitter();
  @Input() updateParentModel: ((value: Partial<any>) => void) | any;
  @Input() docCustomerDetails: any;
  @Input() accountType: any;
  @Input() mobileVerifyInfo: any;
  verificationType = 'Other Document';
  documentList: any[] = [];

  ocrProcess = false;
  checkListDocList: any[] = [];
  checkListDoc: any = [];
  docAppliName: any;
  isDisbursement = false;

  constructor(
    private loanApi: LoanService,
    private dataService: DataService,
    private sessionStorageService: SessionStorageService,
  ) {}

  ngOnInit(): void {
    if (this.accountType === 'loan') this.isDisbursement = true;
    if (this.docCustomerDetails) {
      this.docAppliName = this.docCustomerDetails?.applicantName;
      this.sessionStorageService.setDocAppliName(
        this.docCustomerDetails?.applicantName,
      );
    } else {
      this.docAppliName = this.sessionStorageService.getDocAppliName();
    }
    const originationId = this.sessionStorageService.getOriginationId();
    this.loanApi
      .getCheckListDoc(
        this.sessionStorageService.getCurrentStage(),
        parseInt(this.sessionStorageService.getCurrentScreenCode()),
      )
      .subscribe((resp) => {
        if (resp?.statusCode == 200) {
          this.checkListDocList = this.groupBy(resp.data);
          const screenCode = parseInt(
            this.sessionStorageService.getOtherDocScreenCode(),
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
        this.sessionStorageService.getCurrentStage(),
      )
      .subscribe((resp) => {
        if (resp?.statusCode === 200) {
          this.documentList = resp.data
            .filter((item: any) => item.docInfoModel)
            .map((item: any) => {
              if (Object.prototype.hasOwnProperty.call(item, 'docInfoModel')) {
                item.docs = item.docInfoModel;
                delete item.docInfoModel;
              }
              return item;
            });
          console.log(this.documentList, 'this.documentList ');
        }
      });
  }

  groupBy(documents: any) {
    return documents.reduce((result: any, doc: any) => {
      const groupName = doc.docRequired
        ? 'requiredDocument'
        : 'nonRequiredDocument';
      (result[groupName] = result[groupName] || []).push(doc);
      return result;
    }, {});
  }

  getOrigination(originationId: any) {
    this.loanApi.getOriginationMaster(parseInt(originationId)).subscribe();
  }

  onSubmit(event: any) {
    let docIds: any = [];
    event.documentDetails.otherDocument.forEach((element: any) => {
      if (element.docIds?.length > 0) {
        docIds = [...docIds, ...element.docIds];
      }
    });
    console.log(event.loanDisbursement);

    this.dataService.setDisbursementDetails(event.loanDisbursement);
    this.sessionStorageService.setLoanDoc(JSON.stringify(docIds));
    this.updateParentModel({
      otherLoanDoc: docIds,
      updateMasterSave: true,
      isCheckListDoc: true,
      loanDisbursement: event.loanDisbursement,
    });
    this.CustomSubmit.emit();
    this.sessionStorageService.removeDocAppliName();
  }

  onBack() {
    this.backEvent.emit();
  }
}
