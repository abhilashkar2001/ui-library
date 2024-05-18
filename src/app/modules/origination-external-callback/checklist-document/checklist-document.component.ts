import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ChecklistModel } from "app/shared/models/checklist-model";
import { OriginationService } from "app/shared/services/origination.service";
import { SessionStorageService } from "app/shared/services/session-storage.service";

@Component({
  selector: "app-checklist-document",
  templateUrl: "./checklist-document.component.html",
  styleUrls: ["./checklist-document.component.scss"],
})
export class ChecklistDocumentComponent implements OnInit {
  checklistDocumentForm: FormGroup;
  refNumber: string = "R10034";
  title: string = "Loan Document Upload";
  originationId: number = 3507;
  screenId: number;
  checklistDocuments;
  stageId: number;

  constructor(
    private originationService: OriginationService,
    private sessionStorageService: SessionStorageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.originationId = this.sessionStorageService.getOriginationId() || 3507;
    this.screenId = this.sessionStorageService.getScreenId() || 290;
    this.stageId = 1002;
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
  documentCtrl(): FormArray {
    return this.checklistDocumentForm.get("documents") as FormArray;
  }

  /**
   * build document form array
   * @param data
   * @returns the formgorup to be pushed in document form array in customer form array
   */
  documentFormArray(data?) {
    return this.fb.group({
      documentName: [data?.documentName ?? "", [Validators.required]],
      isProofOfAddress: [data?.isProofOfAddress ?? ""],
      files: this.fb.array([]),
    });
  }

  /**
   * control for the files present in particular document
   * @param index
   * @param documentIndex
   * @returns retuns the form control of file in document form array
   */
  documentFilesCtrl(documentIndex): FormArray {
    return this.documentCtrl().at(documentIndex).get("files") as FormArray;
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
  pushDocumentInfo(element) {
    if (element && element?.length > 0) {
      this.documentCtrl().clear();
      element.forEach((document, docIndex) => {
        this.documentCtrl().push(this.documentFormArray(document));
      });
    } else {
      this.documentCtrl().push(this.documentFormArray());
    }

    console.log(this.checklistDocumentForm);
  }

  fetchAllChecklist() {
    this.originationService
      .fetchChecklistItem(this.originationId, this.screenId, this.stageId)
      .subscribe((res: ChecklistModel) => {
        if (res.statusCode == 200 && res?.data) {
          this.checklistDocuments = res?.data;
          this.pushDocumentInfo(res?.data);
        }
      });
  }

  goBack() {
    window.close();
  }
}
