import { HttpEventType, HttpResponse } from "@angular/common/http";
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Subscription } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { environment } from "environments/environment";
import { UploadImage } from "../origination-external-callback.store";
import { SharedService } from "app/shared/shared.service";
import { OfferIssueService } from "app/shared/services/offer-issue.service";
import { Router } from "@angular/router";
import { CustomerServiceService } from "app/shared/services/customer-service.service";
const MICROSERVICE_URL = environment.microServiceURL;
@Component({
  selector: "app-document-upload",
  templateUrl: "./document-upload.component.html",
  styleUrls: ["./document-upload.component.scss"],
})
export class DocumentUploadComponent implements OnInit {
  documentUploadForm: FormGroup;
  documentNames: any[] = [];
  genericvalue = "DOCUMENTNAME";
  currentIndex = 0;
  percentDone: number;
  uploadSuccess: boolean;
  isUploading: boolean = false;
  uploadingFile: string;
  requestSubscription: Subscription;
  selectedIndex: number;
  noImage = "assets/images/document/upload-icon.svg";
  ACTION_NAME = UploadImage.BROWSE;

  @ViewChild("fileInput") fileInput: ElementRef;
  customerDetails: any;
  originationId: any;
  customerId: any;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private apiService: SharedService,
    private offerIssueService: OfferIssueService,
    private route: Router,
    private customerService: CustomerServiceService
  ) {}

  ngOnInit(): void {
    this.originationId = JSON.parse(sessionStorage.getItem("originationId"));
    this.customerId = sessionStorage.getItem("customerId");
    this.getDocumentName();
    this.buildDocumentUploadForm();
    this.initialFormLoading();
    if (this.originationId) this.fetchOriginationDetails();
    if (this.customerId) this.getCustomerData();
  }

  initialFormLoading() {
    this.documents().push(this.createDocumentItem(""));
    for (var i = 0; i < 2; i++) {
      this.documentPages(0).push(this.addNewPage(i, ""));
    }
  }

  getDocumentName() {
    this.apiService
      .genericValue("Common", [this.genericvalue])
      .subscribe((res) => {
        if (res?.statusCode == 200 || res?.statusCode == 201) {
          this.documentNames = res?.data?.DOCUMENTNAME;
        }
      });
  }

  change(e, documentIndex: number) {
    const documentNameControl = this.getDocumentFormControl(
      "documentName",
      documentIndex
    );
    const documentNumberControl = this.getDocumentFormControl(
      "documentNumber",
      documentIndex
    );

    documentNameControl.valueChanges.subscribe(() => {
      documentNumberControl.markAsUntouched();
    });

    this.clearDocumentValues(documentIndex);
    let docPresent = 0;
    this.documents().value.map((val) => {
      if (e?.value == val.documentName) {
        docPresent++;
      }
    });
    if (docPresent > 1) {
      documentNameControl.setValue("");
      documentNameControl.setErrors({ doumentAlreadyExist: true });
      this.cdr.markForCheck();
    }
    if (e?.value) {
      const index = this.documentNames.findIndex(
        (item: any) => item.name === e?.value
      );
      if (this.documentNames[index]) this.documentNames[index].selected = true;
    }
  }

  getDocumentFormControl(
    controlName: string,
    documentIndex: number
  ): FormControl {
    return this.documents().at(documentIndex).get(controlName) as FormControl;
  }

  clearDocumentValues(documentIndex: number): void {
    const documentControl = this.documents().at(documentIndex);
    documentControl.get("documentNumber").setValue("");
    documentControl.get("verifiedMobileNumber").setValue("");

    this.documentPages(documentIndex).controls.forEach((control) => {
      this.fileInput.nativeElement.value = "";
      control.get("fileUrl").patchValue("");
    });
  }

  buildDocumentUploadForm() {
    this.documentUploadForm = this.fb.group({
      documents: this.fb.array([]),
    });
  }

  documents(): FormArray {
    return this.documentUploadForm.get("documents") as FormArray;
  }

  createDocumentItem(data?) {
    return this.fb.group({
      documentName: [
        data?.documentName ? data?.documentName : "",
        Validators.required,
      ],
      documentNumber: [
        data?.documentNumber ? data?.documentNumber : "",
        Validators.required,
      ],
      verifiedMobileNumber: [data?.phoneNumber ?? ""],
      pages: this.fb.array([]),
    });
  }

  addDocumentItem() {
    this.documents().push(this.createDocumentItem());
    this.currentIndex++;
    for (var i = 0; i < 2; i++) {
      this.documentPages(this.currentIndex).push(this.addNewPage(i, ""));
    }
  }

  removeDocumentItem(index: number) {
    this.documents().removeAt(index);
    this.currentIndex--;
  }

  documentPages(index: number): FormArray {
    return this.documents().at(index).get("pages") as FormArray;
  }

  addNewPage(side: number, data?): FormGroup {
    return this.fb.group({
      id: [data?.documentId ? data?.documentId : "", Validators.required],
      fileUrl: [
        data?.fileUrl ? `${MICROSERVICE_URL}${data?.fileUrl}` : "",
        Validators.required,
      ],
      documentSide: [side, Validators.required],
      fileNameValue: [""],
      documentTitle: [this.getPageName(side), Validators.required],
      scan: [false],
      isUploaded: [false],
    });
  }

  getPageName(side: number) {
    switch (side) {
      case 0:
        return "Front Side";
      case 1:
        return "Back Side";
      default:
        return "Other";
    }
  }

  addDocumentPage(docIndex: number) {
    let pagesLength = this.documents().at(docIndex).get("pages") as FormArray;
    console.log(pagesLength);
    let count = pagesLength.length;

    this.documentPages(docIndex).push(this.addNewPage(count++));
  }

  removeDocumentPage(index: number, pageIndex: number) {
    this.documentPages(index).removeAt(pageIndex);
  }

  checkForm() {
    return this.documentUploadForm.valid;
  }
  //Enter issue
  checking(event: KeyboardEvent) {
    event.preventDefault();
  }

  onFileSelect(e: any, documentIndex: number, index: number) {
    const file = e.target.files[0];
    if (
      !this.documents().at(documentIndex)?.get("documentName")?.value &&
      !this.documents().at(documentIndex)?.get("documentNumber")?.value
    ) {
      this.fileInput.nativeElement.value = "";
      this.documents()
        .at(documentIndex)
        ?.get("documentNumber")
        ?.markAsTouched();
      this.documents().at(documentIndex)?.get("documentName")?.markAsTouched();

      return;
    }
    this.documentPages(documentIndex)
      ?.at(index)
      .get("fileNameValue")
      .patchValue(e.target.files[0].name);
    if (e.target.files[0]) {
      let count = 0;
      setTimeout(() => {
        this.documentPages(documentIndex).controls.forEach(
          (docControle: FormGroup) => {
            if (
              docControle.get("fileNameValue").value == e.target.files[0].name
            ) {
              count++;
            }
          }
        );

        if (count > 1) {
          this.removeImage(documentIndex, index);
          this.snack.open("File Already Uploaded", "Ok", {
            duration: 3000,
            verticalPosition: "top",
            horizontalPosition: "right",
          });
          return;
        } else {
          this.selectedIndex = index;
          try {
            const file = e.target.files[0];
            const fReader = new FileReader();
            fReader.readAsDataURL(file);
            fReader.onloadend = (_event: any) => {
              let base64File = _event.target.result;
              this.uploadDocument(file, documentIndex, index, base64File);
            };
          } catch (error) {}
        }
      }, 100);
    }
  }

  otherUpload(e: any, documentIndex: number) {
    if (
      !this.documents().at(documentIndex)?.get("documentName")?.value &&
      !this.documents().at(documentIndex)?.get("documentNumber")?.value
    ) {
      this.fileInput.nativeElement.value = "";
      this.documents()
        .at(documentIndex)
        ?.get("documentNumber")
        ?.markAsTouched();
      this.documents().at(documentIndex)?.get("documentName")?.markAsTouched();

      return;
    }
    if (e.target.files[0]) {
      let otherCount = 0;
      let IndexSelected;
      setTimeout(() => {
        this.documentPages(documentIndex).controls.forEach(
          (docControle: FormGroup, index) => {
            if (
              docControle.get("fileNameValue").value == e.target.files[0].name
            ) {
              otherCount++;
              if (otherCount > 0) {
                IndexSelected = index;
              }
            }
          }
        );
        if (otherCount > 1) {
          this.snack.open("File Already Uploaded", "Ok", {
            duration: 3000,
            verticalPosition: "top",
            horizontalPosition: "right",
          });
          return;
        } else {
          let pagesLength = this.documents()
            .at(documentIndex)
            .get("pages") as FormArray;
          let count = pagesLength.length;
          this.selectedIndex = count;
          try {
            const fileOther = e.target.files[0];
            const fReader = new FileReader();
            fReader.readAsDataURL(fileOther);
            fReader.onloadend = (_event: any) => {
              let base64FileOther = _event.target.result;
              this.addDocumentPage(documentIndex);
              this.uploadDocument(
                fileOther,
                documentIndex,
                count,
                base64FileOther
              );
              this.documentPages(documentIndex)
                .at(count - 1)
                .get("fileNameValue")
                .patchValue(e.target.files[0].name);
            };
          } catch (error) {}
        }
      }, 100);
    }
  }

  removeImage(docindex, index) {
    let i = index;
    this.fileInput.nativeElement.value = "";
    this.documentPages(docindex).at(i).get("fileUrl").patchValue("");
  }

  uploadDocument(file, documentIndex, index, base64File) {
    this.uploadingFile = file.name;
    this.isUploading = true;

    let documentName = this.documents()
      .at(documentIndex)
      .get("documentName").value;
    let formData = new FormData();
    let data = {
      documentName: documentName,
      documentType: this.getDocType(documentName),
      documentNumber: this.documents().at(documentIndex).get("documentNumber")
        .value,
      documentSide:
        this.documentPages(documentIndex).at(index).get("documentSide").value +
        1,
      fileName: file.name,
      fileType: file.type,
      verificationType: "kyc Varifiction",
    };
    formData.append("data", JSON.stringify(data));
    formData.append("file", file);
    formData.append("module", "document");
    this.apiService.uploadDocument(formData).subscribe((event: any) => {
      if (event.type === HttpEventType.UploadProgress) {
        this.percentDone = Math.round((100 * event.loaded) / event.total);
      } else if (event instanceof HttpResponse) {
        let responseBody: any = event;
        this.uploadSuccess = true;
        this.percentDone = 0;
        this.isUploading = false;
        console.log("event", responseBody);

        this.documentPages(documentIndex)
          .at(index)
          .get("id")
          .patchValue(responseBody?.body?.data?.documentId);

        console.log(this.documents());
        this.documentPages(documentIndex)
          .at(index)
          .get("fileUrl")
          .patchValue(base64File);
        this.cdr.markForCheck();
      }
    }),
      (error) => {};
  }

  // otherimgscan(docIndex, index?) {
  //   if (
  //     !this.documents().at(docIndex)?.get("documentName")?.value &&
  //     !this.documents().at(docIndex)?.get("documentNumber")?.value
  //   ) {
  //     this.fileInput.nativeElement.value = "";
  //     this.documents().at(docIndex)?.get("documentNumber")?.markAsTouched();
  //     this.documents().at(docIndex)?.get("documentName")?.markAsTouched();
  //     return;
  //   }
  //   const dialogRef = this.dialog.open(WebcamCaptureComponent, {
  //     width: "80%",
  //     data: {},
  //     disableClose: true,
  //     panelClass: "popup-class",
  //   });
  //   dialogRef.afterClosed().subscribe((scan) => {
  //     if (scan.image) {
  //       const docdatta = new DocumentData();
  //       docdatta.documentName = this.documents()
  //         .at(docIndex)
  //         ?.get("documentName")?.value;
  //       docdatta.documentType = this.getDocType(
  //         this.documents().at(docIndex)?.get("documentName")?.value
  //       );
  //       docdatta.documentSide = this.documentPages(docIndex)
  //         ?.at(index)
  //         ?.get("documentSide")?.value;
  //       this.selectedIndex = index;
  //       let scanName = "";
  //       if (docdatta.documentSide == 0) {
  //         scanName = docdatta.documentName?.split(" ")[0] + "Front";
  //       } else if (docdatta.documentSide == 1) {
  //         scanName = docdatta.documentName?.split(" ")[0] + "Back";
  //       } else {
  //         scanName = docdatta.documentName?.split(" ")[0] + "Other";
  //       }
  //       const scanimg = scan.image.split(",")[1];
  //       const scanBlob = this.dataURItoBlob(scanimg);
  //       const scanFile = new File([scanBlob], scanName, {
  //         type: "image/png",
  //       });
  //       docdatta.fileName = scanName;
  //       docdatta.fileType = scanFile.type.split("/")[1];
  //       docdatta.verificationType = "onboarding";
  //       this.documentPages(docIndex)
  //         ?.at(index)
  //         ?.get("fileUrl")
  //         ?.patchValue(scan.image);
  //       const scanurl = new FormData();
  //       scanurl.append("file", scanFile);
  //       scanurl.append("data", JSON.stringify(docdatta));
  //       scanurl.append("module", "document");
  //       this.loader.open();
  //       this.apiService.uploadDocument(scanurl).subscribe(
  //         (resp: any) => {
  //           console.log(resp);
  //           this.loader.close();
  //           if (resp.type === HttpEventType.UploadProgress) {
  //             this.percentDone = Math.round((100 * resp.loaded) / resp.total);
  //           } else if (resp instanceof HttpResponse) {
  //             let responseBody: any = resp;
  //             this.uploadSuccess = true;
  //             this.percentDone = 0;
  //             this.isUploading = false;
  //             console.log("event", responseBody);

  //             this.documentPages(docIndex)
  //               .at(index)
  //               .get("id")
  //               .patchValue(responseBody?.body?.data?.documentId);

  //             this.cdr.markForCheck();
  //           }
  //         },
  //         (error) => {
  //           this.loader.close();
  //         }
  //       );
  //       this.loader.close();
  //     }
  //   });
  // }

  getDocType(docName: string) {
    let docType;
    if (docName === "Aadhar Card" || docName === "Aadhar card") {
      docType = "Aadhar card";
    } else if (docName === "Pan Card" || docName === "Pan card") {
      docType = "Pan card";
    } else if (docName === "Passport") {
      docType = "Passport";
    }
    return docType;
  }

  fetchOriginationDetails() {
    this.offerIssueService
      .fetchOriginationDetails(this.originationId)
      .subscribe((res) => {
        if (res?.statusCode === 200 && res?.data) {
          this.customerDetails = res?.data[0];
        }
      });
  }

  getCustomerData() {
    this.customerService.fetchCustomerData(this.customerId).subscribe((res) => {
      if (res?.statusCode == 200 || res?.statusCode == 201) {
      } else {
        this.snack.open("No customer id found to upload document", "ok", {
          horizontalPosition: "right",
          verticalPosition: "top",
          duration: 2000,
        });
        setTimeout(() => {
          window.close();
        }, 4000);
      }
    });
  }
  saveDocument() {
    const documentId = this.documentUploadForm.value.documents.map((item) => ({
      docIds: item?.pages?.map((page) => page?.id)?.filter((page) => page),
    }));

    const payload: any = {};
    payload.customerId = this.originationId
      ? this.customerDetails?.customerInfo[0]?.customerId
      : this.customerId;
    payload.documentInfo = documentId;
    this.offerIssueService.saveCustomeDocuments(payload).subscribe((res) => {
      if (res?.statusCodeValue === 200 && res?.body?.data) {
        this.snack.open("Customer Document Saved", "Ok", {
          horizontalPosition: "right",
          verticalPosition: "top",
          duration: 2000,
        });
        setTimeout(() => {
          window.close();
          sessionStorage.removeItem("mobile");
          sessionStorage.removeItem("customerId");
        }, 5000);
      }
    });
  }
}
