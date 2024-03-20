import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";

import { MatSnackBar } from "@angular/material/snack-bar";
import { NewDepositService } from "app/modules/new-deposit/new-deposit.service";
import { SharedService } from "app/shared/shared.service";
import { environment } from "environments/environment";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";
import { CommonService } from "app/shared/services/common-service/common.service";

@Component({
  selector: "app-other-documents",
  templateUrl: "./other-documents.component.html",
  styleUrls: ["./other-documents.component.scss"],
})
export class OtherDocumentsComponent implements OnInit {
  denominationArray: any[] = [];
  createDocumentForm: FormGroup;
  count = 0;
  isEven: boolean = false;
  selectedImage: File;
  parenIndex: number;
  currencyArr: any;
  imageUrl: any;
  kycToggle = "kyc";
  files: any[] = [];
  documentIds = [
    {
      docIds: [],
    },
  ];
  @Output() customDocumentForm = new EventEmitter<any>();
  @Output() customSaveDocument = new EventEmitter<any>();
  @Output() customgoBack = new EventEmitter<any>();
  documentControls: FormGroup;
  staticData = {
    DOCUMENTTYPE: [],
  };
  baseUrl = environment.microServiceURL;
  documentList;
  documentTypeArray: string[] = [];
  hideSelect: string[] = [];
  // SAVE BUTTON PROPERTIES
  isLoading: boolean = false;
  loadingBtnText: string = "Saving...";
  screenName: string = "Select KYC";
  constructor(
    private fb: FormBuilder,
    private api: NewDepositService,
    private snack: MatSnackBar,
    private sharedService: SharedService,
    private openAccountService: OpenAccountService,
    private CommonService: CommonService
  ) {}

  ngAfterViewInit() {}

  ngOnInit() {
    this.getGenericDetails();
    var loanCustomerId = parseInt(sessionStorage.getItem("customerId"));
    if (loanCustomerId) this.getCustomerId(loanCustomerId);
    else this.buildForm();
  }

  getCustomerId(id) {
    this.openAccountService.getCustomerById(id).subscribe((resp) => {
      if (resp.statusCode == 200) {
        this.documentList = resp.data;
        if (this.documentList[0].documnentsInfo?.documents?.length > 0) {
          this.buildForm(this.documentList[0].documnentsInfo?.documents);
        } else {
          this.buildForm();
        }
      }
    });
  }

  getGenericDetails() {
    this.sharedService
      .genericValue(this.screenName, Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.documentTypeArray = resp.data["DOCUMENTTYPE"];
        }
      });
  }

  buildForm(data?) {
    this.createDocumentForm = this.fb.group({
      otherDocument: this.fb.array([]),
    });
    if (data?.length > 0) {
      data.forEach((item, i) => {
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
    return this.createDocumentForm.get("otherDocument") as FormArray;
  }

  showDocument(data, i) {
    this.documentControls = this.fb.group({
      documentNumber: [data ? data[0].documentNumber : "", Validators.required],
      documentType: [data ? data[0].documentName : "", Validators.required],
      fileInfo: new FormControl([]),
      docIds: new FormControl([]),
    });
    this.otherDocument().push(this.documentControls);
    if (data) {
      this.otherDocument()
        .controls[i].get("fileInfo")
        .setValue(this.calculateDoc(data, i));
    }
  }

  calculateDoc(data, i) {
    var docArr = [];
    var docIds = [];
    data.forEach((item, ind) => {
      console.log(item, ind);
      var docItem = {
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
    this.otherDocument().controls[i].get("docIds").setValue(docIds);
    return docArr;
  }

  newDenom(data?): FormGroup {
    return this.fb.group({
      documentNumber: ["", Validators.required],
      documentType: ["", Validators.required],
      fileInfo: new FormControl([]),
      docIds: new FormControl([]),
    });
  }

  getFileInfo(indx: any): any[] {
    return this.otherDocument().controls[indx].get("fileInfo")?.value;
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number, i, doc) {
    let documentId =
      this.createDocumentForm.value.otherDocument[i].docIds[index];
    this.CommonService.deleteDocument(documentId).subscribe((res) => {
      if (res) {
        console.log("Document deleted Successfully..");
        this.createDocumentForm.value.otherDocument[i].docIds.splice(index, 1);
      }
    });
    this.otherDocument().controls[i].get("fileInfo")?.value.splice(index, 1);
  }

  addDocument(data?) {
    this.otherDocument().push(this.newDenom(data));
  }

  mapEndPoints(url) {
    return `${this.baseUrl}${url}`;
  }
  removeCurrency(i: number) {
    this.otherDocument().removeAt(i);
    this.hideSelect.splice(i, 1);
  }

  fileBrowseHandler(event: any, indx: number) {
    this.browseFiles(indx);
  }
  browseFiles(i) {
    const inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.accept = "image/*";
    inputElement.addEventListener("change", (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        console.log(file, "file");
        if (file.type.startsWith("image/")) {
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
  uploadImage(file, i) {
    let formData = new FormData();
    let data = {
      documentName: this.createDocumentForm.value.otherDocument[i].documentType,
      documentType: this.createDocumentForm.value.otherDocument[i].documentType,
      documentNumber:
        this.createDocumentForm.value.otherDocument[i].documentNumber,
      documentSide: 1,
      fileName: file.name,
      fileType: file.type,
      verificationType: "kyc",
    };

    formData.append("data", JSON.stringify(data));
    formData.append("file", file);
    formData.append("module", "document");
    this.api.uploadDocument(formData).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        this.updateDocId(i).push(resp.data.documentId);
        this.documentIds.push(this.createDocumentForm.value);
        this.snack.open(`Document Uploaded Successfully` + " !", "OK", {
          duration: 4000,
          verticalPosition: "top",
          horizontalPosition: "right",
          panelClass: "snackbar-error",
        });
      }
    });
  }
  updateDocId(indx: any): any[] {
    return this.otherDocument().controls[indx].get("docIds")?.value;
  }

  displayImage(indx, file) {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
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

  onSubmit() {
    if (this.createDocumentForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.loadingBtnText = "Saving...";
    this.customSaveDocument.emit({
      isLoading: this.isLoading,
      loadingBtnText: this.loadingBtnText,
      status: true,
      documentDetails: this.createDocumentForm.value,
    });
  }
  goBack() {
    this.customgoBack.emit();
  }

  onDocumentSelection(event, index) {
    if (!this.hideSelect.hasOwnProperty(index)) {
      if (!this.hideSelect.includes(event)) this.hideSelect.push(event);
    } else this.hideSelect[index] = event;
  }

  isDocumentOptionDisabled2(item) {
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

  onFileDropped(event, i) {
    console.log(event);
    if (event.files.type.startsWith("image/")) {
      this.selectedImage = event.files;
      this.displayImage(i, event.files);
      this.uploadImage(event.files, i);
    }
    const fReader = new FileReader();
    fReader.readAsDataURL(event.files);
  }

  /**
   * checking form is valid or not and insuring for opened card  document  is uploaded.
   * @returns true false depending upon above codition.
   */
  checkDocValidity() {
    let isDocUploaded = this.createDocumentForm.value.otherDocument.every(
      (docItem) => docItem.fileInfo?.length > 0
    );
    return this.createDocumentForm.invalid || !isDocUploaded ? true : false;
  }

  /**
   * trackBy function for Document Type dropdown.
   * @param documentTypeItem
   * @returns
   */
  documentTypeTrackByFun(documentTypeItem) {
    return documentTypeItem;
  }
}
