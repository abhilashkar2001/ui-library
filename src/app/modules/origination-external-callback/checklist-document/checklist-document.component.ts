import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatIconRegistry } from "@angular/material/icon";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import {
  ChecklistModel,
  ChecklistPayloadModel,
  ChecklistRouteObjModel,
} from "app/shared/models/checklist-model";
import { DocumentUploadService } from "app/shared/services/document-upload.service";
import { OriginationService } from "app/shared/services/origination.service";
import { SessionStorageService } from "app/shared/services/session-storage.service";
import { SuccessModalComponent } from "../digital-sign/success-modal/success-modal.component";
import { environment } from "environments/environment";
import { EmailService } from "app/shared/services/email.service";

@Component({
  selector: "app-checklist-document",
  templateUrl: "./checklist-document.component.html",
  styleUrls: ["./checklist-document.component.scss"],
})
export class ChecklistDocumentComponent implements OnInit {
  checklistDocumentForm: FormGroup;
  refNumber: string;
  title: string = "Loan Document Upload";
  originationId: number = 3507;
  checklistDocuments;
  checklistRouteObj: ChecklistRouteObjModel;
  customerInfo: any;
  env: string = environment.microServiceURL;
  pdfType: string =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.pdf";
  acceptedDocumentId: any[];

  constructor(
    private originationService: OriginationService,
    private sessionStorageService: SessionStorageService,
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private documentUploadService: DocumentUploadService,
    private dialog: MatDialog,
    private emailService: EmailService
  ) {}

  ngOnInit(): void {
    this.originationId = this.sessionStorageService.getOriginationId();
    this.checklistRouteObj = this.sessionStorageService.getCheklistRouteObj();
    this.customerInfo = this.sessionStorageService.getCustomerInfo();
    this.refNumber = this.customerInfo?.icustRefNo;
    this.initChecklistDocumentForm();
    this.fetchAllChecklist();
  }

  initChecklistDocumentForm() {
    this.checklistDocumentForm = this.fb.group({
      documents: this.fb.array([]),
    });
  }

  /**
   * this is the control for document form array
   * @param index
   * @returns the control of document in customer form array
   */
  get documentCtrl(): FormArray {
    return this.checklistDocumentForm.get("documents") as FormArray;
  }

  /**
   * build document form array
   * @param data
   * @returns the formgorup to be pushed in document form array in customer form array
   */
  documentFormArray(data?) {
    return this.fb.group({
      documentName: [data?.document ?? "", [Validators.required]],
      isProofOfAddress: [data?.isProofOfAddress ?? ""],
      files: this.fb.array([]),
      description: [data?.summary ?? ""],
      fileType: [
        this.formatDocumentType(
          data?.documentTypes?.toLowerCase(),
          data?.documentName
        ) ?? "",
      ],
      docRequired: [data?.docRequired ?? false],
    });
  }

  /**
   * control for the files present in particular document
   * @param index
   * @param documentIndex
   * @returns retuns the form control of file in document form array
   */
  documentFilesCtrl(documentIndex): FormArray {
    return this.documentCtrl.at(documentIndex).get("files") as FormArray;
  }

  /**
   * method is used to build the file form group for particular document
   * @param data of the uploaded file details
   * @returns return the file form group
   */
  documentFileFormArray(data?) {
    return this.fb.group({
      fileName: [data?.fileName ?? ""],
      fileUrl: [data?.fileUrl ?? ""],
      documentId: [data?.documentId ?? null, [Validators.required]],
    });
  }

  /**
   * push document info to the document form fetching for the customer
   * @param element document data of the particular customer
   * @param index index of the customer in customer form array
   */
  pushDocumentInfo(element?) {
    if (element && element?.length > 0) {
      this.documentCtrl.clear();
      element.forEach((document, docIndex) => {
        this.documentCtrl.push(this.documentFormArray(document));
        this.documentFilesCtrl(docIndex).push(this.documentFileFormArray());
      });
    } else {
      this.documentCtrl.push(this.documentFormArray());
      this.documentFilesCtrl(0).push(this.documentFileFormArray());
    }
  }

  fetchAllChecklist() {
    this.originationService
      .fetchChecklistItem(
        this.originationId,
        this.checklistRouteObj.screenId,
        this.checklistRouteObj.processStageId
      )
      .subscribe((res: ChecklistModel) => {
        if (res.statusCode == 200 && res?.data) {
          this.acceptedDocumentId =
            this.checklistRouteObj?.checklistItem?.split(",");
          this.checklistDocuments = res?.data?.filter((checklist) =>
            this.acceptedDocumentId.some((item) => item == checklist.id)
          );
          this.pushDocumentInfo(this.checklistDocuments);
        }
      });
  }

  addAnotherPage(index: number) {
    this.documentFilesCtrl(index).push(this.documentFileFormArray());
  }

