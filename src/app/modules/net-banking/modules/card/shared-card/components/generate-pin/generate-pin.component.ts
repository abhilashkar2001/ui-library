import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-generate-pin",
  templateUrl: "./generate-pin.component.html",
  styleUrls: ["./generate-pin.component.scss"],
})
export class GeneratePinComponent implements OnInit {
  @Output() pinGenerated: EventEmitter<any> = new EventEmitter();

  otp: string = "";
  otpAvailable: boolean = false;

  hideNewPin: boolean = true;
  hideConfPin: boolean = true;

  newPinConfig = this.createPinConfig(this.hideNewPin);
  confPinConfig = this.createPinConfig(this.hideConfPin);

  constructor(public dialogRef: MatDialogRef<GeneratePinComponent>) {}

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
      placeholder: "",
      inputStyles: {
        width: "80px",
        height: "80px",
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

  /**
   * Submits the OTP and closes the dialog.
   */
  submit(): void {
    if (this.otpAvailable) {
      this.dialogRef.close({ pin: this.otp });
    }
  }
}
