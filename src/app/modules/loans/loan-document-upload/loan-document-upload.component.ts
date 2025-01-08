import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { SharedService } from 'app/shared/shared.service';

@Component({
  selector: 'app-loan-document-upload',
  templateUrl: './loan-document-upload.component.html',
  styleUrls: ['./loan-document-upload.component.scss'],
})
export class LoanDocumentUploadComponent implements OnInit {
  @Output() backEvent: EventEmitter<any> = new EventEmitter();
  @Output() CustomSubmit: EventEmitter<any> = new EventEmitter();
  @Input() updateParentModel: ((value: Partial<any>) => void) | any;
  @Input() docCustomerDetails: any;
  custId: any;
  stepperTitle: any;
  documentTypeArray: any[] = [{}];
  staticData = {
    DOCUMENTTYPE: [],
  };
  screenName = 'Loan Document';
  verificationType = 'Other Document';
  documentList: any[] = [];
  genericScreenInfo = {
    screenName: 'Loan Document',
    staticData: {
      DOCUMENTNAME: [],
    },
  };
  ocrProcess = false;
  checkListDocList: any[] = [];
  checkListDoc: any = [];
  docAppliName: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private loanApi: LoanService,
    private sessionStorageService: SessionStorageService,
  ) {
    this.stepperTitle = this.activatedRoute.snapshot['queryParams']['title'];
    // this.buildDocumentForm();
  }

  ngOnInit(): void {
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
    // this.getGenericDetails();
    // if (originationId) this.getOrigination(originationId);
    this.custId = localStorage.getItem('customerId');
    this.custId = JSON.parse(this.custId);
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

  getGenericDetails() {
    this.sharedService
      .genericValue(this.screenName, Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.documentTypeArray = resp.data['DOCUMENTTYPE'];
        }
      });
  }

  onSubmit(event: any) {
    let docIds: any = [];
    event.documentDetails.otherDocument.forEach((element: any) => {
      if (element.docIds?.length > 0) {
        docIds = [...docIds, ...element.docIds];
      }
    });
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
