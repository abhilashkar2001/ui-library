import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generate-pin',
  templateUrl: './generate-pin.component.html',
  styleUrls: ['./generate-pin.component.scss'],
})
export class GeneratePinComponent implements OnInit {
  @Output() pinGenerated: EventEmitter<any> = new EventEmitter();

  otp = '';
  otpAvailable = false;

  hideNewPin = true;
  hideConfPin = true;

  newPinConfig = this.createPinConfig(this.hideNewPin);
  confPinConfig = this.createPinConfig(this.hideConfPin);

  constructor(
    public dialogRef: MatDialogRef<GeneratePinComponent>,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Initialization logic if needed
  }

  /**
   * Creates a pin input configuration object.
   */
  private createPinConfig(isPasswordInput: boolean) {
    return {
      allowNumbersOnly: true,
      length: 4,
      isPasswordInput: isPasswordInput,
      disableAutoFocus: false,
      placeholder: '',
      inputStyles: {
        width: '80px',
        height: '80px',
      },
    };
  }

  /**
   * Toggles the visibility of the new PIN input field.
   */
  toggleNewPinView(): void {
    this.hideNewPin = !this.hideNewPin;
    this.newPinConfig = this.createPinConfig(this.hideNewPin);
  }

  /**
   * Toggles the visibility of the confirmation PIN input field.
   */
  toggleConfPinView(): void {
    this.hideConfPin = !this.hideConfPin;
    this.confPinConfig = this.createPinConfig(this.hideConfPin);
  }

  /**
   * Handles changes in the OTP input.
   */
  onOtpChange(otp: string): void {
    this.otp = otp;
    this.otpAvailable = this.otp.length >= 4;
  }

  cancel() {
    this.dialogRef.close();
  }

  /**
   * Submits the OTP and closes the dialog.
   */
  submit(): void {
    if (this.otpAvailable) {
      this.dialogRef.close({ pin: this.otp });
      this.router.navigate(['/user/card/credit-card/service/payment-summary']);
    }
  }
}
