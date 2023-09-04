import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { NewDepositService } from "../../../new-deposit.service";
import { MatSnackBar } from "@angular/material/snack-bar";

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
  constructor(
    private fb: FormBuilder,
    private api: NewDepositService,
    private snack: MatSnackBar
  ) {}

  ngAfterViewInit() {}

  ngOnInit() {
    this.buildForm({});
  }

  buildForm(data?) {
    this.createDocumentForm = this.fb.group({
      otherDocument: this.fb.array([]),
    });
    setTimeout(() => {
      this.addDocument();
      this.customDocumentForm.emit(this.createDocumentForm);
    }, 200);
  }

  otherDocument(): FormArray {
    return this.createDocumentForm.get("otherDocument") as FormArray;
  }

  newDenom(data?): FormGroup {
    return this.fb.group({
      documentType: ["", Validators.required],
      documentNumber: "",
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
  deleteFile(index: number, doc) {
    console.log(doc);
    debugger;
    this.otherDocument()
      .controls[index].get("fileInfo")
      ?.value.splice(index, 1);
  }

  addDocument(data?) {
    this.otherDocument().push(this.newDenom(data));
  }

  removeCurrency(i: number) {
    this.otherDocument().removeAt(i);
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
    this.customSaveDocument.emit({
      status: true,
      documentDetails: this.createDocumentForm.value,
    });
  }
}
