import { Component, Input, OnInit } from '@angular/core';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { tap, map, catchError, of } from 'rxjs';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss'],
})
export class AccountDocumentUploadComponent implements OnInit {
  checkListDocList: any[] = [];
  submittedChecklistDocs: any;
  documentList: any;
  @Input() screenName = '';
  customerDocumentList: any;
  constructor(
    private loanService: LoanService,
    private sessionStorageService: SessionStorageService,
  ) {}

  ngOnInit() {
    const originationId = this.sessionStorageService.getOriginationId();
    if (this.screenName.toLowerCase().includes('loan'))
      this.loanService
        .getCheckListDoc(
          this.sessionStorageService.getCurrentStage(),
          parseInt(this.sessionStorageService.getCurrentScreenCode() ?? 456),
          this.sessionStorageService.getOriginationId(),
        )
        .subscribe((resp) => {
          if (resp?.statusCode == 200) {
            this.checkListDocList = this.groupBy(resp.data);
            const screenCode = parseInt(
              this.sessionStorageService.getCurrentScreenCode() ?? 456,
            );
            if (screenCode) this.getCheckListDoc(screenCode);
          } else {
            this.checkListDocList = [];
          }
        });
    else {
      this.loanService
        .getPersonalDetailsData(originationId)
        .subscribe((resp) => {
          if (resp.data.customerInfo.length > 0) {
            const customerInfo = resp.data.customerInfo ?? [];
            if (customerInfo.length > 0) {
              const customerDocUpload: any[][] = customerInfo.map((c: any) =>
                Array.isArray(c.documentInfo) ? c.documentInfo : [],
              );

              this.customerDocumentList = customerDocUpload;
            }
          }
        });
    }
  }

  getCheckListDoc(screenCode: any) {
    this.loanService
      .getSavedChecklist(
        this.sessionStorageService.getOriginationId(),
        screenCode,
        this.sessionStorageService.getCurrentStage(),
      )
      .subscribe((resp) => {
        if (resp?.statusCode === 200) {
          this.documentList = resp.data
            .filter((item: any) => Array.isArray(item.docInfoModel))
            .map((item: any) => {
              return item;
            });
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

  savedCheckListDoc(event: any) {
    this.submittedChecklistDocs = event.documentDetails.otherDocument;
  }

  submitForm() {
    return this.handleSubmit().toPromise();
  }

  handleSubmit() {
    if (this.screenName.toLowerCase().includes('loan')) {
      const documentIds = this.submittedChecklistDocs.flatMap(
        (doc: any) => doc.docIds,
      );
      const payload = {
        documentIds,
        originationId: this.sessionStorageService.getOriginationId(),
        screenCode: this.sessionStorageService.getCurrentScreenCode() ?? 456,
      };
      return this.loanService.saveChecklist(payload).pipe(
        tap((res) => {
          console.log(res);
        }),
        map((res) =>
          res?.statusCode == 200 || res?.statusCode == 201
            ? ('success' as const)
            : ('failure' as const),
        ),
        catchError((_err) => {
          console.error(_err);
          return of('failure' as const);
        }),
      );
    } else {
      return of('success' as const);
    }
  }
}
