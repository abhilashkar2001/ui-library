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
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GenericValueInfoModel } from 'app/shared/models/generic-value.model';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { DmsService } from '@onerumango/utils';
import { SharedService } from 'app/shared/services/shared.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { environment } from 'environments/environment';
import { LoanService } from 'app/shared/services/loan/loan.service';

@Component({
  selector: 'app-custom-file-upload',
  templateUrl: './custom-file-upload.component.html',
  styleUrls: ['./custom-file-upload.component.scss'],
})
export class CustomFileUploadComponent implements OnInit, OnChanges {
  createDocumentForm!: FormGroup;
  @Input() checkListDocList: any;
  @Input() getDocumentList: any;
  @Input() screenNameValue: string | any;
  @Input() noOfDirectors = 1;
  @Output() CustomSubmit: EventEmitter<any> = new EventEmitter();
  staticData: GenericValueInfoModel = {
    DOCUMENTNAME: [],
  };

  imageUrl: string | undefined;
  selectedImage: Blob | any;
  files: any;
  documentTypeArray: any;
  nationalIdGeneric: any;
  ocrPass = false;
  frontAadhar: any;
  fileUrls: any[] = [];
  documentIds = [
    {
      docIds: [],
    },
  ];
  documentInfo: any;
  noReqCheckListDocList: any;
  baseUrl = environment.microServiceURL;
  isChecklistDoc = false;
  constructor(
    private fb: FormBuilder,
    private genericValueService: GenericValueService,
    private dmsService: DmsService,
    private cdr: ChangeDetectorRef,
    private pyScanService: SharedService,
    private sessionStorageService: SessionStorageService,
    private loanService: LoanService,
  ) {}

  ngOnInit() {
    if (this.screenNameValue.includes('Loan')) {
      this.isChecklistDoc = true;
    } else {
      this.isChecklistDoc = false;
    }
    this.getGenericDetails();
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges | any): void {
    if (this.isChecklistDoc && changes?.checkListDocList?.currentValue) {
      this.checkListDocList = changes.checkListDocList.currentValue;
      this.noReqCheckListDocList =
        changes.checkListDocList.currentValue.nonRequiredDocument;
      this.buildForm(this.checkListDocList?.requiredDocument ?? []);
    }

    if (changes?.getDocumentList?.currentValue?.length > 0) {
      this.getDocumentList = changes.getDocumentList.currentValue;
      this.getDocumentList.forEach((docItem: any) => {
        const docData = docItem.docInfoModel ?? [];
        const formIndex = this.otherDocument().controls.findIndex(
          (ctrl) =>
            ctrl.get('documentType')?.value?.toLowerCase() ===
            docItem.document?.toLowerCase(),
        );

        if (formIndex !== -1) {
          const fileInfo = this.calculateDoc(docData, formIndex);
          this.otherDocument()
            .at(formIndex)
            ?.get('fileInfo')
            ?.setValue(fileInfo);
        }
      });
    }
  }

  calculateDoc(data: any[], i: number) {
    const docArr: any[] = [];
    const docIds: number[] = [];
    data.forEach((item: any) => {
      docArr.push({
        docId: item.id,
        name: item.fileName,
        progress: 100,
        url: item.uuid,
        uuid: item.uuid,
      });
      docIds.push(item.id);
    });

    this.otherDocument().at(i)?.get('docIds')?.setValue(docIds);
    this.CustomSubmit.emit({
      documentDetails: this.createDocumentForm.value,
    });
    return docArr;
  }

