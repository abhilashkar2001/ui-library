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
  @Output() customDocumentForm = new EventEmitter<any>();
  @Output() customSaveDocument = new EventEmitter<any>();
  constructor(private fb: FormBuilder) {}

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
    });
  }
  getFileInfo(indx: any): any[] {
    return this.otherDocument().controls[indx].get("fileInfo")?.value;
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    console.log(this.otherDocument().controls[index].get("fileInfo")?.value);
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
    // this.fileSelected = true;

    inputElement.type = "file";
    inputElement.accept = "image/*";
    inputElement.addEventListener("change", (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        if (file.type.startsWith("image/")) {
          this.selectedImage = file;
          this.displayImage(i);
        }
        const fReader = new FileReader();
        fReader.readAsDataURL(file);
      }
    });
    inputElement.click();
    this.uploadFilesSimulator(0);
  }

  displayImage(indx) {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      console.log(event.target.result);
      this.imageUrl = event.target.result as string;
      console.log(this.imageUrl);
      this.getFileInfo(indx).push({
        url: this.imageUrl,
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
    this.customSaveDocument.emit({ status: true });
  }
}
