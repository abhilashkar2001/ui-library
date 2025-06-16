import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DownloadService } from 'app/shared/services/download.service';
import { OpenAccountService } from 'app/shared/services/open-service/open-account.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { TokenStorageService } from '@onerumango/utils';
import { LoanService } from 'app/shared/services/loan/loan.service';

@Component({
  selector: 'app-success-popup',
  templateUrl: './success-popup.component.html',
  styleUrls: ['./success-popup.component.scss'],
})
export class SuccessPopupComponent implements OnInit {
  originationId!: number;
  email!: string;
  loanSummaryDetails: any;
  accountData: any;
  depositType: any;
  isStageAvilable = true;
  currentStageName = '';
  isNetBanking: false;
  referenceNo: any = '';
  actionType: any;
  message = 'Application is submitted successfully.';
  typeOfPopup = '';
  generatedLink = '';
  appontment: any;
  isComplete: any;

  constructor(
    private dialogRef: MatDialogRef<SuccessPopupComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    @Inject(MAT_DIALOG_DATA) public screenData: any,
    private downloadService: DownloadService,
    private openAccountService: OpenAccountService,
    private router: Router,
    private sessionStorageService: SessionStorageService,
    private tokenStorageService: TokenStorageService,
    private loanService: LoanService,
  ) {
    this.isNetBanking = data.isNetBanking || false;
    this.actionType = data.actionType;
    this.referenceNo = data.refrenceNo;
  }

  ngOnInit(): void {
    this.depositType = this.data?.type;
    this.originationId = this.data?.originationId;
    this.isComplete = this.data?.isComplete;
    if (this.data?.msg) this.message = this.data.msg;
    if (this.data?.generatedLink) this.generatedLink = this.data.generatedLink;
    if (this.data?.appontment) this.appontment = this.data.appontment;
    this.isStageAvilable = this.data?.isStageAvilable ?? true;
    if (this.data?.type) this.typeOfPopup = this.data.type ?? '';
    this.email = this.data?.email ?? 'shiyam.ram@rumango.com';
    if (this.sessionStorageService.getLoanBasisDetails()) {
      this.openAccountService.getData().subscribe((resp: any) => {
        if (resp) {
          this.loanSummaryDetails = resp;
          this.email = resp.email;
        }
      });
    } else if (localStorage.getItem('basisDetails')) {
      this.openAccountService.getData().subscribe((res: any) => {
        if (res) {
          this.accountData = res;
          this.email = this.accountData.contact.email;
        }
      });
    }
  }

  onClickAction(type: any, operation: any) {
    this.shareOrDownload({ type: type, operation: operation });
  }

  // Share button email to
  shareEmail() {
    const formData = new FormData();
    formData.append(
      'to',
      this.data.email ?? this.email ?? 'shiyam.ram@rumango.com',
    );
    formData.append('subject', 'Hello from Shiyam');
    formData.append('body', 'Email testing got successful');
    // formData.append('file', this.selectedFile);

    this.loanService.triggerloanDetailsEmail(formData).subscribe((res) => {
      console.log(res, 'response');
    });
  }

  shareOrDownload(event: any) {
    let report;
    let downloadServiceMethod: any;
    let pdfFileName: string;

    if (this.loanSummaryDetails) {
      downloadServiceMethod = this.downloadService.downloadloanDetailDoc(
        this.originationId,
      );
      pdfFileName = 'Loan Details.pdf';
    } else if (this.accountData) {
      downloadServiceMethod = this.downloadService.downloadAccountDetailDoc(
        this.originationId,
      );
      pdfFileName = 'Account Details.pdf';
    } else if (this.depositType) {
      downloadServiceMethod = this.downloadService.downloadFdRdDetailDoc(
        this.originationId,
      );
      pdfFileName =
        this.depositType == 'FD'
          ? 'Fixed Deposit Details.pdf'
          : 'Reccuring Deposit Details.pdf';
    }

    downloadServiceMethod.subscribe((resp: any) => {
      const blob = new Blob([resp], { type: 'application/pdf' });

      report = new File([blob], pdfFileName, {
        type: 'application/pdf',
      });

      if (event.operation == 'Share') {
        //Send email to be implementated from service that's why
        //existing ui implementation removed by Abhilash
      } else {
        const url = window.URL.createObjectURL(report);
        const a = document.createElement('a');
        a.href = url;
        a.download = pdfFileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }

  done() {
    this.tokenStorageService.clearSessionExceptLoginInfo();
    if (this.isNetBanking) {
      this.router.navigate([`/user/dashboard/${this.data.route}`]);
      this.dialogRef.close();
    } else {
      localStorage.removeItem('basisDetails');
      localStorage.removeItem('customerData');
      this.sessionStorageService.removeLoanBasisDetails();
      this.dialogRef.close(true);
      window.close();
    }
  }

  close() {
    this.dialogRef.close(false);
  }

  onClick() {
    this.dialogRef.close('tracking');
    this.router.navigate(['/origination/tracking']);
  }
}
