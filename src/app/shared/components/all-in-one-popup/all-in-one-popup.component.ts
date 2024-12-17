import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-all-in-one-popup',
  templateUrl: './all-in-one-popup.component.html',
  styleUrls: ['./all-in-one-popup.component.scss'],
})
export class AllInOnePopupComponent implements OnInit {
  hide = true;
  confirmationForm!: FormGroup;
  remark: any = '';

  constructor(
    private dialogRef: MatDialogRef<AllInOnePopupComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }
  buildForm() {
    this.confirmationForm = this.fb.group({
      transactionPassword: [''],
      oneTimePassword: [''],
    });
  }

  submit() {
    // this.commonService.verifyOTP(payload).subscribe((res: any) => {
    // if (res.data !== "Invalid OTP") {
    this.dialogRef.close('verified');
    // } else {
    //   this.snack.open(res.message, "OK", {
    //     duration: 4000,
    //     verticalPosition: "top",
    //     horizontalPosition: "right",
    //   });
    // }
    // });
  }

  onRemarkConfirm() {
    this.dialogRef.close(this.remark);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
