import { ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState, selectUser, TokenStorageService, User } from '@onerumango/utils';
import {
  BranchService,
} from 'app/modules/origination/modules/origination-external-callback/digital-sign/sign-now-popup/branch.service';
import {
  SignNowPopupComponent,
} from 'app/modules/origination/modules/origination-external-callback/digital-sign/sign-now-popup/sign-now-popup.component';
import {
  SuccessModalComponent,
} from 'app/modules/origination/modules/origination-external-callback/digital-sign/success-modal/success-modal.component';
import {
  SignSummaryComponent,
} from 'app/modules/origination/modules/origination-external-callback/offer-letter/sign-summary/sign-summary.component';
import { DialogService } from 'app/shared/services/dialog.service';
import { EmailService } from 'app/shared/services/email.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { environment } from 'environments/environment';
import moment from 'moment';
import { firstValueFrom, Observable } from 'rxjs';

@Component({
  selector: 'app-digital-signature',
  templateUrl: './digital-signature.component.html',
  styleUrls: ['./digital-signature.component.scss'],
})
export class DigitalSignatureComponent {
  @Input() triggerNext = false;
  @Input() updateParentModel:
    | ((
        part: Partial<any>,
        isFormValid: boolean,
        isFormDirty?: boolean,
      ) => void)
    | undefined;
  @Input() screenInfo: any;
  @Input() markAsTouched: boolean | undefined;

  originationId: any;
  signatureId: any;
  imageUrl: any;
  buttonTitle: any;
  currentUser: User | null | undefined;
  customerName: string | undefined;
  userProfile$: Observable<User | null>;

