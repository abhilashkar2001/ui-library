import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ChecklistInfoModel,
  ChecklistPayloadModel,
  ChecklistRouteObjModel,
} from 'app/shared/models/checklist-model';
import { DocumentUploadService } from 'app/shared/services/document-upload.service';
import { OriginationService } from 'app/shared/services/origination.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { SuccessModalComponent } from '../digital-sign/success-modal/success-modal.component';
import { environment } from 'environments/environment';
import { IcHttpResponseModel } from 'app/shared/models/ic-http-response.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoanService } from 'app/shared/services/loan/loan.service';

@Component({
  selector: 'app-checklist-document',
  templateUrl: './checklist-document.component.html',
  styleUrls: ['./checklist-document.component.scss'],
})
export class ChecklistDocumentComponent implements OnInit {
  checklistDocumentForm!: FormGroup;
  refNumber: string | any;
  title = 'Document Upload';
  originationId = 3507;
  checklistDocuments: any;
  checklistRouteObj: ChecklistRouteObjModel | any;
  customerInfo: any;
  env: string = environment.microServiceURL;
  pdfType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.pdf';
  acceptedDocumentId: any[] | any;

  constructor(
    private originationService: OriginationService,
    private sessionStorageService: SessionStorageService,
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private documentUploadService: DocumentUploadService,
    private dialog: MatDialog,
    private loanService: LoanService,
  ) {}

  ngOnInit(): void {
    this.originationId = this.sessionStorageService.getOriginationId();
    this.checklistRouteObj = this.sessionStorageService.getCheklistRouteObj();
    this.customerInfo = this.sessionStorageService.getCustomerInfo();
    this.refNumber = this.customerInfo?.icustRefNo;
    this.initChecklistDocumentForm();
    this.fetchAllChecklist();
  }

  initChecklistDocumentForm() {
    this.checklistDocumentForm = this.fb.group({
      documents: this.fb.array([]),
    });
  }

  /**
   * this is the control for document form array
   * @param index
   * @returns the control of document in customer form array
   */
  get documentCtrl(): FormArray {
    return this.checklistDocumentForm.get('documents') as FormArray;
  }

  /**
   * build document form array
   * @param data
   * @returns the formgorup to be pushed in document form array in customer form array
   */
  documentFormArray(data?: any) {
    return this.fb.group({
      documentName: [data?.document ?? '', [Validators.required]],
      isProofOfAddress: [data?.isProofOfAddress ?? ''],
      files: this.fb.array([]),
      description: [data?.summary ?? ''],
      fileType: [
        this.formatDocumentType(
          data?.documentTypesValue?.map((item: any) => item?.toLowerCase()),
        ) ?? '',
      ],
      docRequired: [data?.docRequired ?? false],
    });
  }

  /**
   * control for the files present in particular document
   * @param index
   * @param documentIndex
   * @returns retuns the form control of file in document form array
   */
  documentFilesCtrl(documentIndex: any): FormArray {
    return this.documentCtrl.at(documentIndex).get('files') as FormArray;
  }

  /**
   * method is used to build the file form group for particular document
   * @param data of the uploaded file details
   * @returns return the file form group
   */
  documentFileFormArray(data?: any) {
    return this.fb.group({
      fileName: [data?.fileName ?? ''],
      fileUrl: [data?.fileUrl ?? ''],
      documentId: [data?.documentId ?? null, [Validators.required]],
    });
  }

  /**
   * push document info to the document form fetching for the customer
   * @param element document data of the particular customer
   * @param index index of the customer in customer form array
   */
  pushDocumentInfo(element?: any) {
    if (element && element?.length > 0) {
      this.documentCtrl.clear();
      element.forEach((document: any, docIndex: any) => {
        this.documentCtrl.push(this.documentFormArray(document));
        this.documentFilesCtrl(docIndex).push(this.documentFileFormArray());
      });
    } else {
      this.documentCtrl.push(this.documentFormArray());
      this.documentFilesCtrl(0).push(this.documentFileFormArray());
    }
  }

  fetchAllChecklist() {
    this.originationService
      .fetchChecklistItem(
        this.originationId,
        this.checklistRouteObj.screenId,
        this.checklistRouteObj.processStageId,
      )
      .subscribe((res: IcHttpResponseModel<ChecklistInfoModel[]>) => {
        if (res.statusCode == 200 && res?.data) {
          this.acceptedDocumentId =
            this.checklistRouteObj?.checklistItem?.split(',');
          this.checklistDocuments = res?.data?.filter((checklist) =>
            this.acceptedDocumentId.some((item: any) => item == checklist.id),
          );
          this.pushDocumentInfo(this.checklistDocuments);
        }
      });
  }

