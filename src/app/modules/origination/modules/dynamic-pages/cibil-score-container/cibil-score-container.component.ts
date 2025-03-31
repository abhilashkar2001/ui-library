import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
  otpSent = false;
  invalidOtp = false;
  otp: any;
  agreed = false;
  isOtpAllowed = false;

  constructor(
    private openAccountService: OpenAccountService,
    private dialog: MatDialog,
  ) {}

  onBack() {
    this.backEvent.emit();
  }

  onBackCIBILScoreResult() {
    this.showCibilScoreResult = true;
  }

  onContinue() {
    if (this.selectedOption === 'different') {
      this.openAccountService
        .verifyOtp({ mobile: this.phone, otp: this.otp })
        .subscribe((response: any) => {
          if (response.statusCode === 401) {
            this.showCibilScoreResult = false;
            this.invalidOtp = true;
          } else if (response.statusCode === 200) {
            this.invalidOtp = false;
            this.showCibilScoreResult = true;
          }
        });
    } else this.showCibilScoreResult = true;
  }

  onConfirmFromCibilScoreResult() {
    this.updateParentModel({ updateMasterSave: false });
    this.CustomSubmit.emit();
  }

  onVerify() {
    this.confirmEvent.emit();
  }

  checkCobilConfim() {
    if (this.selectedOption === 'same') return false;
    else {
      if (!(this.isOtpAllowed && this.agreed)) return true;
      else return false;
    }
  }

  openDialog() {
    this.dialog.open(this.consentDialog, {
      width: '40%',
      height: '56%',
      panelClass: 'custom-dialog',
    });
  }
}
