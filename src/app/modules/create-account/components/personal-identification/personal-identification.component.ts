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
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DmsService } from '@onerumango/utils';
import { DocumentDetailsComponent } from 'app/modules/loan/components/document-details/document-details.component';
import { FaceScanComponent } from 'app/shared/components/face-scan/face-scan.component';
import { FingerprintScanComponent } from 'app/shared/components/fingerprint-scan/fingerprint-scan.component';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { SharedService } from 'app/shared/services/shared.service';
import {
  ContainerContextData,
  SidenavService,
} from 'app/shared/services/sidenav.service';

@Component({
  selector: 'app-personal-identification',
  templateUrl: './personal-identification.component.html',
  styleUrls: ['./personal-identification.component.scss'],
})
export class PersonalIdentificationComponent implements OnInit {
  @Input() docCustomerDetails: any;
  personalIdentificationForm!: FormGroup;
  isChecklistDoc = false;
  nationalIdGeneric: any;
  ocrPass = false;
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
  panelExpanded = false;
  faceExpanded = false;
  biometricExpanded = false;
  tabIndex = 0;
  ocrData: any[] = [
    {
      label: 'Full Name',
      value: 'Vikas Kumar',
    },
    {
      label: 'Aadhar Number',
      value: '8884 - 6878 -2748',
    },
    { label: 'Date of Birth', value: '10/8/1991' },
    { label: 'Gender', value: 'Male' },
    { label: 'State', value: 'Bihar' },
    { label: 'PinCode', value: '852218' },
  ];

