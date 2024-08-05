import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
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
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { NewDepositService } from "app/modules/new-deposit/new-deposit.service";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { CommonService } from "app/shared/services/common-service/common.service";
import { LoanService } from "app/shared/services/loan/loan.service";
import { SharedService } from "app/shared/shared.service";
import { environment } from "environments/environment";
import { WarningComponent } from "../warning/warning.component";
import { CustomWebDocUploadServiceService } from "./custom-web-doc-upload-service.service";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";
import { debounceTime } from "rxjs/operators";
import { Subscription } from "rxjs";
import { DataService } from "app/shared/services/table-service/data.service";

enum CreateLoanEnum {
  INTERNAL = "internal",
  EXTERNAL = "external",
  ACCOUNT_INCLUDES_KEY = "new acc",
  ACCOUNT_EXISTING_KEY = "existing acc",
}
@Component({
  selector: "app-cusotm-web-doc-upload",
  templateUrl: "./cusotm-web-doc-upload.component.html",
  styleUrls: ["./cusotm-web-doc-upload.component.scss"],
})
export class CusotmWebDocUploadComponent implements OnInit, OnDestroy {
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Output() onCustomSubmit: EventEmitter<any> = new EventEmitter();
  @Output() customDocumentForm = new EventEmitter<any>();
  @Output() customSaveDocument = new EventEmitter<any>();
  @Input() documentTypeArray: any;
  @Input() verificationType: string;
  @Input() documentList: any = [];
  @Input() genericScreenInfo: any;
  @Input() ocrProcess: boolean;
  @Input() checkListDocList: any;
  @Input() isOtherDocVisible: boolean = true;
  @Input() docAppliName: any;
  @Input() individual: boolean = true;
  loanEnum = CreateLoanEnum;

