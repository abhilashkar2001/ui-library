import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GenericValueInfoModel } from 'app/shared/models/generic-value.model';
import { DocumentUploadService } from 'app/shared/services/document-upload.service';
import { GenericValueService } from 'app/shared/services/generic-value.service';

@Component({
  selector: 'app-custom-file-upload',
  templateUrl: './custom-file-upload.component.html',
  styleUrls: ['./custom-file-upload.component.scss'],
})
export class CustomFileUploadComponent implements OnInit, OnChanges {
  createDocumentForm!: FormGroup;
  @Input() checkListDocList: any;
  @Input() isChecklistDoc = false;
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
  screenName = 'customer';
  constructor(
    private fb: FormBuilder,
    private genericValueService: GenericValueService,
    private documentUploadService: DocumentUploadService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges | any): void {
    if (this.isChecklistDoc && changes?.checkListDocList?.currentValue) {
      this.checkListDocList = changes.checkListDocList.currentValue;
      this.noReqCheckListDocList =
        changes.checkListDocList.currentValue.nonRequiredDocument;
      this.buildForm(this.checkListDocList?.requiredDocument ?? []);
    }
    this.getGenericDetails();
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

        if (
          !this.isChecklistDoc &&
          this.screenName.includes('customer') &&
          this.applicant().length === 0
        ) {
          this.addApplicant();
        }
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

    if (
      !this.isChecklistDoc &&
      this.screenName.includes('customer') &&
      this.documentTypeArray
    ) {
      this.addApplicant();
    }
  }

  applicant(): FormArray {
    return this.createDocumentForm.get('applicants') as FormArray;
  }

  otherDocument(): FormArray {
    return this.createDocumentForm?.get('otherDocument') as FormArray;
  }

  getApplicantDocuments(index: number): FormArray {
    return this.applicant().at(index).get('otherDocument') as FormArray;
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
        this.displayImage(i, file, file.size, applicantIndex);
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

  uploadImage(file: File, docIndex: number, applicantIndex?: number): void {
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

    this.documentUploadService.uploadDocuments(formData).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        const docIdsControl = docControl.get('docIds') as FormControl;
        const existingDocIds = docIdsControl?.value || [];
        docIdsControl.setValue([...existingDocIds, resp.data.documentId]);

        const fileInfoArr = docControl.get('fileInfo')?.value || [];
        fileInfoArr.forEach((fileInfoObj: any) => {
          if (resp.data.fileName.includes(fileInfoObj.name)) {
            fileInfoObj.newFileUrl = resp.data.fileUrl;
          }
        });
        docControl.get('fileInfo')?.setValue([...fileInfoArr]);

        this.fileUrls?.push(resp.data?.fileUrl);
        this.documentIds.push(this.createDocumentForm.value);

        if (
          data?.documentNameForChecklist?.toLowerCase()?.includes('national') &&
          docIndex === 0 &&
          !isApplicantDoc
        ) {
          this.frontAadhar = resp.data.fileUrl;
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
      }
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
        size: `${sizeinKb}kb`,
        newFileUrl: '',
        pdfUrl: '',
        imageUrl: '',
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
    console.log(this.createDocumentForm, 'checkk');
    return this.otherDocument().at(index)?.get('fileInfo')?.value;
  }

  getFileUrl(file: any) {
    if (file.name.endsWith('pdf') || file.name.endsWith('xlsx')) {
      return 'assets/images/file_icon.svg';
    } else return file.url;
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
        doc.values.toLowerCase().includes('address proof') ||
        doc.values.toLowerCase().includes('id proof'),
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