  addAnotherPage(index: number) {
    this.documentFilesCtrl(index).push(this.documentFileFormArray());
  }

  uploadDocument(event: Event, index: number, fileIndex: number) {
    const input = event.target as HTMLInputElement;
    const files = input?.files;
    if (!files || files.length === 0) {
      return;
    }
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Ensure file is not undefined
      if (!file) {
        this.snack.open(`Invalid file. Please upload a valid file.`, 'Ok!', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
        });
        return;
      }

      const docdata: any = {};
      docdata.fileName = file.name.split('.')[0];
      docdata.fileType = file.type.split('/')[1];
      docdata.documentNameForChecklist = this.documentCtrl
        .at(index)
        .get('documentName')?.value;
      docdata.documentDesc = this.documentCtrl
        .at(index)
        .get('description')?.value;

      const formdata = new FormData();
      formdata.append('file', file); // Safely append file now
      formdata.append('data', JSON.stringify(docdata));
      formdata.append('module', 'document');

      if (
        this.documentCtrl.at(index).get('fileType')?.value ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.pdf' &&
        !file.name.includes('.xlsx') &&
        !file.name.includes('.pdf')
      ) {
        this.snack.open(`Please Upload Pdf or Excel Documents`, 'Ok!', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
        });
        return;
      } else if (
        this.documentCtrl.at(index).get('fileType')?.value ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
        !file.name.includes('.xlsx')
      ) {
        this.snack.open(`Please Upload Excel documents`, 'Ok!', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
        });
        return;
      } else if (
        this.documentCtrl.at(index).get('fileType')?.value === '.pdf' &&
        !file.name.toLowerCase().includes('.pdf')
      ) {
        this.snack.open(`Please Upload Pdf documents`, 'Ok!', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
        });
        return;
      }

      this.documentUploadService.uploadDocuments(formdata).subscribe((res) => {
        if ((res?.statusCode === 200 || res?.statusCode === 201) && res?.data) {
          this.documentFilesCtrl(index).at(fileIndex).patchValue(res?.data);
          this.documentFilesCtrl(index).push(this.documentFileFormArray());
        }
      });
    }
  }

  removeImage(index: number, fileIndex: number) {
    const ctrl = this.documentFilesCtrl(index).at(fileIndex);
    if (ctrl.get('documentId')?.value) {
      ctrl.reset();
    } else {
      this.documentFilesCtrl(index).removeAt(fileIndex);
    }
  }

  formatDocumentType(documentTypes: string[]) {
    if (documentTypes?.includes('excel') && documentTypes?.includes('pdf'))
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.pdf';
    else if (documentTypes?.includes('excel'))
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    else if (documentTypes?.includes('pdf')) return '.pdf';
    return '';
  }

  saveChecklist() {
    const payload: ChecklistPayloadModel = {
      documentIds: [],
      originationId: this.originationId,
      screenCode: this.checklistRouteObj?.screenId,
    };
    payload.documentIds = [];
    this.documentCtrl?.value?.forEach((element: any) => {
      element?.files?.forEach((file: any) => {
        if (file?.documentId) payload?.documentIds?.push(file?.documentId);
      });
    });
    this.loanService.saveChecklist(payload).subscribe((res) => {
      if (res?.statusCode === 200 || res?.statusCode == 201) {
        this.updateStatus('Submit');
      }
    });
  }

  /**
   * To update the status this method will call workflow api
   * @param action
   * @param remarks
   */
  updateStatus(action: string, remarks?: string): void {
    const payload: any = {};
    payload.properties = {};
    payload.screenCode = null;
    payload.processStageId = null;
    payload.processCycleCode = this.checklistRouteObj.processCycleCode;
    payload.originationId = this.originationId;
    payload.action = action;
    payload.remarks = remarks;
    payload.transactionType = 'IND_LOAN';

    this.originationService.verifyWorkflow(payload).subscribe((res) => {
      if (res?.status == 200) {
        this.openSuccessPopup();
      }
    });
  }

  openSuccessPopup() {
    const dialogref = this.dialog.open(SuccessModalComponent, {
      width: '50%',
      panelClass: 'popup-class',
      data: {
        title: 'Document Summited Successfully',
        alert: 'Keep a record of your Reference Number for future use',
        refNo: this.customerInfo.icustRefNo,
      },
    });
    dialogref.afterClosed().subscribe(() => {
      setTimeout(() => {
        window.close();
      }, 5000);
    });
  }

  goBack() {
    window.close();
  }
}
