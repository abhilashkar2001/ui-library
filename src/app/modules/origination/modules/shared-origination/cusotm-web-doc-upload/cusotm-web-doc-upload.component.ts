import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { environment } from 'environments/environment';
import { CustomWebDocUploadServiceService } from './custom-web-doc-upload-service.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { OpenAccountService } from 'app/shared/services/open-service/open-account.service';
import { Subscription } from 'rxjs';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { ScanComponent } from '../../../../../shared/components/scan/scan.component';
import { WarningComponent } from '../../../../../shared/components/warning/warning.component';
import { ImageDialogComponent } from 'app/modules/origination/modules/shared-origination/image-dialog/image-dialog.component';
import { DocumentUploadService } from 'app/shared/services/document-upload.service';
@Component({
  selector: 'app-cusotm-web-doc-upload',
  templateUrl: './cusotm-web-doc-upload.component.html',
  styleUrls: ['./cusotm-web-doc-upload.component.scss'],
})
export class CusotmWebDocUploadComponent implements OnInit, OnDestroy {
  @Output() backEvent: EventEmitter<any> = new EventEmitter();
  @Output() CustomSubmit: EventEmitter<any> = new EventEmitter();
  @Output() customDocumentForm = new EventEmitter<any>();
  @Output() customSaveDocument = new EventEmitter<any>();
  @Input() documentTypeArray: any;
  @Input() verificationType: string | any;
  @Input() documentList: any = [];
  @Input() genericScreenInfo: any;
  @Input() checkListDocList: any;
  @Input() isOtherDocVisible = true;
  @Input() docAppliName: any;
  @Input() individual = true;
  @Input() screenNameValue: string | any;

  documentControls!: FormGroup;
  createDocumentForm!: FormGroup;
  documentIds = [
    {
      docIds: [],
    },
  ];
  files: any[] = [];
  uploadedDocResponse: any = [];
  docIds: any[] = [];
  stepperTitle: any;

  staticData: any = {
    DOCUMENTNAME: [],
  };
  selectedImage: Blob | any;
  imageUrl: string | any;
  baseUrl = environment.microServiceURL;
  screenName = 'Loan Document';
  hideSelect: string[] = ['aadhar card'];
  // SAVE BUTTON PROPERTIES
  isLoading: boolean | any = false;
  loadingBtnText = 'Saving...';
  ocrCheck = true;
  nationalIdGeneric: any;