  getGenericDetails() {
    this.genericValueService
      .loadGenericValue(Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.staticData = { ...resp.data };
          this.documentTypeArray = resp.data['DOCUMENTNAME'];
          this.nationalIdGeneric = this.documentTypeArray.filter((item: any) =>
            item.values.toLowerCase().includes('national'),
          )[0].values;
        }

        // if (!this.isChecklistDoc && this.applicant()?.length === 0) {
        //   const count = this.noOfDirectors ?? 1;
        //   for (let i = 0; i < count; i++) {
        //     this.addApplicant();
        //   }
        // }
      });
  }

  // Build form
  buildForm(data?: any) {
    this.createDocumentForm = this.fb.group({
      otherDocument: this.fb.array([]),
      applicants: this.fb.array([]),
    });

    if (data?.length > 0) {
      data.forEach((item: any) => {
        this.addDocument(item);
      });
    }

    if (!this.isChecklistDoc && this.documentTypeArray) {
      const count = this.noOfDirectors ?? 1;
      for (let i = 0; i < count; i++) {
        this.addApplicant();
      }
    }
  }

  applicant(): FormArray {
    return this.createDocumentForm?.get('applicants') as FormArray;
  }

  otherDocument(): FormArray {
    return this.createDocumentForm?.get('otherDocument') as FormArray;
  }

  getApplicantDocuments(index: number): FormArray {
    return this.applicant().at(index)?.get('otherDocument') as FormArray;
  }

  addDocument(data?: any) {
    this.otherDocument().push(this.newDenom(data));
  }

  newDenom(data?: any): FormGroup {
    const docType = data?.values ?? (data?.document || '');
    return this.fb.group({
      documentNumber: [''],
      documentType: [docType],
      fileInfo: new FormControl([]),
      docIds: new FormControl([]),
      docRequired: data?.docRequired ?? false,
    });
  }

  fileBrowseHandler(i: number, applicantIndex?: number): void {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    if (!this.isChecklistDoc) inputElement.accept = 'image/*';

    inputElement.addEventListener('change', (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        if (!file) {
          return;
        }
        this.selectedImage = file;

        this.uploadImage(file, i, applicantIndex);
      }
    });

    inputElement.click();
  }

  uploadFilesSimulator(
    docIndex: number,
    fileIndex: number,
    applicantIndex?: number,
  ): void {
    const docArray =
      applicantIndex != null
        ? this.getApplicantDocuments(applicantIndex)
        : this.otherDocument();

    const fileInfoControl = docArray
      .at(docIndex)
      .get('fileInfo') as FormControl;
    const files = fileInfoControl?.value || [];

    setTimeout(() => {
      if (fileIndex >= files.length) {
        return;
      }

      const progressInterval = setInterval(() => {
        const currentProgress = parseInt(files[fileIndex].progress);
        if (currentProgress >= 100) {
          clearInterval(progressInterval);
          this.uploadFilesSimulator(docIndex, fileIndex + 1, applicantIndex);
        } else {
          files[fileIndex].progress = `${Math.min(currentProgress + 10, 100)}%`;
          fileInfoControl.setValue([...files]);
        }
      }, 200);
    }, 1000);
  }

  uploadImage(file: File, docIndex: number, applicantIndex?: any): void {
    const isApplicantDoc = applicantIndex != null;
    const docArray = isApplicantDoc
      ? this.getApplicantDocuments(applicantIndex!)
      : this.otherDocument();

    const docControl = docArray.at(docIndex);
    const currentDoc = docControl.value;

    const formData = new FormData();
    const isChecklist = !this.isChecklistDoc;

    const data: any = {
      ...(this.isChecklistDoc
        ? { documentNameForChecklist: currentDoc.documentType }
        : {}),
      documentName: isChecklist ? this.nationalIdGeneric : null,
      documentType: isChecklist
        ? this.nationalIdGeneric
        : currentDoc.documentType,
      documentNumber: currentDoc.documentNumber,
      documentSide: (currentDoc?.docIds?.length ?? 0) + 1,
      fileName: file.name,
      fileType: file.type,
      verificationType: 'kyc',
    };

    formData.append('data', JSON.stringify(data));
    formData.append('file', file);
    formData.append('module', 'document');

    this.ocrPass = false;
    this.dmsService.uploadDocuments(formData).subscribe((resp) => {
      if (resp?.uuid) {
        this.displayImage(docIndex, file, resp.uuid, file.size, applicantIndex);
        const docIdsControl = docControl.get('docIds') as FormControl;
        const existingDocIds = docIdsControl?.value || [];
        docIdsControl.setValue([...existingDocIds, resp.documentId]);

        const fileInfoArr = docControl.get('fileInfo')?.value || [];
        fileInfoArr.forEach((fileInfoObj: any) => {
          if (resp.fileName.includes(fileInfoObj.name)) {
            fileInfoObj.newFileUrl = resp.fileUrl;
          }
        });
        docControl.get('fileInfo')?.setValue([...fileInfoArr]);

        this.fileUrls?.push(resp?.fileUrl);
        this.documentIds.push(this.createDocumentForm.value);

        if (
          data?.documentNameForChecklist?.toLowerCase()?.includes('national') &&
          docIndex === 0 &&
          !isApplicantDoc
        ) {
          this.frontAadhar = resp.fileUrl;
        }

        const index = fileInfoArr.length - 1;
        this.updateFileInfo(
          index,
          docIndex,
          this.documentInfo?.name,
          this.documentInfo?.dateOfBirth,
          this.documentInfo?.gender,
          applicantIndex,
        );

        const documentType = this.isChecklistDoc
          ? this.otherDocument().at(docIndex)?.get('documentType')?.value
          : this.getApplicantDocuments(applicantIndex!)
              .at(docIndex)
              ?.get('documentType')?.value;

        const originationId = parseInt(
          this.sessionStorageService.getOriginationId(),
        );

        // Conditionally pass applicantIndex only for applicant docs
        if (this.isChecklistDoc) {
          this.extractDoc(documentType, originationId, file, resp.documentId);
        } else {
          this.extractDoc(
            documentType,
            originationId,
            file,
            resp.documentId,
            applicantIndex,
          );
        }
      }
    });
  }

  extractDoc(
    docName: string,
    originationId: number,
    file: File,
    documentId: number,
    applicantIndex?: number,
  ) {
    const formData = new FormData();
    formData.append('fileName', file);

    // Dynamically pass applicantIndex only if it's for applicant document
    this.pyScanService
      .pyScan(docName, originationId, formData, documentId, applicantIndex)
      .subscribe((resp) => {
        if (resp?.data?.customerName?.toLowerCase()) {
          console.warn(`National Id name is not matching with this customer.`);
        } else {
          console.info(`National Id name matches the customer.`);
        }
        // Emit updated form data
        this.CustomSubmit.emit({
          documentDetails: this.createDocumentForm.value,
        });
      });
  }

  updateDocId(indx: number, applicantIndex?: number): any[] {
    return (
      applicantIndex != null
        ? this.getApplicantDocuments(applicantIndex)
        : this.otherDocument()
    )
      .at(indx)
      ?.get('docIds')?.value;
  }

  updateFileInfo(
    index: number,
    i: number,
    name: string,
    dateOfBirth: any,
    gender: string,
    applicantIndex?: number,
  ) {
    const fileInfoControl = (
      applicantIndex != null
        ? this.getApplicantDocuments(applicantIndex)
        : this.otherDocument()
    )
      ?.at(i)
      ?.get('fileInfo');

    if (fileInfoControl && fileInfoControl.value) {
      fileInfoControl.value[index] = {
        ...fileInfoControl.value[index],
        applicantName: name,
        dateOfBirth: dateOfBirth,
        gender: gender,
        documentNumber: this.updateDocId(i, applicantIndex)?.[index],
      };
    }
  }

  // To display the image
  displayImage(
    docIndex: number,
    file: any,
    uuid: string,
    size: any,
    applicantIndex?: number,
  ) {
    const reader = new FileReader();
    const sizeinKb = (size / 1024).toFixed(2);
    reader.onload = (event: ProgressEvent<FileReader> | any) => {
      const imageUrl = event.target.result as string;
      const control =
        applicantIndex != null
          ? this.getApplicantDocuments(applicantIndex).at(docIndex)
          : this.otherDocument().at(docIndex);

      const fileArray = control.get('fileInfo')?.value || [];

      fileArray.push({
        url: imageUrl,
        name: file.name,
        progress: '100%',
        uuid: uuid,
        size: `${sizeinKb}kb`,
      });
      control.get('fileInfo')?.setValue([...fileArray]);
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  getFileInfo(index: number, applicantIndex?: number) {
    if (applicantIndex != null) {
      return this.getApplicantDocuments(applicantIndex)
        .at(index)
        .get('fileInfo')?.value;
    }

    return this.otherDocument().at(index)?.get('fileInfo')?.value;
  }

  // Detele the file method and remove the docids and fileinfo from fromgroup
  removeFile(
    docIndex: number,
    fileIndex: number,
    applicantIndex?: number,
  ): void {
    const docArray =
      applicantIndex != null
        ? this.getApplicantDocuments(applicantIndex)
        : this.otherDocument();

    const docGroup = docArray.at(docIndex);
    const fileInfoCtrl = docGroup.get('fileInfo') as FormControl;
    const docIdsCtrl = docGroup.get('docIds') as FormControl;

    const files: any[] = fileInfoCtrl?.value || [];
    const docIds: any[] = docIdsCtrl?.value || [];

    if (fileIndex >= 0 && fileIndex < files.length) {
      fileInfoCtrl.setValue([
        ...files.slice(0, fileIndex),
        ...files.slice(fileIndex + 1),
      ]);
    }

    if (fileIndex >= 0 && fileIndex < docIds.length) {
      docIdsCtrl.setValue([
        ...docIds.slice(0, fileIndex),
        ...docIds.slice(fileIndex + 1),
      ]);
    }

    const originationId = parseInt(
      this.sessionStorageService.getOriginationId(),
    );

    const documentIdToDelete = docIds[fileIndex];

    this.loanService
      .deleteCheckList(documentIdToDelete, originationId)
      .subscribe();

    this.CustomSubmit.emit({
      documentDetails: this.createDocumentForm.value,
    });
  }

  removeDocument(index: number) {
    this.otherDocument().removeAt(index);
  }

  addDocumentFromDropdown(documentType: string) {
    this.otherDocument().push(
      this.fb.group({
        documentNumber: [''],
        documentType: [documentType],
        fileInfo: new FormControl([]),
        docIds: new FormControl([]),
        docRequired: false,
      }),
    );
  }

  // For Indiviual or Director Add Applicant Method
  addApplicant() {
    const applicantGroup = this.fb.group({
      otherDocument: this.fb.array([]),
    });
    const requiredDocs = this.documentTypeArray.filter(
      (doc: any) =>
        doc.values.toLowerCase().includes('national') ||
        doc.values.toLowerCase().includes('pan'),
    );
    const docArray = applicantGroup.get('otherDocument') as FormArray;
    requiredDocs.forEach((doc: any) => docArray.push(this.newDenom(doc)));
    this.applicant().push(applicantGroup);
  }

  // For Dynamically Pushing the applicant select document to the form
  addApplicantDocument(data: any) {
    const applicantArray = this.applicant();
    if (applicantArray.length === 0) return;

    const latestApplicant = applicantArray.at(
      applicantArray.length - 1,
    ) as FormGroup;
    const otherDocArray = latestApplicant.get('otherDocument') as FormArray;
    const alreadyExists = otherDocArray.controls.some(
      (ctrl: any) =>
        ctrl.get('documentType')?.value?.toLowerCase() ===
        data.values.toLowerCase(),
    );
    if (!alreadyExists) {
      otherDocArray.push(this.newDenom(data));
    }
  }
}
