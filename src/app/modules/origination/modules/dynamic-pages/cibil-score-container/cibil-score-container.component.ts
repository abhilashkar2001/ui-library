import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { LoanService } from 'app/shared/services/net-loan-service/loan.service';
import { OpenAccountService } from 'app/shared/services/open-service/open-account.service';

@Component({
  selector: 'app-cibil-score-container',
  templateUrl: './cibil-score-container.component.html',
  styleUrls: ['./cibil-score-container.component.scss'],
})
export class CibilScoreContainerComponent {
  @Output() backEvent: EventEmitter<any> = new EventEmitter();
  @Output() confirmEvent: EventEmitter<any> = new EventEmitter();
  @Output() isDifferentMobileNumber: EventEmitter<any> = new EventEmitter();
  @Output() CustomSubmit = new EventEmitter<any>();
  @Input() updateParentModel: ((value: Partial<any>) => void) | any;
  @Input() createLoanAccountNumber: any;
  hideInfo = true;
  @ViewChild('consentDialog') consentDialog!: TemplateRef<any>;

  isDifferentMobile = false;
  showCibilScoreResult = false;
  selectedOption: 'different' | 'same' = 'same';
  optionalSteps: any;
  phone: any;
  showOtpSection: boolean | any;
  invalidOtp = false;
  otp: any;
  agreed = false;
  isOtpAllowed = false;

  constructor(
    private openAccountService: OpenAccountService,
    private dialog: MatDialog,
    private sessionStorageService: SessionStorageService,
    private loanService: LoanService,
  ) {}

  onBack() {
    this.backEvent.emit();
  }

  onBackCIBILScoreResult() {
    this.showCibilScoreResult = true;
  }

  onContinue() {
    this.openAccountService
      .verifyOtp({ mobile: this.phone, otp: this.otp })
      .subscribe((response: any) => {
        if (response.status === 401) {
          this.showCibilScoreResult = false;
          this.invalidOtp = true;
        } else if (response.status === 200) {
          this.invalidOtp = false;
          this.showCibilScoreResult = true;
        }
      });
  }

  onConfirmFromCibilScoreResult() {
    const payload = {
      originationId: this.sessionStorageService.getOriginationId(),
      screenCode: this.sessionStorageService.getCurrentScreenCode(),
      creditChecked: true,
    };
    this.loanService.saveTermsandCreditFields(payload).subscribe((res) => {
      if (res?.statusCode === 200) {
        this.updateParentModel({ updateMasterSave: false });
        this.CustomSubmit.emit();
      }
    });
  }

  onVerify() {
    this.confirmEvent.emit();
  }

  checkCobilConfim(event?: any) {
    this.phone = event?.phone;
    this.otp = event?.otp;
  }

  openDialog() {
    this.dialog.open(this.consentDialog, {
      width: '40%',
      height: '56%',
      panelClass: 'custom-dialog',
    });
  }
}
