import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'app/shared/services/shared.service';
import { environment } from 'environments/environment';
import { WarningComponent } from '../../../../../shared/components/warning/warning.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CUSTOMFILE } from 'app/shared/models/custom-file.model';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { DocumentUploadService } from 'app/shared/services/document-upload.service';

@Component({
  selector: 'app-web-doc-upload',
  templateUrl: './web-doc-upload.component.html',
  styleUrls: ['./web-doc-upload.component.scss'],
})
export class WebDocUploadComponent implements OnInit {
  @Output() backEvent: EventEmitter<any> = new EventEmitter();
  @Output() CustomSubmit: EventEmitter<any> = new EventEmitter();
  @Output() customDocumentForm = new EventEmitter<any>();
  @Output() customSaveDocument = new EventEmitter<any>();
  @Input() documentTypeArray: any;
  @Input() verificationType: string | any;
  @Input() documentList: any = [];
  @Input() genericScreenInfo: any;
  @Input() ocrProcess: boolean | any;

  documentControls!: FormGroup;
  createDocumentForm!: FormGroup;
  documentIds = [
    {
      docIds: [],
    },
  ];
  files: CUSTOMFILE[] = [];
  uploadedDocResponse: any = [];
  docIds: any[] = [];
  stepperTitle: any;

