import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SharedService } from 'app/shared/services/shared.service';
import { environment } from 'environments/environment';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

@Component({
  selector: 'app-other-documents',
  templateUrl: './other-documents.component.html',
  styleUrls: ['./other-documents.component.scss'],
})
export class OtherDocumentsComponent implements OnInit, OnChanges {
  @Input() updateParentModel: ((value: Partial<any> | any) => void | any) | any;
  createDocumentForm!: FormGroup;
  imageUrl: any;
  kycToggle = 'kyc';
  files: any[] = [];
  @Output() customDocumentForm = new EventEmitter<any>();
  @Output() CustomSubmit = new EventEmitter<any>();
  @Output() backEvent = new EventEmitter<any>();
  @Input() personalDoc: any[] = [];
  verificationType = 'kyc';
  documentControls!: FormGroup;
  @Input() isMasterSave = false;
  staticData = {
    DOCUMENTNAME: [],
  };
  baseUrl = environment.microServiceURL;
  documentList: any = [];
  documentTypeArray: string[] = [];
  hideSelect: string[] = [];
  screenName = 'Select KYC';
  genericScreenInfo = {
    screenName: 'Select KYC',
    staticData: {
      DOCUMENTNAME: [],
    },
  };
  ocrProcess = true;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private loanService: LoanService,
    private cdr: ChangeDetectorRef,
    private sessionStorageService: SessionStorageService,
  ) {}

  ngOnChanges(changes: SimpleChanges | any): void {
    if (changes?.personalDoc?.currentValue) {
      this.documentList = changes?.personalDoc?.currentValue;
    }
  }

  ngOnInit() {
    this.documentList = this.personalDoc;
    const originationId = this.sessionStorageService.getOriginationId();
    if (originationId) this.getDataFromOriginationMaster(originationId);
    else this.buildForm();
  }

  getDataFromOriginationMaster(id: number) {
    this.loanService.getOriginationMaster(id).subscribe((resp: any) => {
      if (resp?.statusCode == 200 && resp?.data) {
        this.documentList =
          resp?.data[0]?.customerInfo[0]?.documnentsInfo?.documents[0]?.docs;
      }
    });
  }

  onDocumentToggle(value: any) {
    this.kycToggle = value;
    this.getGenericDetails();
  }

  getGenericDetails() {
    if (this.kycToggle == 'addDoocuent' && this.documentTypeArray?.length < 1)
      this.sharedService
        .genericValue(this.screenName, Object.keys(this.staticData))
        .subscribe((resp: any) => {
          if (resp?.statusCode === 200) {
            this.documentTypeArray = resp.data['DOCUMENTNAME'];
            this.cdr.detectChanges();
          }
        });
  }

  buildForm(data?: any) {
    this.createDocumentForm = this.fb.group({
      otherDocument: this.fb.array([]),
    });
    if (data?.length > 0) {
      data.forEach((item: any, i: any) => {
        this.hideSelect.push(item?.docs[0].documentName);
        this.showDocument(item?.docs, i);
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

  showDocument(data: any, i: any) {
    this.documentControls = this.fb.group({
      documentNumber: [data ? data[0].documentNumber : '', Validators.required],
      documentType: [data ? data[0].documentName : '', Validators.required],
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

  calculateDoc(data: any, i: any) {
    const docArr: any = [];
    const docIds: any = [];
    data.forEach((item: any, ind: any) => {
      console.log(item, ind);
      const docItem = {
        progress: 100,
        name: item.fileName,
      };
      docArr.push({
        docId: item.documentId,
        doc: docItem,
        url: this.mapEndPoints(item.fileUrl),
      });
      docIds.push(item.documentId);
    });
    this.otherDocument().controls[i]?.get('docIds')?.setValue(docIds);
    return docArr;
  }

  newDenom(): FormGroup {
    return this.fb.group({
      documentNumber: ['', Validators.required],
      documentType: ['', Validators.required],
      fileInfo: new FormControl([]),
      docIds: new FormControl([]),
    });
  }

  getFileInfo(indx: any): any[] {
    return this.otherDocument().controls[indx]?.get('fileInfo')?.value;
  }

  addDocument() {
    this.otherDocument().push(this.newDenom());
  }

  mapEndPoints(url: any) {
    return `${this.baseUrl}${url}`;
  }

  updateDocId(indx: any): any[] {
    return this.otherDocument().controls[indx]?.get('docIds')?.value;
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

  onConfirmEvent(event?: any) {
    const docIds: any = [];
    let customerDetails: any;
    event.documentDetails.otherDocument.forEach((element: any) => {
      const docId = {
        docIds: element.docIds,
      };
      docIds.push(docId);
      if (!customerDetails) {
        element.fileInfo.forEach((item: any) => {
          if (item.applicantName && item.dateOfBirth && !customerDetails) {
            customerDetails = item;
            return;
          }
        });
      }
    });
    this.CustomSubmit.emit({
      documentDetails: event.documentDetails,
    });

    this.updateParentModel({
      kycDoc: docIds,
      updateMasterSave: this.isMasterSave,
      customerDetails: customerDetails,
    });
  }

  goBack() {
    this.backEvent.emit();
  }
}