  constructor(
    private dialogService: DialogService,
    private branchService: BranchService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private tokenStorageService: TokenStorageService,
    private sessionStorageService: SessionStorageService,
    private emailService: EmailService,
    private store: Store<AppState>,
  ) {
    this.userProfile$ = this.store.select(selectUser);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['triggerNext'] && this.triggerNext === true) {
      this.saveSignature(true);
    }
    if (changes?.['markAsTouched']?.currentValue === true)
      this.saveSignature(true);
  }

  ngOnInit(): void {
    this.originationId = this.sessionStorageService.getOriginationId();
    const customerName = this.sessionStorageService.getCustomerName();
    if (customerName?.length > 0) {
      this.customerName = customerName[0];
    }
    if (this.originationId && this.screenInfo?.screenValue == 'O1DIGS') {
      this.fetchSignature();
    } else if (this.screenInfo?.screenValue == 'O1APPD')
      this.fetchOfferIssueSign();

    this.loadUserProfile();
  }

  async loadUserProfile() {
    try {
      this.currentUser = await firstValueFrom(this.userProfile$);
    } catch (error) {
      console.log(error);
    }
  }

  addDetalis(title: string): void {
    const dialogRef = this.dialog.open(SignNowPopupComponent, {
      width: '974px',
      height: 'auto',
      disableClose: true,
      data: { signatureId: this.signatureId, title: title },
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.imageUrl = data?.result?.fileUrl;
        this.signatureId = data?.result?.signatureId;
        this.buttonTitle = data?.title;
        this.updateParentModel?.({}, true, true);
        if (title == 'Sign Now') {
          this.dialogService.openDialog(
            SuccessModalComponent,
            '50%',
            {
              screenType: 'Sign Now',
              title: 'Digital sign has been successfully recorded!',
            },
            true,
            '',
          );
          this.saveSignature(false);
          this.cdr.markForCheck();
        }
      }
    });
  }

  fetchSignature() {
    this.branchService.fetchSignImage(this.originationId).subscribe((res) => {
      this.imageUrl = res?.data?.signatureInfo?.fileUrl;
      this.buttonTitle = 'Sign Now';
      this.signatureId = res?.data?.signatureInfo?.signatureId;
      this.updateParentModel?.({}, true, true);
    });
  }

  fetchOfferIssueSign() {
    this.branchService
      .getOfferIssueSign(this.originationId)
      .subscribe((res) => {
        this.imageUrl = res?.data?.signatureInfo?.fileUrl;
        this.buttonTitle = 'Sign Now';
        this.signatureId = res?.data?.signatureInfo?.signatureId;
        this.updateParentModel?.({}, true, true);
      });
  }

  viewSignData(title: string) {
    this.branchService.getEditSign.subscribe((resp: any) => {
      const sign = resp;
      if (sign) {
        this.imageUrl = resp?.fileUrl;
        this.signatureId = resp?.signatureId;
      }
    });
    const dialogRef = this.dialog.open(SignSummaryComponent, {
      width: '50%',
      height: 'auto',
      disableClose: true,
      data: { imageUrl: this.imageUrl, title: title },
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data == 'edited') {
        this.updateParentModel?.({}, true, true);
        this.addDetalis(title);
      }
      // this.saveSignature(false);
    });
  }

  saveSignature(goNext: boolean) {
    const category = this.sessionStorageService.getCategory();
    if (goNext && this.signatureId) {
      if (category == 'Lending' && this.screenInfo?.screenValue == 'O1APPD') {
        this.updateParentModel?.({ goNext: true }, true);
        this.generatePdf();
      } else this.updateParentModel?.({ goNext: true }, true, true);
      return;
    }
    if (category == 'Lending' && this.screenInfo?.screenValue == 'O1APPD')
      this.saveIssuerSignature();
    else this.saveCustomerSignature();
  }

  saveCustomerSignature() {
    const signPayload = {
      customerStagingId: this.sessionStorageService.getStageIdList()?.[0],
      signatureId: [this.signatureId],
    };
    this.branchService.saveDigitalSignDetails(signPayload).subscribe(() => {
      //todo
    });
  }

  saveIssuerSignature() {
    if (!this.screenInfo?.screenCode) return;

    const payload = {
      originationId: this.originationId,
      signatureId: this.signatureId,
      screenCode: this.screenInfo.screenCode,
    };
    this.branchService.saveIssuerSignature(payload).subscribe(() => {
      //todo
    });
  }

  generatePdf() {
    this.branchService
      .downloadOfferletter(this.originationId)
      .subscribe((res: any) => {
        const file = new Blob([res], { type: 'application/pdf' });
        this.share(file);
      });
  }

  share(file: any) {
    const pdfFile = new File([file], 'Offer Letter.pdf', {
      type: 'application/pdf',
    });
    const formData = new FormData();
    formData.append(
      'subject',
      `Loan Offer Letter ${moment(new Date()).format('DD-MM-YYYY')}`,
    );
    formData.append(
      'body',

      `
Dear ${
        this.sessionStorageService.getCustomerName()?.length
          ? this.sessionStorageService.getCustomerName()[0]
          : 'Vikas'
      },\n 
We are pleased to inform you that your loan application has been processed and approved. 
Attached to this email, you will find the offer letter for the loan you have applied for. 
Here are the details of your loan:\n
 Applicant Name: ${
   this.sessionStorageService.getCustomerName()?.length
     ? this.sessionStorageService.getCustomerName()[0]
     : 'Vikas'
 }\n 
 Loan Amount: 100,000\n
 Tenure: 5 Years 0 Months 0 Days\n
 Interest Rate: 10.1\n
 Reference Number: ${this.sessionStorageService.getReferenceNo()}\n
Please review the attached offer letter carefully. If you have any questions or need further 
assistance, feel free to contact us. \n
Thank you for choosing our services. \n
      ${
        environment.microServiceURL
      }?code=${this.tokenStorageService.getToken()}&originationId=${
        this.originationId
      }&route=offer-letter`,
    );
    formData.append(
      'to',
      JSON.parse(this.sessionStorageService.getPrimaryEmail()),
    );
    formData.append('filePath', pdfFile, pdfFile.name);
    this.emailService.triggerTransactionEmail(formData).subscribe();
  }

  sendEmail() {
    //Send email to be done from service side now removing ui implementation by Abhilash Kar
    const body = `Dear ${this.customerName},\n
Please use the link below to complete your e-signature for your application:\n
      
${environment.microServiceURL}?originationId=${
      this.originationId
    }&type=e-sign&code=${this.tokenStorageService.getToken()}&route=dob-verification&screenCode=${
      this.screenInfo?.screenCode
    }&processCycleCode=${this.sessionStorageService.getProcessCycleCode()}\n
      
If you need assistance, feel free to contact us.\n

Thank you.`;
    const to =
      this.screenInfo?.screenValue == 'O1APPD'
        ? this.currentUser?.email
        : this.sessionStorageService.getPrimaryEmail();
    const formData = new FormData();
    formData.append('subject', 'Complete Your E-Signature');
    formData.append('body', body);

    formData.append('to', to);
    this.emailService.triggerTransactionEmail(formData).subscribe(() => {
      this.branchService.saveSignLater(this.originationId).subscribe((res) => {
        if (res?.statusCode == 200) {
          // this.updateParentModel({ goNext: true, signLater: true }, true);
          const dialogData = {
            screenType: 'Sign Later',
            title: 'Sign Link on your Email !',
            desc: `An email has been send to ${res?.data?.email} with the sign link.`,
            imgUrl: 'assets/images/email.svg',
          };
          this.dialogService
            .openDialog(SuccessModalComponent, '50%', dialogData, true, '')
            .subscribe(() => {
              this.updateParentModel?.({}, true);
            });
        }
      });
    });
  }
}