  staticData = {
    DOCUMENTNAME: [],
  };
  selectedImage: Blob | any;
  imageUrl: string | any;
  baseUrl = environment.microServiceURL;
  screenName = 'Loan Document';
  hideSelect: string[] = [];
  // SAVE BUTTON PROPERTIES
  isLoading: boolean | any = false;
  loadingBtnText = 'Saving...';
  ocrCheck = true;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private snack: MatSnackBar,
    private genericValueService: GenericValueService,
    private dialog: MatDialog,
    private documentUploadService: DocumentUploadService,
  ) {
    this.stepperTitle = this.activatedRoute.snapshot['queryParams']['title'];
    // this.buildDocumentForm();
  }

  ngOnInit(): void {
    if (!this.ocrProcess) this.ocrCheck = this.ocrProcess;
  }

  ngOnChanges(changes: SimpleChanges | any): void {
    if (changes?.documentList?.currentValue) {
      if (!this.documentTypeArray) {
        this.documentTypeArray = [{}];
        this.getGenericDetails();
      }
      this.buildForm(changes?.documentList?.currentValue);
    } else this.buildForm();

    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
  }

  getGenericDetails() {
    this.genericValueService
      .loadGenericValue(Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.documentTypeArray = resp.data['DOCUMENTNAME'];
        }
      });
  }

  buildForm(data?: any) {
    this.createDocumentForm = this.fb.group({
      otherDocument: this.fb.array([]),
    });
    if (data?.length > 0) {
      data.forEach((item: any, i: number) => {
        this.hideSelect.push(item?.documentType);
        this.showDocument(item, i);
        this.customDocumentForm.emit(this.createDocumentForm);
      });
    } else {
      {
        this.addDocument();
        this.customDocumentForm.emit(this.createDocumentForm);
      }
    }
  }

  otherDocument(): FormArray {
    return this.createDocumentForm.get('otherDocument') as FormArray;
  }

  showDocument(data: any, i: number) {
    this.documentControls = this.fb.group({
      documentNumber: [data ? data.documentNumber : ''],
      documentType: [
        data ? parseInt(data.documentType) : '',
        Validators.required,
      ],
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

  calculateDoc(data: any, i: number) {
    const docArr = [];
    const docIds = [];
    // data.forEach((item, ind) => {
    // console.log(item, ind);
    const docItem = {
      progress: 100,
      name: data.fileName,
    };
    docArr.push({
      docId: data.documentId,
      doc: docItem,
      url: this.mapEndPoints(data.fileUrl),
    });
    docIds.push(data.documentId);
    // });
    this.otherDocument().controls[i]?.get('docIds')?.setValue(docIds);
    return docArr;
  }

  newDenom(): FormGroup {
    return this.fb.group({
      documentNumber: [''],
      documentType: ['', Validators.required],
      fileInfo: new FormControl([]),
      docIds: new FormControl([]),
    });
  }

  getFileInfo(indx: number): any[] {
    return this.otherDocument().controls[indx]?.get('fileInfo')?.value;
  }

  /**
   * NOTE:- Once delete api will get then only this methods api will call.
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number, i: number, _doc?: any) {
    // this.commonService.deleteDocument(documentId).subscribe((res) => {
    // if (res) {
    // console.log("Document deleted Successfully..");
    this.createDocumentForm.value.otherDocument[i].docIds.splice(index, 1);
    //   }
    // });
    this.otherDocument().controls[i]?.get('fileInfo')?.value.splice(index, 1);
  }

  deleteDocument(i: number) {
    this.otherDocument().removeAt(i);
    this.hideSelect.splice(i, 1);
  }

  addDocument() {
    this.otherDocument().push(this.newDenom());
  }

  mapEndPoints(url: any) {
    return `${this.baseUrl}${url}`;
  }
  fileBrowseHandler(indx: number) {
    this.browseFiles(indx);
  }
  browseFiles(i: number) {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = 'image/*';
    inputElement.addEventListener('change', (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file: any = target.files[0];
        console.log(file, 'file');
        if (file.type.startsWith('image/')) {
          this.selectedImage = file;
          this.displayImage(i, file);
          this.uploadImage(file, i);
        }
        const fReader = new FileReader();
        fReader.readAsDataURL(file);
      }
    });

    inputElement.click();
    this.uploadFilesSimulator(0);
  }

  getDocTypeforScan(docname: any) {
    let docType;
    if (docname == 'aadhar card') {
      docType = 'adhaar';
    }
    if (docname == 'pan card') {
      docType = 'pan';
    }
    if (docname == 'passport') {
      docType = docname;
    }
    return docType;
  }

  async readDocument(file: File, i: number) {
    const formdata = new FormData();
    formdata.append('image', file);
    formdata.append('lang', 'eng');
    formdata.append(
      'imageType',
      this.getDocTypeforScan(this.hideSelect[i]?.toLowerCase()),
    );
    // try {
    const res: any = await this.sharedService
      .readAadharFrontData(formdata)
      .toPromise();
    if (res?.statusCode == 200) {
      if (
        Object.keys(res?.data).filter(
          (value) =>
            res?.data[value] != 'Detail not found' && res?.data[value] != null,
        )?.length < 1
      ) {
        this.documentNotMatched(i, file);
        return -1;
      } else {
        // this.loder.close();
        this.snack.open(`Document Uploaded Successfully` + ' !', 'OK', {
          duration: 4000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'snackbar-error',
        });
        console.log(res);
        // if document details not found or document is invalid.
        if (
          (res.data?.adhaarNumber == 'Detail not found' ||
            res.data?.panNumber == 'Detail not found' ||
            res.data?.passportNumber == 'Detail not found') &&
          res.data?.dateOfBirth == 'Detail not found'
        ) {
          this.documentNotMatched(i, file);
        } else {
          // for aadhar
          const index =
            this.otherDocument().controls[i]?.get('fileInfo')?.value?.length -
            1;
          console.log(index);
          this.updateFileInfo(index, i, res.data?.name, res.data?.dateOfBirth);
          if (this.hideSelect[i]?.toLowerCase().includes('aadhar')) {
            if (
              res.data?.adhaarNumber.replace(/\s/g, '') !=
              this.otherDocument()['controls'][i]?.get('documentNumber')?.value
            ) {
              this.documentDataMissMatch(`Document number`, file, i);
            }
          }
          // for pan card
          else if (this.hideSelect[i]?.toLowerCase().includes('pan')) {
            if (
              res.data?.panNumber.replace(/\s/g, '') !=
              this.otherDocument()['controls'][i]?.get('documentNumber')?.value
            ) {
              this.documentDataMissMatch(`Document number`, file, i);
            }
          }
          // for passport.
          else if (this.hideSelect[i]?.toLowerCase().includes('passport')) {
            console.log(res);
            if (
              res.data?.passportNumber.replace(/\s/g, '') !=
              this.otherDocument()['controls'][i]?.get('documentNumber')?.value
            ) {
              this.documentDataMissMatch(`Document number`, file, i);
            }
          }
        }
      }
    }
    return;
  }

  updateFileInfo(
    index: number,
    i: number,
    name: string,
    dateOfBirth: Date,
  ): void {
    const fileInfoControl = this.otherDocument()?.controls[i]?.get('fileInfo');

    if (fileInfoControl && fileInfoControl.value) {
      fileInfoControl.value[index] = {
        ...fileInfoControl.value[index],
        applicantName: name,
        dateOfBirth: dateOfBirth,
      };
    } else {
      console.error(`File info or control is not defined for index ${i}`);
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
      documentName: this.createDocumentForm.value.otherDocument[i].documentType,
      documentType: this.createDocumentForm.value.otherDocument[i].documentType,
      documentNumber:
        this.createDocumentForm.value.otherDocument[i].documentNumber,
      documentSide: 1,
      fileName: file.name,
      fileType: file.type,
      verificationType: 'kyc',
    };

    formData.append('data', JSON.stringify(data));
    formData.append('file', file);
    formData.append('module', 'document');
    this.documentUploadService.uploadDocuments(formData).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        this.updateDocId(i).push(resp.data.documentId);
        this.documentIds.push(this.createDocumentForm.value);
        if (this.ocrCheck) this.readDocument(file, i);
      }
    });
  }
  updateDocId(indx: any): any[] {
    return this.otherDocument().controls[indx]?.get('docIds')?.value;
  }

  displayImage(indx: any, file: any) {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader> | any) => {
      this.imageUrl = event.target.result as string;
      this.getFileInfo(indx).push({
        url: this.imageUrl,
        name: file.name,
      });
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
          if (this.files) {
            if (this.files?.[index]?.doc?.progress === 100) {
              clearInterval(progressInterval);
              this.uploadFilesSimulator(index + 1);
            } else {
              if (this.files.length < 0 && this.files[index]) {
                this.files[index]!.doc.progress += 10;
              }
            }
          }
        }, 200);
      }
    }, 1000);
  }

  onFileDropped(event: any, i: any) {
    console.log(event);
    if (event.files.type.startsWith('image/')) {
      this.selectedImage = event.files;
      this.displayImage(i, event.files);
      this.uploadImage(event.files, i);
    }
    const fReader = new FileReader();
    fReader.readAsDataURL(event.files);
  }

  onSubmit() {
    let isDocUploaded = false;
    if (this.createDocumentForm) {
      isDocUploaded = this.createDocumentForm.value.otherDocument.every(
        (docItem: any) => docItem.fileInfo?.length > 0,
      );
    }
    if (this.createDocumentForm.invalid || !isDocUploaded) {
      return;
    }
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
      return this.createDocumentForm.invalid || !isDocUploaded ? true : false;
    }
    return;
  }

  onDocumentSelection(event: any, index: any) {
    if (!this.hideSelect.includes(event)) this.hideSelect.push(event);
    else this.hideSelect[index] = event;
    console.log(this.hideSelect, 'this.hideSelect');
  }

  isDocumentOptionDisabled2(item: any) {
    return this.hideSelect.includes(item);
  }

  checkValidity() {
    return Math.abs(this.documentTypeArray?.length - this?.hideSelect?.length) <
      1 ||
      this.documentTypeArray?.length ==
        this.createDocumentForm.value.otherDocument.length
      ? true
      : false;
  }
}