  documentControls: FormGroup;
  createDocumentForm: FormGroup;
  loanDisbursementForm: FormGroup;
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
    DISBURSEMENTTYPE: [],
  };
  selectedImage: Blob;
  imageUrl: string;
  baseUrl = environment.microServiceURL;
  screenName: string = "Loan Document";
  hideSelect: string[] = ["aadhar card"];
  // SAVE BUTTON PROPERTIES
  isLoading: boolean = false;
  loadingBtnText: string = "Saving...";
  ocrCheck: boolean = true;
  nationalIdGeneric: any;

  @Input() isShowDisbursement = false;
  disbursementType: any;
  disbursementTypeArray: any[] = [{}];
  loanCustomerId: string;
  accountList: any;
  accountTypeArr = [
    {
      name: "Internal Account",
      value: "internal",
    },
    {
      name: "External Account",
      value: "external",
    },
  ];
  defaultDisbursement: any;
  ocrPass: boolean = false;
  nationalIdNo: any;
  documentInfo: any;
  addNewButtonClicked: Subscription;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private api: NewDepositService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private docapi: CustomWebDocUploadServiceService,
    private loanApi: LoanService,
    private openApi: OpenAccountService,
    private dataService: DataService
  ) {
    this.stepperTitle = this.activatedRoute.snapshot["queryParams"]["title"];
    // this.buildDocumentForm();
    this.matIconRegistry.addSvgIcon(
      "cancel-icon",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/cancel_icon.svg"
      )
    );
  }

  ngOnInit(): void {
    if (this.isShowDisbursement) this.buildLoanDisbursementForm();
    this.loanCustomerId = sessionStorage.getItem("customerId");
    if (!this.ocrProcess) this.ocrCheck = this.ocrProcess;
    this.addNewUploadField();
  }

  ngOnDestroy() {
    this.addNewButtonClicked.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes?.documentList);
    if (changes?.checkListDocList?.currentValue) {
      this.checkListDocList = changes.checkListDocList.currentValue;
      this.buildForm(this.checkListDocList?.requiredDocument ?? []);
    }
    if (changes.documentList?.currentValue?.length > 0) {
      this.documentList = changes.documentList.currentValue;
      this.createDocumentForm.value.otherDocument.forEach((item, i) => {
        this.otherDocument()
          .controls[i].get("fileInfo")
          .setValue(this.calculateDoc(this.documentList[i].docs, i));
      });
    }

    this.getGenericDetails();
  }

  buildLoanDisbursementForm(data?) {
    this.loanDisbursementForm = this.fb.group({
      disbursementType: [
        data ? data?.disbursementType : "",
        Validators.required,
      ],
      accountNumber: [data ? data?.accountNumber : ""],
      id: data?.id,
      bankCode: [data ? data?.bankCode : ""],
      accountType: CreateLoanEnum.INTERNAL,
      ifscCode: [data ? data?.ifscCode : ""],
      branchCode: [data ? data?.branchCode : ""],
      confirmAccountNumber: "",
      disbursementTypeValue: "",
    });
    this.loanDisbursementForm
      .get("accountNumber")
      .valueChanges.pipe(debounceTime(500))
      .subscribe(() => {});
  }

  /**
   *
   * @param event is disbursement change value
   */
  onDisbursementSelectionChanged(event) {
    this.disbursementType = this.staticData["DISBURSEMENTTYPE"]
      .filter((item) => item?.id == event)[0]
      .values.toLowerCase();
    console.log(this.disbursementType, " this.disbursementType ");
    this.loanDisbursementForm
      .get("disbursementTypeValue")
      .setValue(" this.disbursementType");
    if (
      this.disbursementType.includes(CreateLoanEnum.ACCOUNT_INCLUDES_KEY) &&
      this.loanDisbursementForm.value.accountType === CreateLoanEnum.INTERNAL
    ) {
      this.loanDisbursementForm.controls["accountNumber"].setValidators([
        Validators.required,
      ]);
    } else {
      this.loanDisbursementForm.controls["accountNumber"].clearValidators();
    }

    this.loanDisbursementForm.controls[
      "accountNumber"
    ].updateValueAndValidity();
  }

  /**
   * account number validation.
   */
  onChange() {
    if (
      this.loanDisbursementForm.value.accountNumber &&
      this.loanDisbursementForm.value.accountType === this.loanEnum.INTERNAL
    ) {
      this.validateAccountNumber(this.loanDisbursementForm.value.accountNumber);
    } else this.loanDisbursementForm.get("accountNumber").setErrors(null);
  }
  /**
   * api call for account number validation, if account Number not present then invalidAccount error will throw in html.
   */

  validateAccountNumber(resp) {
    this.loanApi.checkAccountNumberAvilable(resp).subscribe((data) => {
      if (!data) {
        this.loanDisbursementForm
          .get("accountNumber")
          .setErrors({ invalidAccount: true });
      } else {
        this.loanDisbursementForm.get("accountNumber").setErrors(null);
      }
    });
  }

  getCustomerById() {
    this.openApi
      .getCustomerById(parseInt(this.loanCustomerId))
      .subscribe((resp) => {
        if (resp?.statusCode == 200) {
          if (resp?.data[0]?.customerNo) {
            this.getAccountList(resp?.data[0]?.customerNo);
          }
        }
      });
  }

  getAccountList(customerNo) {
    this.loanApi.getAccountList(customerNo).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        this.accountList = resp.data.accountInfo;
      }
    });
  }

  getGenericDetails() {
    this.sharedService
      .genericValue("Common", Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.staticData = { ...resp.data };
          this.documentTypeArray = resp.data["DOCUMENTNAME"];
          this.disbursementTypeArray = resp.data["DISBURSEMENTTYPE"];
          this.nationalIdGeneric = this.documentTypeArray.filter((item) =>
            item.values.toLowerCase().includes("aadhar")
          )[0].id;
          this.defaultDisbursement = this.disbursementTypeArray?.find(
            (res) => res?.values == "Cash"
          )?.id;
          this.loanDisbursementForm
            ?.get("disbursementType")
            ?.setValue(this.defaultDisbursement);
        }
      });
  }

  buildForm(data?) {
    this.createDocumentForm = this.fb.group({
      otherDocument: this.fb.array([]),
    });

    // else {
    if (data?.length > 0) {
      console.log(data, "data checking");

      data.forEach((item, i) => {
        this.hideSelect.push(item?.documentType);
        this.addDocument(item);
        this.customDocumentForm.emit(this.createDocumentForm);
        console.log(this.createDocumentForm.value, "data");
      });
    }
    if (this.isOtherDocVisible) this.addDocument();
  }

  otherDocument(): FormArray {
    return this.createDocumentForm?.get("otherDocument") as FormArray;
  }

  showDocument(data, i) {
    console.log(data);
    this.documentControls = this.fb.group({
      documentNumber: [data ? data.documentNumber : ""],
      documentType: [data ? data.document : ""],
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

  addNewUploadField() {
    this.addNewButtonClicked = this.loanApi
      .getNewUploadClicked()
      .subscribe(() => {
        const documentControls = this.fb.group({
          documentNumber: [""],
          documentType: [""],
          fileInfo: new FormControl([]),
          docIds: new FormControl([]),
        });
        this.otherDocument().push(documentControls);
      });
  }

  calculateDoc(data, i) {
    console.log(data);

    var docArr = [];
    var docIds = [];
    var docItem = {
      progress: 100,
      name: data.fileName,
    };
    data.forEach((item) => {
      docArr.push({
        docId: item.documentId,
        doc: docItem,
        url: this.mapEndPoints(item.fileUrl),
        name: item.fileName,
      });
      docIds.push(item.documentId);
    });
    this.otherDocument().controls[i].get("docIds").setValue(docIds);
    return docArr;
  }

  getFileUrl(file) {
    if (file.name.endsWith("pdf") || file.name.endsWith("xlsx")) {
      return "assets/images/file_icon.svg";
    } else return file.url;
  }

  newDenom(data?): FormGroup {
    return this.fb.group({
      documentNumber: [""],
      documentType: [data ? data.document : ""],
      fileInfo: new FormControl([]),
      docIds: new FormControl([]),
      docRequired: data?.docRequired ?? false,
    });
  }

  getFileInfo(indx: any): any[] {
    return this.otherDocument().controls[indx].get("fileInfo")?.value;
  }

  /**
   * NOTE:- Once delete api will get then only this methods api will call.
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number, i, doc) {
    this.createDocumentForm.value.otherDocument[i].docIds.splice(index, 1);
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
    console.log(url);
    return `${this.baseUrl}${url}`;
  }
  fileBrowseHandler(indx: number) {
    this.browseFiles(indx);
  }

  browseFiles(i) {
    const inputElement = document.createElement("input");
    inputElement.type = "file";
    if (!this.isOtherDocVisible) inputElement.accept = "image/*";
    inputElement.addEventListener("change", (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        this.selectedImage = file;
        this.displayImage(i, file, file.size);
        this.uploadImage(file, i);
        // }
        const fReader = new FileReader();
        fReader.readAsDataURL(file);
      }
    });

    inputElement.click();
    this.uploadFilesSimulator(0);
  }

  getDocTypeforScan(docname, index) {
    let docType;
    if (docname == "aadhar card" && index == 0) {
      docType = "adhaar";
    }
    if (docname == "aadhar card" && index == 1) docType = "adhaar_back";
    if (docname == "pan card") {
      docType = "pan";
    }
    if (docname == "passport" && index == 0) {
      docType = docname;
    }
    if (docname == "passport" && index == 1) {
      docType = "passport_back";
    }
    return docType;
  }

  async readDocument(file, i) {
    this.ocrPass = false;
    const formdata = new FormData();
    const backFormdata = new FormData();
    formdata.append("file", file);
    formdata.append("image", file);
    formdata.append("lang", "eng");
    formdata.append(
      "imageType",
      this.getDocTypeforScan(this.hideSelect[0].toLowerCase(), i)
    );
    backFormdata.append("file", file);
    try {
      let service =
        formdata.get("imageType") === "adhaar_back"
          ? this.sharedService.readAadhaarBackData(backFormdata)
          : this.sharedService.readAadharFrontData(formdata);

      const res: any = await service.toPromise();
      if (res?.statusCode == 200) {
        const convertedResp = {};
        for (let item of res?.data?.data) {
          convertedResp[item?.label === "dob" ? "dateOfBirth" : item?.label] =
            item.value;
          if (item?.label === "gender") {
            convertedResp[item?.label] = item?.value;
          }
        }
        this.documentInfo = convertedResp;
        res.data = convertedResp;

        // Aadhaar Back Scan
        if (this.documentInfo?.address && this.documentInfo?.pincode) {
          let backData = {
            address1: this.documentInfo?.address,
            pincode: this.documentInfo?.pincode,
          };
          sessionStorage.setItem("backData", JSON.stringify(backData));
        }

        if (res?.data?.aadhaarNumber != "Details not found") {
          this.nationalIdNo = res?.data?.aadhaarNumber;
        }
        if (
          Object.keys(res?.data).filter(
            (value) =>
              res?.data[value] != "Detail not found" && res?.data[value] != null
          )?.length < 1
        ) {
          this.documentNotMatched(i, file);
          return -1;
        } else {
          // this.loder.close();
          this.snack.open(`Document Uploaded Successfully` + " !", "OK", {
            duration: 4000,
            verticalPosition: "top",
            horizontalPosition: "right",
            panelClass: "snackbar-error",
          });
          console.log(this.ocrPass);

          this.ocrPass = true;
          console.log(this.ocrPass);

          // if document details not found or document is invalid.
          if (
            (res.data?.aadhaarNumber == "Detail not found" ||
              res.data?.panNumber == "Detail not found" ||
              res.data?.passportNumber == "Detail not found") &&
            res.data?.dateOfBirth == "Detail not found"
          ) {
            this.documentNotMatched(i, file);
          } else {
            // for aadhar
            const index =
              this.otherDocument()?.controls[i]?.get("fileInfo")?.value
                ?.length - 1;
            console.log(index, "idx");

            if (index)
              this.updateFileInfo(
                index,
                i,
                res.data?.name,
                res.data?.dateOfBirth,
                res.data?.gender
              );
            if (this.hideSelect[i]?.toLowerCase().includes("aadhar")) {
              if (
                res.data?.aadhaarNumber.replace(/\s/g, "") !=
                this.otherDocument()["controls"][i]?.get("documentNumber").value
              ) {
                // this.documentDataMissMatch(`Document number`, file, i);
              }
            }
            // for pan card
            else if (this.hideSelect[i]?.toLowerCase().includes("pan")) {
              if (
                res.data?.panNumber.replace(/\s/g, "") !=
                this.otherDocument()["controls"]?.[i]?.get("documentNumber")
                  .value
              ) {
                this.documentDataMissMatch(`Document number`, file, i);
              }
            }
            // for passport.
            else if (this.hideSelect[i]?.toLowerCase().includes("passport")) {
              console.log(res);
              if (
                res.data?.passportNumber.replace(/\s/g, "") !=
                this.otherDocument()["controls"][i].get("documentNumber").value
              ) {
                this.documentDataMissMatch(`Document number`, file, i);
              }
            }
          }
        }
      }
    } catch (error) {
      // this.loder.close();
      this.deleteFile(i, i, file);
      throw error;
    }
  }

  updateFileInfo(index, i, name, dateOfBirth, gender) {
    this.otherDocument().controls[i].get("fileInfo").value[index] = {
      ...this.otherDocument().controls[i].get("fileInfo").value[index],
      applicantName: name,
      dateOfBirth: dateOfBirth,
      gender: gender,
    };

    console.log(
      this.otherDocument().controls[i].get("fileInfo").value,
      "///////"
    );
  }

  documentNotMatched(i, file) {
    this.deleteFile(i, i, file);
    // this.loder.close();
    this.snack.open(
      `Uploaded Document is not valid or details not found` + " !",
      "OK",
      {
        duration: 4000,
        verticalPosition: "top",
        horizontalPosition: "right",
        panelClass: "snackbar-error",
      }
    );
  }

  documentDataMissMatch(title, file, i) {
    const dialogData = {
      error: ` ${title} doesn't match the document upload.`,
      message: "Would you like to continue?",
    };
    const dialogRef = this.dialog.open(WarningComponent, {
      width: "40%",
      data: dialogData,
      disableClose: true,
      panelClass: "",
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result != "Ok") {
        this.deleteFile(i, i, file);
      }
    });
  }

  uploadImage(file, i) {
    let formData = new FormData();
    let data = {
      ...(this.isOtherDocVisible
        ? {
            documentNameForChecklist:
              this.createDocumentForm.value.otherDocument[i].documentType,
          }
        : ""),
      documentName: !this.isOtherDocVisible ? this.nationalIdGeneric : null,
      documentType: !this.isOtherDocVisible
        ? this.nationalIdGeneric
        : this.createDocumentForm.value.otherDocument[i].documentType,
      documentNumber:
        this.createDocumentForm.value.otherDocument[i].documentNumber,
      documentSide:
        this.createDocumentForm.value.otherDocument[i]?.docIds?.length + 1 ?? 0,
      fileName: file.name,
      fileType: file.type,
      verificationType: "kyc",
    };

    formData.append("data", JSON.stringify(data));
    formData.append("file", file);
    formData.append("module", "document");
    // this.loder.open();
    this.ocrPass = false;
    if (this.ocrCheck) {
      this.readDocument(
        file,
        this.createDocumentForm.value.otherDocument[i]?.docIds?.length
      )
        .then(() => {
          if (this.ocrPass) {
            const updatedData = {
              ...data,
              documentNumber: this.nationalIdNo,
            };
            formData.set("data", JSON.stringify(updatedData));

            this.api.uploadDocument(formData).subscribe((resp) => {
              if (resp?.statusCode === 200) {
                this.updateDocId(i).push(resp.data.documentId);
                this.documentIds.push(this.createDocumentForm.value);
                console.log(
                  this.otherDocument()?.controls[i].get("fileInfo")?.value,
                  i
                );
                const index =
                  this.otherDocument()?.controls[i]?.get("fileInfo")?.value
                    ?.length - 1;
                console.log(index, "idx");

                // if (index)
                this.updateFileInfo(
                  index,
                  i,
                  this.documentInfo?.name,
                  this.documentInfo?.dateOfBirth,
                  this.documentInfo?.gender
                );
                if (this.isOtherDocVisible)
                  this.extractDoc(
                    this.createDocumentForm.value.otherDocument[i].documentType,
                    parseInt(sessionStorage.getItem("originationId")),
                    file,
                    i,
                    resp.data.documentId,
                    sessionStorage.getItem("customerStagingId")
                  );
                this.isLoading = false;
                // else this.loder.close();
              }
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (!this.ocrCheck && this.individual) {
      this.api.uploadDocument(formData).subscribe((resp) => {
        if (resp?.statusCode === 200) {
          this.updateDocId(i).push(resp.data.documentId);
          this.documentIds.push(this.createDocumentForm.value);

          if (this.isOtherDocVisible)
            this.extractDoc(
              this.createDocumentForm.value.otherDocument[i].documentType,
              parseInt(sessionStorage.getItem("originationId")),
              file,
              i,
              resp.data.documentId,
              sessionStorage.getItem("customerStagingId")
            );
        }
      });
    } else {
      this.api.uploadDocument(formData).subscribe((resp) => {
        if (resp?.statusCode === 200 || resp?.statusCode == 201) {
          this.dataService.setChecklistDocument(
            this.createDocumentForm.value.otherDocument[i].documentType,
            {
              docName:
                this.createDocumentForm.value.otherDocument[i].documentType,
              originationId: parseInt(sessionStorage.getItem("originationId")),
              file: file,
              documentId: resp.data.documentId,
              customerStagingId: sessionStorage.getItem("customerStagingId"),
            }
          );
          sessionStorage.setItem(
            "otherDocScreenCode",
            sessionStorage.getItem("currentScreenCode")
          );
        }
      });
    }
  }

  //for demo purpose removed error message
  extractDoc(docName, originationId, file, i, documentId, customerStagingId) {
    let formData = new FormData();
    formData.append("fileName", file);
    this.docapi
      .getCheckListDoc(
        docName,
        originationId,
        formData,
        documentId,
        customerStagingId
      )
      .subscribe((resp) => {
        if (resp) {
          if (
            resp?.data?.customerName?.toLowerCase() !==
            this.docAppliName?.toLowerCase()
          ) {
            console.log(`National Id name is not matching with this customer.`);
          } else {
            console.log(`National Id name matches the customer.`);
          }
        }
      });
  }

  updateDocId(indx: any): any[] {
    return this.otherDocument().controls[indx].get("docIds")?.value;
  }

  displayImage(indx, file, size) {
    const reader = new FileReader();
    const sizeinKb = (size / 1024).toFixed(2);
    reader.onload = (event: ProgressEvent<FileReader>) => {
      this.imageUrl = event.target.result as string;
      this.getFileInfo(indx).push({
        url: this.imageUrl,
        name: file.name,
        progress: "100%",
        size: `${sizeinKb}kb`,
      });
      setTimeout(() => {
        this.getFileInfo(indx)[this.getFileInfo(indx)?.length - 1].progress =
          "0%";
      }, 1000);
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
      this.displayImage(i, event.files, event.files?.size);
      this.uploadImage(event.files, i);
    }
    const fReader = new FileReader();
    fReader.readAsDataURL(event.files);
  }

  onSubmit() {
    console.log(this.loanDisbursementForm, ".....");
    let isDocUploaded: boolean = false;
    if (this.createDocumentForm) {
      isDocUploaded = this.createDocumentForm.value.otherDocument
        .filter((docItem) => docItem.documentType)
        .every((item) => item.fileInfo?.length > 0);
    }
    console.log(this.createDocumentForm);

    if (this.createDocumentForm.invalid || !isDocUploaded) {
      return;
    }
    console.log(isDocUploaded);
    this.isLoading = true;
    this.loadingBtnText = "Saving...";
    if (this.loanDisbursementForm) {
      this.onCustomSubmit.emit({
        documentDetails: this.createDocumentForm.value,
        loanDisbursement: this.loanDisbursementForm.value ?? {},
      });
    } else
      this.onCustomSubmit.emit({
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
      return (this.createDocumentForm.invalid || !isDocUploaded) &&
        this.individual
        ? true
        : false;
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
