import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DmsService } from '@onerumango/utils';
import { FaceScanComponent } from 'app/shared/components/face-scan/face-scan.component';
import { FingerprintScanComponent } from 'app/shared/components/fingerprint-scan/fingerprint-scan.component';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { SharedService } from 'app/shared/services/shared.service';

@Component({
  selector: 'app-personal-identification',
  templateUrl: './personal-identification.component.html',
  styleUrls: ['./personal-identification.component.scss'],
})
export class PersonalIdentificationComponent implements OnInit {
  @Input() docCustomerDetails: any;
  personalIdentificationForm!: FormGroup;
  isChecklistDoc: boolean = false;
  selectedImage: Blob | any;
  nationalIdGeneric: any;
  ocrPass: boolean = false;
  fileUrls: any[] = [];
  documentIds = [
    {
      docIds: [],
    },
  ];
  frontAadhar!: string;
  documentInfo: any;
  @Output() CustomSubmit: EventEmitter<any> = new EventEmitter();
  customeSelected: string | null = null;
  panelExpanded: boolean = false;
  faceExpanded: boolean = false;
  biometricExpanded: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dmsService: DmsService,
    private cdr: ChangeDetectorRef,
    private pyScanService: SharedService,
    private sessionStorageService: SessionStorageService,
    private dialog: MatDialog,
  ) {
    const type = localStorage.getItem('account-type');
    this.customeSelected = type ?? null;
  }

  ngOnInit() {
    this.buildForm();
  }

  /**
   * Form bulider
   */
  buildForm() {
    if (this.customeSelected == 'individual') {
      this.personalIdentificationForm = this.fb.group({
        otherDocument: this.newDenom(),
      });
    } else {
      this.personalIdentificationForm = this.fb.group({
        applicant: this.fb.array([]),
      });
      this.addApplicant();
    }
  }

  //Reusable Form Group
  newDenom(data?: any): FormGroup {
    const docType = data?.values ?? (data?.document || '');
    return this.fb.group({
      documentNumber: [''],
      documentType: [docType],
      fileInfo: new FormControl([]),
      docIds: new FormControl([]),
      docRequired: data?.docRequired ?? false,
      nationalId: [''],
      biometricIds: [''],
      faceId: [],
      fingerPrintId: [],
      faceUrl: [],
    });
  }

  /**
   * To get the application form as formArray
   */
  get applicant(): FormArray {
    return this.personalIdentificationForm.get('applicant') as FormArray;
  }

  /**
   * To get the otherDocument as FormArray
   */
  get otherDocument(): FormArray {
    return this.personalIdentificationForm?.get('otherDocument') as FormArray;
  }

  /**
   * To get the application formArray controls
   * @param index
   * @returns
   */
  getApplicantDocuments(index: number): FormArray {
    return this.applicant.at(index) as FormArray;
  }

  /**
   * To Add the applicant form
   * @param data
   */
  addApplicant(data?: any) {
    this.applicant.push(this.newDenom(data));
  }

  /**
   * To remove the uploaded image
   * @param fileIndex
   * @param applicantIndex
   */
  removeFile(fileIndex: number, applicantIndex?: number): void {
    const docArray =
      this.customeSelected != 'individual' && applicantIndex != null
        ? this.getApplicantDocuments(applicantIndex)
        : this.otherDocument;

    const docGroup = docArray;
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

  /**
   * To remove the applicant for joint and minor
   * @param index
   */
  removeApplicant(index: number) {
    this.applicant.removeAt(index);
  }

  /**
   * To browse the file
   * @param applicantIndex
   */
  fileBrowseHandler(applicantIndex?: number): void {
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

        this.uploadImage(file, applicantIndex);
      }
    });

    inputElement.click();
  }

  /**
   * To upload the document
   * @param file
   * @param applicantIndex
   */
  uploadImage(file: File, applicantIndex?: any): void {
    const isApplicantDoc = applicantIndex != null;
    const docArray =
      this.customeSelected != 'individual' && isApplicantDoc
        ? this.getApplicantDocuments(applicantIndex!)
        : this.otherDocument;

    const docControl = docArray;
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
        this.displayImage(file, resp.uuid, file.size, applicantIndex);
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
        this.documentIds.push(this.personalIdentificationForm.value);

        if (
          data?.documentNameForChecklist?.toLowerCase()?.includes('national') &&
          !isApplicantDoc
        ) {
          this.frontAadhar = resp.fileUrl;
        }

        const index = fileInfoArr.length - 1;
        this.updateFileInfo(
          index,
          this.documentInfo?.name,
          this.documentInfo?.dateOfBirth,
          this.documentInfo?.gender,
          applicantIndex,
        );

        const documentType = this.isChecklistDoc
          ? this.otherDocument?.get('documentType')?.value
          : this.getApplicantDocuments(applicantIndex)?.get('documentType')
              ?.value;

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

  /**
   * To display the image
   * @param file
   * @param uuid
   * @param size
   * @param applicantIndex
   */
  displayImage(file: any, uuid: string, size: any, applicantIndex?: number) {
    const reader = new FileReader();
    const sizeinKb = (size / 1024).toFixed(2);
    reader.onload = (event: ProgressEvent<FileReader> | any) => {
      const imageUrl = event.target.result as string;
      const control =
        this.customeSelected != 'individual' && applicantIndex != null
          ? this.getApplicantDocuments(applicantIndex)
          : this.otherDocument;

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

  /**
   * To extract the data from document
   * @param docName
   * @param originationId
   * @param file
   * @param documentId
   * @param applicantIndex
   */
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
          documentDetails: this.personalIdentificationForm.value,
        });
      });
  }

  /**
   * To update file info
   * @param index
   * @param name
   * @param dateOfBirth
   * @param gender
   * @param applicantIndex
   */
  updateFileInfo(
    index: number,
    name: string,
    dateOfBirth: any,
    gender: string,
    applicantIndex?: number,
  ) {
    const fileInfoControl = (
      this.customeSelected != 'individual' && applicantIndex != null
        ? this.getApplicantDocuments(applicantIndex)
        : this.otherDocument
    )?.get('fileInfo');

    if (fileInfoControl && fileInfoControl.value) {
      fileInfoControl.value[index] = {
        ...fileInfoControl.value[index],
        applicantName: name,
        dateOfBirth: dateOfBirth,
        gender: gender,
        documentNumber: this.updateDocId(applicantIndex)?.[index],
      };
    }
  }

  /**
   * To update the docId
   * @param applicantIndex
   * @returns
   */
  updateDocId(applicantIndex?: number): any[] {
    return (
      this.customeSelected != 'individual' && applicantIndex != null
        ? this.getApplicantDocuments(applicantIndex)
        : this.otherDocument
    )?.get('docIds')?.value;
  }

  /**
   * To get the file Info
   * @param applicantIndex
   * @returns
   */
  getFileInfo(applicantIndex?: number) {
    if (applicantIndex != null) {
      return this.personalIdentificationForm.get('fileInfo')?.value;
    }

    return this.otherDocument.get('fileInfo')?.value;
  }

  /**
   * To open the face Scan or fingerPrint dialog
   * @param type
   * @param index
   */
  openDialog(type: string, index?: number) {
    switch (type) {
      case 'face':
        const faceId =
          index == null
            ? this.otherDocument.get('faceId')
            : this.getApplicantDocuments(index)?.get('faceId');
        const faceDialog = this.dialog.open(FaceScanComponent, {
          panelClass: 'custom_biometric_container',
          width: '45%',
          backdropClass: 'custom_popup_backdrop',
          disableClose: true,
          data: {
            hideClick: true,
            biometricId: faceId?.value,
            popType: 'user',
          },
        });
        faceDialog.afterClosed().subscribe((res: any) => {
          if (res) {
            const faceUrl =
              index == null
                ? this.otherDocument.get('faceUrl')
                : this.getApplicantDocuments(index)?.get('faceUrl');
            faceId?.setValue(res?.biometricId);
            faceUrl?.setValue(res?.imageUrl);
            this.updateBiometricIds(faceId?.value, index);
            this.cdr.detectChanges();
          }
        });
        break;
      case 'fingerPrint':
        const fingerPrintDialog = this.dialog.open(FingerprintScanComponent, {
          panelClass: 'custom_biometric_container',
          width: '45%',
          backdropClass: 'custom_popup_backdrop',
          disableClose: true,
        });
        fingerPrintDialog.afterClosed().subscribe((res: any) => {
          if (res) {
            const fingerPrintId =
              index == null
                ? this.otherDocument.get('fingerPrintId')
                : this.getApplicantDocuments(index)?.get('fingerPrintId');
            fingerPrintId?.setValue(res?.biometricId);
            this.updateBiometricIds(fingerPrintId?.value, index);
          }
        });
        break;
      default:
        break;
    }
  }

  /**
   * To update biometric Id's
   * @param newId
   * @param idx
   */
  private updateBiometricIds(newId: any, idx?: number) {
    const control =
      idx == null
        ? this.otherDocument.get('biometricIds')
        : this.getApplicantDocuments(idx)?.get('biometricIds');
    let ids = control?.value || [];

    // Ensure it's always an array and avoid duplicates
    if (!ids.includes(newId)) {
      ids.push(newId);
      control?.setValue(ids);
    }
  }

  /**
   * To delete the uploaded face scan or fingerPrint
   * @param imageType
   * @param idx
   */
  imageDeleted(imageType: string, idx?: number) {
    const bioIds =
      idx == null
        ? this.otherDocument.get('biometricIds')?.value || []
        : this.getApplicantDocuments(idx).get('biometricIds');
    switch (imageType) {
      case 'face':
        const faceId =
          idx == null
            ? this.otherDocument.get('faceId')
            : this.getApplicantDocuments(idx)?.get('faceId');
        const faceUrl =
          idx == null
            ? this.otherDocument.get('faceUrl')
            : this.getApplicantDocuments(idx)?.get('faceUrl');
        if (faceId) {
          const index = bioIds.indexOf(faceId?.value);
          if (index > -1) {
            bioIds.splice(index, 1);
            faceId.setValue(null);
          }
        }
        faceUrl?.setValue('');
        break;
      case 'fingerprint':
        const fingerPrintId =
          idx == null
            ? this.otherDocument.get('fingerPrintId')
            : this.getApplicantDocuments(idx)?.get('fingerPrintId');
        if (fingerPrintId) {
          const index = bioIds.indexOf(fingerPrintId?.value);
          if (index > -1) {
            bioIds.splice(index, 1);
            fingerPrintId.setValue(null);
          }
        }
        break;
      default:
        break;
    }
  }
}
