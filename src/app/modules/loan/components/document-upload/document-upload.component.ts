import { Component, OnInit } from '@angular/core';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss'],
})
export class DocumentUploadComponent implements OnInit {
  checkListDocList: any[] = [];

  constructor(
    private loanApi: LoanService,
    private sessionStorageService: SessionStorageService,
  ) {}

  ngOnInit() {
    this.loanApi
      .getCheckListDocNoOrigination(
        this.sessionStorageService.getCurrentStage() ?? 131706,
        parseInt(this.sessionStorageService.getCurrentScreenCode() ?? 456),
      )
      .subscribe((resp) => {
        if (resp.data.length > 0) {
          this.checkListDocList = this.groupBy(resp?.data);
        } else {
          this.checkListDocList = [];
        }
      });
  }

  groupBy(documents: any) {
    return documents.reduce((result: any, doc: any) => {
      const groupName = doc.docRequired
        ? 'requiredDocument'
        : 'nonRequiredDocument';
      (result[groupName] = result[groupName] || []).push(doc);
      return result;
    }, {});
  }
}