  constructor(
    private fb: FormBuilder,
    private dmsService: DmsService,
    private cdr: ChangeDetectorRef,
    private pyScanService: SharedService,
    private sessionStorageService: SessionStorageService,
    private dialog: MatDialog,
    private sidenavService: SidenavService,
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

  onTabChange(eve: MatTabChangeEvent) {
    this.tabIndex = eve?.index;
  }

  //Reusable Form Group
  newDenom(data?: any): FormGroup {
    const docType = data?.values ?? (data?.document || '');
    return this.fb.group({
      documentNumber: [''],
      documentType: [docType],
      frontSide: this.fb.group({
        fileInfo: [],
        docIds: [],
        ocrData: [this.ocrData],
      }),
      backSide: this.fb.group({
        fileInfo: [],
        docIds: [],
        ocrData: [this.ocrData],
      }),
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

    const fileInfoCtrl =
      this.tabIndex == 0
        ? (docArray.get('frontSide')?.get('fileInfo') as FormControl)
        : (docArray.get('backSide')?.get('fileInfo') as FormControl);

    const docIdsCtrl =
      this.tabIndex == 0
        ? (docArray.get('frontSide')?.get('docIds') as FormControl)
        : (docArray.get('backSide')?.get('docIds') as FormControl);

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
      documentSide:
        (this.tabIndex == 0
          ? (currentDoc?.frontSide?.docIds?.length ?? 0)
          : (currentDoc?.backSide?.docIds?.length ?? 0)) + 1,
      fileName: file.name,
      fileType: file.type,
      verificationType: 'WEB',
    };

    formData.append('data', JSON.stringify(data));
    formData.append('file', file);
    formData.append('module', 'document');

    this.ocrPass = false;
    this.dmsService.uploadDocuments(formData).subscribe((resp) => {
      if (resp?.uuid) {
        this.displayImage(file, resp.uuid, file.size, applicantIndex);
        const docIdsControl =
          this.tabIndex == 0
            ? (docControl.get('frontSide')?.get('docIds') as FormControl)
            : (docControl.get('backSide')?.get('docIds') as FormControl);
        const existingDocIds = docIdsControl?.value || [];
        docIdsControl.setValue([...existingDocIds, resp.documentId]);

        const fileInfoArr =
          this.tabIndex == 0
            ? (docControl.get('frontSide')?.get('fileInfo')?.value ?? [])
            : (docControl.get('backSide')?.get('fileInfo')?.value ?? []);
        fileInfoArr.forEach((fileInfoObj: any) => {
          if (resp.fileName.includes(fileInfoObj.name)) {
            fileInfoObj.newFileUrl = resp.fileUrl;
          }
        });
        if (this.tabIndex == 0) {
          docControl
            .get('frontSide')
            ?.get('fileInfo')
            ?.setValue([...fileInfoArr]);
        } else {
          docControl
            .get('backSide')
            ?.get('fileInfo')
            ?.setValue([...fileInfoArr]);
        }

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

        const documentType =
          this.isChecklistDoc && !isApplicantDoc
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

      const fileArray =
        this.tabIndex == 0
          ? control.get('frontSide')?.get('fileInfo')?.value || []
          : control.get('backSide')?.get('fileInfo')?.value || [];

      fileArray.push({
        url: imageUrl,
        name: file.name,
        progress: '100%',
        uuid: uuid,
        size: `${sizeinKb}kb`,
      });
      if (this.tabIndex == 0) {
        control
          .get('frontSide')
          ?.get('fileInfo')
          ?.setValue([...fileArray]);
      } else {
        control
          .get('backSide')
          ?.get('fileInfo')
          ?.setValue([...fileArray]);
      }
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
    const infoControl =
      this.customeSelected != 'individual' && applicantIndex != null
        ? this.getApplicantDocuments(applicantIndex)
        : this.otherDocument;

    const fileInfoControl =
      this.tabIndex == 0
        ? infoControl.get('frontSide')?.get('fileInfo')
        : infoControl.get('backSide')?.get('fileInfo');

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
    const control =
      this.customeSelected != 'individual' && applicantIndex != null
        ? this.getApplicantDocuments(applicantIndex)
        : this.otherDocument;

    const docValues =
      this.tabIndex == 0
        ? control.get('frontSide')?.get('docIds')?.value
        : control.get('backSide')?.get('docIds')?.value;
    return docValues;
  }

  /**
   * To get the file Info
   * @param applicantIndex
   * @returns
   */
  getFileInfo(applicantIndex?: number) {
    if (applicantIndex != null) {
      return this.tabIndex == 0
        ? (this.personalIdentificationForm.get('frontSide')?.get('fileInfo')
            ?.value ?? [])
        : (this.personalIdentificationForm.get('backSide')?.get('fileInfo')
            ?.value ?? []);
    }

    return this.tabIndex == 0
      ? (this.otherDocument.get('frontSide')?.get('fileInfo')?.value ?? [])
      : (this.otherDocument.get('backSide')?.get('fileInfo')?.value ?? []);
  }

  /**
   * To get the OCR data
   * @param applicantIndex
   * @returns
   */
  getOcrData(applicantIndex?: number) {
    if (applicantIndex != null) {
      return this.tabIndex == 0
        ? this.personalIdentificationForm.get('frontSide')?.get('ocrData')
        : this.personalIdentificationForm.get('backSide')?.get('ocrData');
    }

    return this.tabIndex == 0
      ? this.otherDocument.get('frontSide')?.get('ocrData')
      : this.otherDocument.get('backSide')?.get('ocrData');
  }

  /**
   * To open the side panel for document details editing
   * @param doc
   * @param idx
   */
  openSidePanel(doc: any, idx?: number) {
    const contextData: ContainerContextData = {
      component: DocumentDetailsComponent,
      data: doc,
    };
    const { componentRef } = this.sidenavService.openCustom(contextData);

    if (componentRef) {
      (
        componentRef.instance as DocumentDetailsComponent
      ).documentSubmit.subscribe((data: any) => {
        const orc = this.ocrData.reduce((acc, item) => {
          const key = this.convertLabel(item.label);
          const value = data[key];
          if (value) {
            acc.push({
              label: item.label,
              value: value,
            });
          }
          return acc;
        }, []);
        this.ocrData = [...orc];
        if (idx !== null) {
          this.getOcrData(idx)?.setValue(orc);
        } else {
          this.getOcrData()?.setValue(orc);
        }
        this.cdr.detectChanges();
      });
    }
  }

  /**
   * To convert label to a suitable format
   * @param label
   * @returns
   */
  convertLabel(label: string): string {
    return label?.includes(' ')
      ? label?.toLowerCase().replace(/\s+/g, '')
      : label?.toLowerCase();
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
    const ids = control?.value || [];

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
