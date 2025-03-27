import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { OfferIssueService } from 'app/shared/services/offer-issue.service';
import { selectUser } from '@onerumango/utils';
import * as moment from 'moment';
import { SignNowPopupComponent } from '../../digital-sign/sign-now-popup/sign-now-popup.component';
import { SuccessModalComponent } from '../../digital-sign/success-modal/success-modal.component';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { BranchService } from '../../digital-sign/sign-now-popup/branch.service';
import { OriginationService } from 'app/shared/services/origination.service';
import { SharedService } from 'app/shared/services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-offer-letter',
  templateUrl: './offer-letter.component.html',
  styleUrls: ['./offer-letter.component.scss'],
})
export class OfferLetterComponent implements OnInit, OnDestroy {
  currentUser: any;
  dataLocalUrl: any;
  originationId: any;
  signatureId: any;
  customerInfo: any;
  download: any;
  staticData = {
    CUSTOMERRESPONSE: [],
  };
  CUSTOMERRESPONSE: any[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    private offerIssueService: OfferIssueService,
    private domSanitizer: DomSanitizer,
    private route: Router,
    private dialog: MatDialog,
    private sessionStorageService: SessionStorageService,
    private branchService: BranchService,
    private originationService: OriginationService,
    private sharedService: SharedService,
    private store: Store,
  ) {}

  ngOnInit(): void {
    const loadUserProfileSub = this.store
      .select(selectUser)
      .subscribe((user) => {
        if (user) {
          this.currentUser = user;
          this.originationId = this.sessionStorageService.getOriginationId();
          this.customerInfo = this.sessionStorageService.getCustomerInfo();
          this.generatePdf();
          this.fetchGenericValues();
        }
      });

    this.subscriptions.push(loadUserProfileSub);
  }

  generatePdf() {
    this.offerIssueService
      .downloadOfferletter(this.originationId)
      .subscribe((res: any) => {
        this.download = new Blob([res], { type: 'application/pdf' });
        this.dataLocalUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
          window.URL.createObjectURL(this.download),
        );
        this.dataLocalUrl.changingThisBreaksApplicationSecurity =
          this.dataLocalUrl.changingThisBreaksApplicationSecurity +
          '#toolbar=0';
      });
  }
  fetchGenericValues() {
    this.sharedService
      .genericValue('Offer Accept / Reject', Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.CUSTOMERRESPONSE = resp.data['CUSTOMERRESPONSE'];
        }
      });
  }

  handleDownload() {
    const url = window.URL.createObjectURL(this.download);

    // Create a link element and simulate a click to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = `Offer Letter.pdf`;
    document.body.appendChild(link);
    link.click();

    // Cleanup the link element
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  saveCustomerResponse(response: any) {
    const payload: any = {};
    payload.dateOfOfferAcceptOrReject = moment(new Date()).format(
      'DD-MMM-YYYY',
    );
    const id = this.CUSTOMERRESPONSE.find((item) =>
      item?.values?.includes(response),
    )?.id;
    payload.customerResponse = id;

    payload.originationId = this.originationId;
    this.offerIssueService
      .postOfferAcceptRejectDetails(payload)
      .subscribe((res) => {
        if ((res?.statusCode === 200 || res?.statusCode == 201) && res?.data) {
          if (response == 'Accept') this.route.navigate(['/origination/otp']);
          else if (response == 'Reject')
            this.route.navigate(['/origination/remark']);
          else this.route.navigate(['/origination/process-offer']);
        }
      });
    this.route.navigate(['origination/request-processing/digital-signature']);
  }

  openEsign() {
    const dialogRef = this.dialog.open(SignNowPopupComponent, {
      disableClose: false,
      width: '60%',
      data: { signatureId: this.signatureId, title: 'Sign Now' },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res?.result?.signatureId) {
        const signPayload = {
          originationId: this.sessionStorageService.getOriginationId(),
          signatureId: res?.result?.signatureId,
          screenCode: this.sessionStorageService.getScreenId(),
        };
        this.branchService
          .saveDigitalSignDetails(signPayload)
          .subscribe((result) => {
            if (result?.statusCode === 200 || result?.statusCode === 201) {
              this.updateStatus('Submit');
            }
          });
      } else {
        window.close();
      }
    });
  }

  /**
   * To update the status this method will call workflow api
   * @param action
   * @param remarks
   */
  updateStatus(action: string, remarks?: string): void {
    const payload: any = {};
    payload.properties = {};
    payload.screenCode = null;
    payload.processStageId = null;
    payload.processCycleCode = this.sessionStorageService.getProcessCycleCode();
    payload.originationId = this.originationId;
    payload.action = action;
    payload.remarks = remarks;
    this.originationService.verifyWorkflow(payload).subscribe((res) => {
      if (res?.status == 200) {
        const sucessDialog = this.dialog.open(SuccessModalComponent, {
          width: '40%',
          data: {
            screenType: 'Sign Now',
            title: 'Digital sign has been successfully recorded!',
          },
          disableClose: true,
        });
        sucessDialog.afterClosed().subscribe((_) => {
          setTimeout(() => {
            window.close();
          }, 5000);
        });
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