  @Input() isShowDisbursement = false;
  disbursementTypeId: any;
  loanCustomerId: string | any;
  accountList: any;
  defaultDisbursement: any;
  ocrPass = false;
  nationalIdNo: any;
  documentInfo: any;
  addNewButtonClicked: Subscription | any;
  backData: any[] = [];
  image = '';
  faceId: any;
  frontAadhar: any;
  fileUrls: any[] = [];

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private genericValueService: GenericValueService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private docapi: CustomWebDocUploadServiceService,
    private loanApi: LoanService,
    private openApi: OpenAccountService,
    private sessionStorageService: SessionStorageService,
    private documentUploadService: DocumentUploadService,
  ) {
    this.stepperTitle = this.activatedRoute.snapshot['queryParams']['title'];
    // this.buildDocumentForm();
    this.matIconRegistry.addSvgIcon(
      'cancel-icon',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/cancel_icon.svg',
      ),
    );
  }

  ngOnInit(): void {
    this.sessionStorageService.getCustomerId();
    this.addNewUploadField();
  }

  ngOnDestroy() {
    this.addNewButtonClicked.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges | any): void {
    console.log(changes, 'changes');
    if (changes?.checkListDocList?.currentValue) {
      this.checkListDocList = changes.checkListDocList.currentValue;
      this.buildForm(this.checkListDocList?.requiredDocument ?? []);
    }
    if (changes.documentList?.currentValue?.length > 0) {
      this.documentList = changes.documentList.currentValue;
      this.otherDocument().controls.forEach((control, index) => {
        const docData = this.documentList[index]?.docs ?? [];
        control.get('fileInfo')?.setValue(this.calculateDoc(docData, index));
      });
    }
    this.getGenericDetails();
  }

  getCustomerById() {
    this.openApi
      .getCustomerById(parseInt(this.loanCustomerId))
      .subscribe((resp) => {
        if (resp?.statusCode == 200) {
          if (resp?.data[0]?.customerNo) {
            this.getAccountList(resp?.data[0]?.customerNo);
          }
        }
      });
  }

  getAccountList(customerNo: any) {
    this.loanApi.getAccountList(customerNo).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        this.accountList = resp.data.accountInfo;
      }
    });
  }

  getGenericDetails() {
    this.genericValueService
      .loadGenericValue(Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.staticData = { ...resp.data };
          this.documentTypeArray = resp.data['DOCUMENTNAME'];
          this.nationalIdGeneric = this.documentTypeArray.filter((item: any) =>
            item.values.toLowerCase().includes('aadhar'),
          )[0].id;
        }
      });
  }

  buildForm(data?: any) {
    this.createDocumentForm = this.fb.group({
      otherDocument: this.fb.array([]),
    });

    // else {
    if (data?.length > 0) {
      data.forEach((item: any) => {
        this.hideSelect.push(item?.documentType);
        this.addDocument(item);
        this.customDocumentForm.emit(this.createDocumentForm);
      });
    }
    if (this.isOtherDocVisible) this.addDocument();
  }

  otherDocument(): FormArray {
    return this.createDocumentForm?.get('otherDocument') as FormArray;
  }

  showDocument(data: any, i: any) {
    console.log(data);
    this.documentControls = this.fb.group({
      documentNumber: [data ? data.documentNumber : ''],
      documentType: [data ? data.document : ''],
      fileInfo: new FormControl([]),
      docIds: new FormControl([]),
    });
    this.otherDocument().push(this.documentControls);
    if (data) {
      this.otherDocument()
        .controls[i]?.get('fileInfo')
        ?.setValue(this.calculateDoc(data, i));
    }
  }

  addNewUploadField() {
    this.addNewButtonClicked = this.loanApi
      .getNewUploadClicked()
      .subscribe(() => {
        const documentControls = this.fb.group({
          documentNumber: [''],
          documentType: [''],
          fileInfo: new FormControl([]),
          docIds: new FormControl([]),
        });
        this.otherDocument().push(documentControls);
      });
  }

  calculateDoc(data: any, i: any) {
    const docArr: any[] = [];
    const docIds: number[] = [];

    data.forEach((item: any) => {
      docArr.push({
        docId: item.documentId,
        name: item.fileName,
        progress: 100, // should be a number
        url: this.mapEndPoints(item.fileUrl),
      });
      docIds.push(item.documentId);
    });

    this.otherDocument().controls[i]?.get('docIds')?.setValue(docIds);
    return docArr;
  }

  getFileUrl(file: any) {
    if (file.name.endsWith('pdf') || file.name.endsWith('xlsx')) {
      return 'assets/images/file_icon.svg';
    } else return file.url;
  }

  newDenom(data?: any): FormGroup {
    return this.fb.group({
      documentNumber: [''],
      documentType: [data ? data.document : ''],
      fileInfo: new FormControl([]),
      docIds: new FormControl([]),
      docRequired: data?.docRequired ?? false,
    });
  }

  getFileInfo(indx: any): any[] {
    return this.otherDocument().controls[indx]?.get('fileInfo')?.value;
  }

  /**
   * NOTE:- Once delete api will get then only this methods api will call.
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number, i: any, _doc: any) {
    this.createDocumentForm.value.otherDocument[i].docIds.splice(index, 1);
    this.otherDocument().controls[i]?.get('fileInfo')?.value.splice(index, 1);
    this.fileUrls.splice(index, 1);
  }

  deleteDocument(i: number) {
    this.otherDocument().removeAt(i);
    this.hideSelect.splice(i, 1);
  }

  addDocument(data?: any) {
    this.otherDocument().push(this.newDenom(data));
  }

  mapEndPoints(url: any) {
    console.log(url);
    return `${this.baseUrl}${url}`;
  }
  fileBrowseHandler(indx: number) {
    this.browseFiles(indx);
  }
  removeScannedFace() {
    this.image = '';
    this.sessionStorageService.removeBiometricId();
  }

  browseFiles(i: any) {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    if (!this.isOtherDocVisible) inputElement.accept = 'image/*';
    inputElement.addEventListener('change', (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file: any = target.files[0];
        this.selectedImage = file;
        this.displayImage(i, file, file.size);
        this.uploadImage(file, i);
        // }
        const fReader = new FileReader();
        fReader.readAsDataURL(file);
      }
    });

    inputElement.click();
    this.uploadFilesSimulator(0);
  }

  getDocTypeforScan(docname: any, index: any) {
    let docType;
    if (docname == 'aadhar card' && index == 0) {
      docType = 'adhaar';
    }
    if (docname == 'aadhar card' && index == 1) docType = 'adhaar_back';
    if (docname == 'pan card') {
      docType = 'pan';
    }
    if (docname == 'passport' && index == 0) {
      docType = docname;
    }
    if (docname == 'passport' && index == 1) {
      docType = 'passport_back';
    }
    return docType;
  }

  updateFileInfo(index: any, i: any, name: any, dateOfBirth: any, gender: any) {
    const fileInfoControl = this.otherDocument()?.controls[i]?.get('fileInfo');
    if (fileInfoControl && fileInfoControl.value) {
      fileInfoControl.value[index] = {
        ...fileInfoControl.value[index],
        applicantName: name,
        dateOfBirth: dateOfBirth,
        gender: gender,
        documentNumber:
          this.otherDocument()?.controls[i]?.get('docIds')?.value[index],
      };
    }
  }

  documentNotMatched(i: any, file: any) {
    this.deleteFile(i, i, file);
    // this.loder.close();
    this.snack.open(
      `Uploaded Document is not valid or details not found` + ' !',
      'OK',
      {
        duration: 4000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'snackbar-error',
      },
    );
  }

  documentDataMissMatch(title: any, file: any, i: any) {
    const dialogData = {
      error: ` ${title} doesn't match the document upload.`,
      message: 'Would you like to continue?',
    };
    const dialogRef = this.dialog.open(WarningComponent, {
      width: '40%',
      data: dialogData,
      disableClose: true,
      panelClass: '',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result != 'Ok') {
        this.deleteFile(i, i, file);
      }
    });
  }

  uploadImage(file: any, i: any) {
    const formData = new FormData();
    const data = {
      ...(this.isOtherDocVisible
        ? {
            documentNameForChecklist:
              this.createDocumentForm.value.otherDocument[i].documentType,
          }
        : ''),
      documentName: !this.isOtherDocVisible ? this.nationalIdGeneric : null,
      documentType: !this.isOtherDocVisible
        ? this.nationalIdGeneric
        : this.createDocumentForm.value.otherDocument[i].documentType,
      documentNumber:
        this.createDocumentForm.value.otherDocument[i].documentNumber,
      documentSide:
        this.createDocumentForm.value.otherDocument[i]?.docIds?.length + 1,
      fileName: file.name,
      fileType: file.type,
      verificationType: 'kyc',
    };

    formData.append('data', JSON.stringify(data));
    formData.append('file', file);
    formData.append('module', 'document');
    this.ocrPass = false;

    this.documentUploadService.uploadDocuments(formData).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        this.updateDocId(i).push(resp.data.documentId);
        this.fileUrls.push(resp.data.fileUrl);
        if (this.fileUrls.length > 0) {
          this.frontAadhar = this.fileUrls[0];
        }
        this.documentIds.push(this.createDocumentForm.value);
        const fileInfoArr =
          this.otherDocument().controls[i]?.get('fileInfo')?.value;
        fileInfoArr.forEach((fileInfoObj: any) => {
          if (resp.data.fileName.includes(fileInfoObj.name)) {
            fileInfoObj.newFileUrl = resp.data.fileUrl;
          }
        });
        this.otherDocument()
          .controls[i]?.get('fileInfo')
          ?.setValue(fileInfoArr);

        const index =
          this.otherDocument()?.controls[i]?.get('fileInfo')?.value?.length - 1;

        this.updateFileInfo(
          index,
          i,
          this.documentInfo?.name,
          this.documentInfo?.dateOfBirth,
          this.documentInfo?.gender,
        );

        // ✅ Always call extractDoc now
        this.extractDoc(
          this.createDocumentForm.value.otherDocument[i].documentType,
          parseInt(this.sessionStorageService.getOriginationId()),
          file,
          resp.data.documentId,
        );
      }
    });
  }

  //for demo purpose removed error message
  extractDoc(docName: any, originationId: any, file: any, documentId: any) {
    const formData = new FormData();
    formData.append('fileName', file);
    this.docapi
      .getCheckListDoc(docName, originationId, formData, documentId)
      .subscribe((resp) => {
        if (resp) {
          if (
            resp?.data?.customerName?.toLowerCase() !==
            this.docAppliName?.toLowerCase()
          ) {
            console.log(`National Id name is not matching with this customer.`);
          } else {
            console.log(`National Id name matches the customer.`);
          }
        }
      });
  }

  updateDocId(indx: any): any[] {
    return this.otherDocument().controls[indx]?.get('docIds')?.value;
  }

  displayImage(indx: any, file: any, size: any) {
    const reader = new FileReader();
    const sizeinKb = (size / 1024).toFixed(2);
    reader.onload = (event: ProgressEvent<FileReader> | any) => {
      this.imageUrl = event.target.result as string;
      this.getFileInfo(indx).push({
        url: this.imageUrl,
        name: file.name,
        progress: '100%',
        size: `${sizeinKb}kb`,
        newFileUrl: '',
        pdfUrl: '',
        imageUrl: '',
      });
      setTimeout(() => {
        this.getFileInfo(indx)[this.getFileInfo(indx)?.length - 1].progress =
          '0%';
      }, 1000);
    };
    reader.readAsDataURL(this.selectedImage);
  }

  fileUrl(file: any) {
    return URL.createObjectURL(file);
  }

  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files?.[index]?.doc?.progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].doc.progress += 10;
          }
        }, 200);
      }
    }, 1000);
  }

  onFileDropped(event: any, i: any) {
    console.log(event);
    if (event.files.type.startsWith('image/')) {
      this.selectedImage = event.files;
      this.displayImage(i, event.files, event.files?.size);
      this.uploadImage(event.files, i);
    }
    const fReader = new FileReader();
    fReader.readAsDataURL(event.files);
  }

  onSubmit() {
    const hasUploadedRequiredDocs = this.otherDocument()?.value?.some(
      (item: any) => item.fileInfo.length == 0 && item.docRequired,
    );

    if (hasUploadedRequiredDocs) {
      return;
    }
    let isDocUploaded = false;
    if (this.createDocumentForm) {
      isDocUploaded = this.createDocumentForm.value.otherDocument
        .filter((docItem: any) => docItem.documentType)
        .every((item: any) => item.fileInfo?.length > 0);
    }
    console.log(this.createDocumentForm);

    // if (this.createDocumentForm.invalid || !isDocUploaded) {
    //   return;
    // }
    console.log(isDocUploaded);
    this.isLoading = true;
    this.loadingBtnText = 'Saving...';
    this.CustomSubmit.emit({
      documentDetails: this.createDocumentForm.value,
    });
  }

  onBack() {
    this.backEvent.emit();
  }

  /**
   * checking form is valid or not and insuring for opened card  document  is uploaded.
   * @returns true false depending upon above codition.
   */
  checkDocValidity() {
    if (this.createDocumentForm) {
      const isDocUploaded = this.createDocumentForm.value.otherDocument.every(
        (docItem: any) => docItem.fileInfo?.length > 0,
      );
      return (this.createDocumentForm.invalid || !isDocUploaded) &&
        this.individual
        ? true
        : false;
    }
    return;
  }

  onDocumentSelection(event: any, index: any) {
    if (!Object.prototype.hasOwnProperty.call(this.hideSelect, index)) {
      if (!this.hideSelect.includes(event)) this.hideSelect.push(event);
    } else this.hideSelect[index] = event;

    console.log(this.hideSelect, 'this.hideSelect');
  }

  isDocumentOptionDisabled2(item: any) {
    return this.hideSelect.includes(item);
  }

  checkValidity() {
    return (
      Math.abs(this.documentTypeArray?.length - this?.hideSelect?.length) < 1 ||
      this.documentTypeArray?.length ==
        this.createDocumentForm.value.otherDocument.length
    );
  }

  openDialog(check?: string) {
    const dialogRef = this.dialog.open(ScanComponent, {
      disableClose: false,
      width: '60%',
      data: { title: 'Sign Now', check: check },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.image) {
        const timestamp = new Date();
        const seconds = timestamp.getSeconds();
        fetch(res.image)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], `${seconds}_FaceScan.png`, {
              type: 'image/png',
            });
            this.validateFace(file);
          });
      }
    });
  }

  uploadFace(file: any) {
    const form = new FormData();
    form.append('file', file);
    this.openApi.faceRegister(form).subscribe((res) => {
      this.faceId = res?.data?.data?.biometricId;
      this.image = res?.data?.data?.fileUrl;
      this.sessionStorageService.setBiometricId(this.faceId);
    });
  }
  openFile(file: any) {
    this.dialog.open(ImageDialogComponent, {
      data: {
        imageUrl: this.baseUrl + file.newFileUrl,
        imageName: file.name ?? 'document',
        pdfUrl: this.baseUrl + file.newFileUrl,
      },
      width: '900px',
      height: '560px',
      panelClass: 'imageViewDialog',
    });
  }
  async validateFace(file: any) {
    const form = new FormData();
    const docBlob = await fetch(this.frontAadhar).then((res) => res.blob());
    const docFile = new File([docBlob], 'docImage.png', { type: 'image/png' });
    form.append('faceImage', file);
    form.append('docImage', docFile);
    this.openApi.faceMatch(form).subscribe((res) => {
      console.log(res);
      if (res?.data?.message === 'Face matched successfully')
        this.uploadFace(file);
      else if (res?.data?.message == 'Face did not match') {
        const dialogData = {
          error: `Captured face is not matching with the National id image.`,
          message: 'Would you like to continue?',
        };
        const dialogRef = this.dialog.open(WarningComponent, {
          width: '50%',
          data: dialogData,
          disableClose: true,
          panelClass: '',
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result != 'Ok') {
            this.openDialog();
          } else if (result == 'Ok') this.uploadFace(file);
        });
      }
    });
  }
}
