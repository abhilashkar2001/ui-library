import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DocumentUploadService } from 'app/shared/services/document-upload.service';
import { GenericValueService } from 'app/shared/services/generic-value.service';

@Component({
  selector: 'app-custom-file-upload',
  templateUrl: './custom-file-upload.component.html',
  styleUrls: ['./custom-file-upload.component.scss'],
})
export class CustomFileUploadComponent implements OnInit, OnChanges {
  createDocumentForm!: FormGroup;
  @Input() isOtherDocVisible = true;
  @Input() checkListDocList: any;
  checklistArr: string[] = [];
  staticData: any = {
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
    if (changes?.checkListDocList?.currentValue) {
      this.checkListDocList = changes.checkListDocList.currentValue;
      this.noReqCheckListDocList =
        changes.checkListDocList.currentValue.nonRequiredDocument;

      console.log(this.noReqCheckListDocList, 'check');

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
      });
  }

  buildForm(data?: any) {
    this.createDocumentForm = this.fb.group({
      otherDocument: this.fb.array([]),
    });

    if (data?.length > 0) {
      data.forEach((item: any) => {
        this.addDocument(item);
      });
    }
    // if (this.isOtherDocVisible) this.addDocument();
  }

  otherDocument(): FormArray {
    return this.createDocumentForm?.get('otherDocument') as FormArray;
  }

  addDocument(data?: any) {
    this.otherDocument().push(this.newDenom(data));
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

  fileBrowseHandler(i: number) {
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
      }
    });

    inputElement.click();
  }

  uploadFilesSimulator(docIndex: number, fileIndex: number) {
    const fileInfoControl = this.otherDocument().at(docIndex).get('fileInfo');
    const files = fileInfoControl?.value;

    if (!files || !files[fileIndex]) return;

    const progressInterval = setInterval(() => {
      if (files[fileIndex].progress === '100%') {
        clearInterval(progressInterval);
        if (fileIndex + 1 < files.length) {
          this.uploadFilesSimulator(docIndex, fileIndex + 1);
        }
      } else {
        const updatedProgress = parseInt(files[fileIndex].progress) + 10;
        files[fileIndex].progress = `${Math.min(updatedProgress, 100)}%`;
        fileInfoControl?.setValue([...files]);
      }
    }, 200);
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
        if (
          data?.documentNameForChecklist?.toLowerCase()?.includes('national') &&
          i == 0
        ) {
          this.frontAadhar = resp.data.fileUrl;
        }
        this.updateDocId(i).push(resp.data.documentId);
        this.fileUrls?.push(resp.data?.fileUrl);
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

        // this.extractDoc(
        //   this.createDocumentForm.value.otherDocument[i].documentType,
        //   parseInt(this.sessionStorageService.getOriginationId()),
        //   file,
        //   resp.data.documentId,
        // );
      }
    });
  }

  updateDocId(indx: any): any[] {
    return this.otherDocument().controls[indx]?.get('docIds')?.value;
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

  displayImage(indx: any, file: any, size: any) {
    const reader = new FileReader();
    const sizeinKb = (size / 1024).toFixed(2);

    reader.onload = (event: ProgressEvent<FileReader> | any) => {
      const imageUrl = event.target.result as string;

      const existing = this.getFileInfo(indx) || [];
      const updatedFiles = [...existing];

      updatedFiles.push({
        url: imageUrl,
        name: file.name,
        progress: '100%',
        size: `${sizeinKb}kb`,
        newFileUrl: '',
        pdfUrl: '',
        imageUrl: '',
      });

      this.otherDocument().at(indx).get('fileInfo')?.setValue(updatedFiles);

      this.cdr.detectChanges();

      setTimeout(() => {
        const refreshed = [...updatedFiles];
        refreshed[refreshed.length - 1].progress = '0%';
        this.otherDocument().at(indx).get('fileInfo')?.setValue(refreshed);
        this.cdr.detectChanges();
      }, 500);
    };

    console.log(this.createDocumentForm, 'formgroup');

    reader.readAsDataURL(file);
  }

  getFileInfo(indx: number) {
    return this.otherDocument()?.controls[indx]?.get('fileInfo')?.value;
  }

  getFileUrl(file: any) {
    if (file.name.endsWith('pdf') || file.name.endsWith('xlsx')) {
      return 'assets/images/file_icon.svg';
    } else return file.url;
  }

  removeFile(docIndex: number, fileIndex: number) {
    const files = this.otherDocument().at(docIndex).get('fileInfo')?.value;
    if (files && files.length > fileIndex) {
      files.splice(fileIndex, 1);
      this.otherDocument()
        .at(docIndex)
        .get('fileInfo')
        ?.setValue([...files]);
    }
  }

  removeDocument(index: number) {
    this.otherDocument().removeAt(index);
  }

  addDocumentFromDropdown(documentType: string) {
    this.checklistArr.push(documentType);
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
}
