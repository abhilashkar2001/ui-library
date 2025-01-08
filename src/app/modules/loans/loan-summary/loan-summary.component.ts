import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from 'app/shared/components/image-dialog/image-dialog.component';
import { SavingsSubmitDialogComponent } from 'app/shared/components/savings-submit-dialog/savings-submit-dialog.component';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { OpenAccountService } from 'app/shared/services/open-service/open-account.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { TokenStorageService } from 'app/shared/token-storage.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-loan-summary',
  templateUrl: './loan-summary.component.html',
  styleUrls: ['./loan-summary.component.scss'],
})
export class LoanSummaryComponent implements OnInit, OnChanges {
  @Output() backEvent: EventEmitter<any> = new EventEmitter();
  @Output() CustomSubmit: EventEmitter<any> = new EventEmitter();
  dialogsaveRef!: MatDialogRef<SavingsSubmitDialogComponent>;
  @Input() updateParentModel: ((value: Partial<any>) => void) | any;
  stepperTitle: any;
  loanSummaryDetails: any;
  @Input() loanSummary: any;
  endPoints = environment.microServiceURL;
  currencySymboll = '₹';
  otherUserInfo: any;
  personalDetails: any;
  checkListDoc: any[] = [];
  @Input() mobileVerifyInfo: any;

  constructor(
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private loanService: LoanService,
    private openAccountService: OpenAccountService,
    private tokenStore: TokenStorageService,
    private sessionStorageService: SessionStorageService,
  ) {}

  ngOnInit(): void {
    this.otherUserInfo = this.tokenStore.getUserOtherInfo();
    this.getLoanSummary().then(() => {
      this.getOriginationMasterData();
      this.getCheckListDoc();
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.loanSummaryDetails = changes['loanSummary']?.currentValue;
  }
  getCheckListDoc() {
    const originationId = this.sessionStorageService.getOriginationId();
    this.loanService
      .getSavedChecklist(
        Number(originationId),
        String(this.sessionStorageService.getOtherDocScreenCode),
        Number(this.sessionStorageService.getCurrentStage),
      )
      .subscribe((resp) => {
        if (resp?.statusCode === 200) {
          this.checkListDoc = resp.data.filter(
            (item: any) => item.docInfoModel,
          );
          this.cdr.detectChanges();
        }
      });
  }

  getLoanSummary() {
    return new Promise((resolve) => {
      const originationId = this.sessionStorageService.getOriginationId();
      this.loanService
        .getLoanSummary(originationId)
        .subscribe((response: any) => {
          this.loanSummaryDetails = response.data;
          resolve('');
        });
    });
  }

  getOriginationMasterData() {
    const originationId = this.sessionStorageService.getOriginationId();
    this.loanService
      .getOriginationMaster(originationId)
      .subscribe((resp: any) => {
        if (resp?.statusCode == 200 && resp?.data) {
          this.personalDetails = resp?.data?.[0]?.customerInfo;
        }
      });
  }

  onVerify() {
    this.updateParentModel({ updateMasterSave: false });
    this.CustomSubmit.emit();
    this.openAccountService.setData(this.loanSummaryDetails);
  }

  onBack() {
    this.backEvent.emit();
  }
  getFileUrl(url: any) {
    if (url.includes('https')) {
      return 'assets/images/account-img1.png';
    } else {
      return `${this.endPoints}${url}`;
    }
  }

  checkDisbursementType() {
    if (
      this.loanSummaryDetails?.disbursementDetails?.disbursementTypeValue !=
        null &&
      this.loanSummaryDetails?.disbursementDetails?.disbursementTypeValue
        ?.toLowerCase()
        ?.includes('account')
    )
      return true;
    else return false;
  }

  viewFiles(imageUrl: any, imageName: any): void {
    console.log(imageName);
    this.dialog.open(ImageDialogComponent, {
      data: {
        imageUrl,
        imageName: imageName.fileName,
      },
      width: '900px',
      height: '560px',
      panelClass: 'imageViewDialog',
    });
  }
}
