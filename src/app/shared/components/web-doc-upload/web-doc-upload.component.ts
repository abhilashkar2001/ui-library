import {
  Component,
  EventEmitter,
  Input,
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
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { NewDepositService } from "app/modules/new-deposit/new-deposit.service";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { CommonService } from "app/shared/services/common-service/common.service";
import { LoanService } from "app/shared/services/loan/loan.service";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";
import { SharedService } from "app/shared/shared.service";
import { environment } from "environments/environment";

@Component({
  selector: "app-web-doc-upload",
  templateUrl: "./web-doc-upload.component.html",
  styleUrls: ["./web-doc-upload.component.scss"],
})
export class WebDocUploadComponent implements OnInit {
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Output() onConfirmEvent: EventEmitter<any> = new EventEmitter();
  @Output() customDocumentForm = new EventEmitter<any>();
  @Output() customSaveDocument = new EventEmitter<any>();
  @Input() documentTypeArray: any;
  @Input() verificationType: string;
  @Input() documentList: any;
  @Input() genericScreenInfo: any;

  documentControls: FormGroup;
  createDocumentForm: FormGroup;
  documentIds = [
    {
      docIds: [],
    },
  ];
  files: any[] = [];
  uploadedDocResponse: any = [];
  docIds: any[] = [];
  stepperTitle: any;

  staticData = {
    DOCUMENTNAME: [],
  };
  selectedImage: Blob;
  imageUrl: string;
  baseUrl = environment.microServiceURL;
  screenName: string = "Loan Document";
  hideSelect: string[] = [];
  // SAVE BUTTON PROPERTIES
  isLoading: boolean = false;
  loadingBtnText: string = "Saving...";

  constructor(
    private fb: FormBuilder,
    private apiService: OpenAccountService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private loanApi: LoanService,
    private api: NewDepositService,
    private snack: MatSnackBar,
    private commonService: CommonService,
    private loder: AppLoaderService
  ) {
    this.stepperTitle = this.activatedRoute.snapshot["queryParams"]["title"];
    // this.buildDocumentForm();
  }

  ngOnInit(): void {
    var originationId = sessionStorage.getItem("originationId");
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.genericScreenInfo?.currentValue) {
      this.getGenericDetails(changes?.genericScreenInfo?.currentValue);
    }

    if (changes?.documentList?.currentValue) {
      this.buildForm(changes?.documentList?.currentValue);
    } else this.buildForm();

    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
  }

  getGenericDetails(data) {
    this.sharedService
      .genericValue("Common", Object.keys(data.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.documentTypeArray = resp.data["DOCUMENTNAME"];
        }
      });
  }

  buildForm(data?) {
    this.createDocumentForm = this.fb.group({
      otherDocument: this.fb.array([]),
    });
    if (data?.length > 0) {
      data.forEach((item, i) => {
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
    return this.createDocumentForm.get("otherDocument") as FormArray;
  }

  showDocument(data, i) {
    this.documentControls = this.fb.group({
      documentNumber: [data ? data.documentNumber : "", Validators.required],
      documentType: [
        data ? parseInt(data.documentType) : "",
        Validators.required,
      ],
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
    // data.forEach((item, ind) => {
    // console.log(item, ind);
    var docItem = {
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
    this.commonService.deleteDocument(documentId).subscribe((res) => {
      if (res) {
        console.log("Document deleted Successfully..");
        this.createDocumentForm.value.otherDocument[i].docIds.splice(index, 1);
      }
    });
    this.otherDocument().controls[i].get("fileInfo")?.value.splice(index, 1);
  }

  deleteDocument(i: number) {
    this.otherDocument().removeAt(i);
    this.hideSelect.splice(i, 1);
  }

  addDocument(data?) {
    this.otherDocument().push(this.newDenom(data));
  }

  mapEndPoints(url) {
    return `${this.baseUrl}${url}`;
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

  getDocTypeforScan(docname) {
    let docType;
    if (docname == "aadhar card") {
      docType = "adhaar";
    }
    if (docname == "pan card") {
      docType = "pan";
    }
    if (docname == "passport") {
      docType = docname;
    }
    return docType;
  }

  async readDocument(file, i) {
    const formdata = new FormData();
    formdata.append("image", file);
    formdata.append("lang", "eng");
    formdata.append(
      "imageType",
      this.getDocTypeforScan(this.hideSelect[0].toLowerCase())
    );
    try {
      const res: any = await this.sharedService
        .readAadharData(formdata)
        .toPromise();
      if (res?.statusCode == 200) {
        if (
          Object.keys(res?.data).filter(
            (value) =>
              res?.data[value] != "Detail not found" && res?.data[value] != null
          )?.length < 1
        ) {
          this.deleteFile(i, i, file);
          this.loder.close();
          this.snack.open(`Uploaded Document is not valid` + " !", "OK", {
            duration: 4000,
            verticalPosition: "top",
            horizontalPosition: "right",
            panelClass: "snackbar-error",
          });
          return -1;
        } else {
          this.loder.close();
          this.snack.open(`Document Uploaded Successfully` + " !", "OK", {
            duration: 4000,
            verticalPosition: "top",
            horizontalPosition: "right",
            panelClass: "snackbar-error",
          });
        }
      }
    } catch (error) {
      this.loder.close();
      this.deleteFile(i, i, file);
      throw error;
    }
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
    this.loder.open();
    this.api.uploadDocument(formData).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        this.updateDocId(i).push(resp.data.documentId);
        this.documentIds.push(this.createDocumentForm.value);
        this.readDocument(file, i);
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

  onSubmit() {
    console.log(this.createDocumentForm.value);
    // let payload = {
    //   customerId: this.custId,
    //   documentInfo: this.createDocumentForm
    //     .get("otherDocument")
    //     ?.value.map((document: any) => {
    //       return {
    //         docIds: document.fileInfo.map((item: any) => item?.id),
    //       };
    //     }),
    // };
    if (this.createDocumentForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.loadingBtnText = "Saving...";
    this.onConfirmEvent.emit({
      documentDetails: this.createDocumentForm.value,
    });
  }

  onBack() {
    this.onBackEvent.emit();
  }

  /**
   * checking form is valid or not and insuring for opened card  document  is uploaded.
   * @returns true false depending upon above codition.
   */
  checkDocValidity() {
    if (this.createDocumentForm) {
      let isDocUploaded = this.createDocumentForm.value.otherDocument.every(
        (docItem) => docItem.fileInfo?.length > 0
      );
      return this.createDocumentForm.invalid || !isDocUploaded ? true : false;
    }
  }

  onDocumentSelection(event, index) {
    if (!this.hideSelect.hasOwnProperty(index)) {
      if (!this.hideSelect.includes(event)) this.hideSelect.push(event);
    } else this.hideSelect[index] = event;

    console.log(this.hideSelect, "this.hideSelect");
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
}
