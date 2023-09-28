import { Location } from "@angular/common";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";
import { SharedService } from "app/shared/shared.service";

@Component({
  selector: "app-loan-document-upload",
  templateUrl: "./loan-document-upload.component.html",
  styleUrls: ["./loan-document-upload.component.scss"],
})
export class LoanDocumentUploadComponent implements OnInit {
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Output() onConfirmEvent: EventEmitter<any> = new EventEmitter();
  createDocumentForm: FormGroup;
  documentControls: FormGroup;
  files: any[] = [];
  custId: any;
  uploadedDocResponse: any = [];
  docIds: any[] = [];
  stepperTitle: any;
  documentTypeArray: any;
  staticData = {
    OTHERDOCUMENT: [],
  };
  selectedImage: Blob;
  imageUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: OpenAccountService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService
  ) {
    this.stepperTitle = this.activatedRoute.snapshot["queryParams"]["title"];
  }

  ngOnInit(): void {
    this.getGenericDetails();
    this.buildDocumentForm();
    console.log("other document", this.otherDocumentArray);
    this.custId = localStorage.getItem("customerId");
    this.custId = JSON.parse(this.custId);
    console.log(this.custId);

    // this.customerData = JSON.parse(custId)
    // Initialize any other logic you need when the component is initialized
  }

  getGenericDetails() {
    this.sharedService
      .genericValue("website", Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.documentTypeArray = resp.data["OTHERDOCUMENT"];
        }
      });
  }

  buildDocumentForm() {
    this.createDocumentForm = this.formBuilder.group({
      otherDocument: this.formBuilder.array([]),
    });
    this.pushDocumentControls();
  }

  get otherDocumentArray() {
    return this.createDocumentForm.get("otherDocument") as FormArray;
  }

  pushDocumentControls() {
    this.documentControls = this.formBuilder.group({
      documentNumber: ["", Validators.required],
      documentType: ["", Validators.required],
      fileInfo: new FormControl([]),
    });
    this.otherDocumentArray.push(this.documentControls);
  }

  getFileInfo(indx: number): any[] {
    return this.otherDocumentArray.controls[indx].get("fileInfo")?.value;
  }

  createNewDocument() {
    this.otherDocumentArray.push(
      this.formBuilder.group({
        documentNumber: ["", Validators.required],
        documentType: ["", Validators.required],
        fileInfo: new FormControl([]),
      })
    );
  }

  /**
   * handle file from drag and drop
   */
  onFileDropped(event: any, indx: number) {
    this.prepareFilesList(event.target.files, indx);
  }

  /**
   * handle file from browsing
   */
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
        if (file.type.startsWith("image/")) {
          this.selectedImage = file;
          this.displayImage(i, file);
        }
        const fReader = new FileReader();
        fReader.readAsDataURL(file);
      }
    });

    inputElement.click();
    this.uploadFilesSimulator(0);
  }

  displayImage(indx, file) {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      this.imageUrl = event.target.result as string;
      console.log(this.imageUrl);
      this.getFileInfo(indx).push({
        url: this.imageUrl,
        name: file.name,
      });
    };
    reader.readAsDataURL(this.selectedImage);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number, i, doc) {
    console.log(this.createDocumentForm.get("otherDocument"));
    this.otherDocumentArray.controls[0].get("fileInfo")?.value.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
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

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  async prepareFilesList(files: Array<any>, indx: number) {
    for (const item of files) {
      const docId = await this.uploadDocument(
        item,
        indx,
        this.createDocumentForm.get("otherDocument")?.value[indx]
      );
      item.progress = 0;
      this.files.push({ doc: item, url: this.fileUrl(item) });
      this.getFileInfo(indx).push({
        docId,
        doc: item,
        url: this.fileUrl(item),
      });
    }
    this.uploadFilesSimulator(0);
  }

  fileUrl(file: any) {
    return URL.createObjectURL(file);
  }

  uploadDocument(
    file: any,
    indx: number,
    formValue: any
  ): Promise<string | null> {
    return new Promise<string | null>((resolve, reject) => {
      let formData = new FormData();
      let data = {
        documentName: file?.name,
        documentType: formValue?.documentType,
        documentNumber: formValue?.documentNumber,
        documentSide: indx + 1,
        fileName: file.name,
        fileType: file.type,
        verificationType: "Other Document",
        fileUrl: "",
      };
      formData.append("data", JSON.stringify(data));
      formData.append("file", file);
      formData.append("module", "document");
      this.apiService.uploadDocument(formData).subscribe(
        (resp: any) => {
          console.log("upload doc resp---- ", resp);
          this.uploadedDocResponse = [
            ...this.uploadedDocResponse,
            resp?.data?.documentId,
          ];

          console.log(this.uploadedDocResponse);

          resolve(resp?.data?.documentId);
        },
        (err: any) => {
          console.error("Error: ", err);
          reject(null);
        }
      );
    });
  }

  deleteForm(indx: number) {
    indx > 0 && this.otherDocumentArray.removeAt(indx);
  }

  onSubmit() {
    let payload = {
      customerId: this.custId,
      documentInfo: this.createDocumentForm
        .get("otherDocument")
        ?.value.map((document: any) => ({
          docIds: document.fileInfo.map((item: any) => item?.docId),
        })),
    };
    this.onConfirmEvent.emit();
    // this.onSubmitEvent.emit(payload)
  }

  onBack() {
    this.onBackEvent.emit();
  }
}