  uploadDocument(event, index: number, fileIndex: number) {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let docdata: any = {};
      docdata.fileName = file?.name.split(".")[0];
      docdata.fileType = file?.type.split("/")[1];
      docdata.documentNameForChecklist = this.documentCtrl
        .at(index)
        .get("documentName").value;
      docdata.documentDesc = this.documentCtrl
        .at(index)
        .get("description").value;
      const formdata = new FormData();
      formdata.append("file", file);
      formdata.append("data", JSON.stringify(docdata));
      formdata.append("module", "document");
      if (
        this.documentCtrl.at(index).get("fileType").value ==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.pdf" &&
        !file.name.includes(".xlsx") &&
        !file.name.includes(".pdf")
      ) {
        this.snack.open(`Please Upload Pdf or Excel Documents`, "Ok!", {
          horizontalPosition: "right",
          verticalPosition: "top",
          duration: 3000,
        });
        return;
      } else if (
        this.documentCtrl.at(index).get("fileType").value ==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
        !file.name.includes(".xlsx")
      ) {
        this.snack.open(`Please Upload Excel documents`, "Ok!", {
          horizontalPosition: "right",
          verticalPosition: "top",
          duration: 3000,
        });
        return;
      } else if (
        this.documentCtrl.at(index).get("fileType").value == ".pdf" &&
        !file.name.toLowerCase().includes(".pdf")
      ) {
        this.snack.open(`Please Upload Pdf documents`, "Ok!", {
          horizontalPosition: "right",
          verticalPosition: "top",
          duration: 3000,
        });
        return;
      }
      this.documentUploadService.uploadDocuments(formdata).subscribe((res) => {
        if ((res?.statusCode === 200 || res?.statusCode == 201) && res?.data) {
          this.documentFilesCtrl(index).at(fileIndex).patchValue(res?.data);
          this.documentFilesCtrl(index).push(this.documentFileFormArray());
        }
      });
    }
  }

  removeImage(index: number, fileIndex: number) {
    const ctrl = this.documentFilesCtrl(index).at(fileIndex);
    if (ctrl.get("documentId").value) {
      ctrl.reset();
    } else {
      this.documentFilesCtrl(index).removeAt(fileIndex);
    }
  }

  formatDocumentType(documentTypes: string, documentName: string) {
    if (documentTypes?.includes("excel") && documentTypes?.includes("pdf"))
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.pdf";
    else if (documentTypes?.includes("excel"))
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    else if (documentTypes?.includes("pdf")) return ".pdf";
    else console.log(`Document type is not given for ${documentName}`);
    return "";
  }

  saveChecklist() {
    let payload: ChecklistPayloadModel = {
      documentIds: [],
      originationId: this.originationId,
      screenCode: this.checklistRouteObj?.screenId,
    };
    payload.documentIds = [];
    this.documentCtrl?.value?.forEach((element) => {
      element?.files?.forEach((file) => {
        if (file?.documentId) payload?.documentIds?.push(file?.documentId);
      });
    });
    this.originationService.saveChecklist(payload).subscribe((res) => {
      if (res?.statusCode === 200 || res?.statusCode == 201) {
        let payload = {
          originationId: this.originationId,
          status: "CONFIRMED",
          userName: "WEBSITE",
          department: "CUSTOMER",
          remarks: "",
          code: "DOCREVIEW",
          nextDepartment: "SALES DEPARTMENTS",
          checklistItem: this.acceptedDocumentId,
        };
        this.saveUpdate(payload);

        this.openSuccessPopup();
      }
    });
  }

  saveUpdate(payload) {
    this.originationService
      .updateApprovalStatus(payload)
      .subscribe((res: any) => console.log(res));
  }

  triggerEmail() {
    const documentList = this.checklistDocuments
      .map((doc) => doc.document)
      .join("\n");
    const formData: FormData = new FormData();
    formData.append("subject", "Thank you for submitting your documents.");
    formData.append(
      "body",
      `Dear ${this.customerInfo?.firstName} ${this.customerInfo?.lastName},\n
We are pleased to inform you that your documents for loan application ${this.customerInfo?.icustRefNo} have been successfully uploaded.\n 

Below is the list of documents you provided:\n
${documentList}\n
Our team will review your signature and update you shortly regarding the next steps.\n

Thank you for your cooperation`
    );
    formData.append("to", this.customerInfo?.contact?.email);
    this.emailService
      .triggerTransactionEmail(formData)
      .subscribe((res: string) => {
        if (res) {
        }
      });
  }

  openSuccessPopup() {
    const dialogref = this.dialog.open(SuccessModalComponent, {
      width: "50%",
      panelClass: "popup-class",
      data: {
        title: "Document Summited Successfully",
        alert: "Keep a record of your Reference Number for future use",
        refNo: this.customerInfo.icustRefNo,
      },
    });
    dialogref.afterClosed().subscribe((_) => {
      this.triggerEmail();
      setTimeout(() => {
        window.close();
      }, 5000);
    });
  }

  goBack() {
    window.close();
  }
}
