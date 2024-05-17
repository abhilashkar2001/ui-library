import { Component, OnInit } from "@angular/core";
import { ChecklistModel } from "app/shared/models/checklist-model";
import { OriginationService } from "app/shared/services/origination.service";
import { SessionStorageService } from "app/shared/services/session-storage.service";

@Component({
  selector: "app-checklist-document",
  templateUrl: "./checklist-document.component.html",
  styleUrls: ["./checklist-document.component.scss"],
})
export class ChecklistDocumentComponent implements OnInit {
  refNumber: string = "R10034";
  title: string = "Loan Document Uplaod";
  originationId: number = 3507;
  screenId: number;
  checklistDocuments;

  constructor(
    private originationService: OriginationService,
    private sessionStorageService: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.originationId = this.sessionStorageService.getOriginationId();
    this.screenId = this.sessionStorageService.getScreenId();
    this.fetchAllChecklist();
  }

  fetchAllChecklist() {
    this.originationService
      .fetchChecklistItem(this.originationId, this.screenId)
      .subscribe((res: ChecklistModel) => {
        if (res.statusCode == 200 && res?.data) {
          this.checklistDocuments = res?.data;
        }
      });
  }

  goBack() {
    window.close();
  }
}
