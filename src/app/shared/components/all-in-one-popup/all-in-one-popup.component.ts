import { Component, Inject, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CommonService } from "app/shared/services/common-service/common.service";
import { SuccessPopupComponent } from "../success-popup/success-popup.component";
import { TokenStorageService } from "app/shared/token-storage.service";

@Component({
  selector: "app-all-in-one-popup",
  templateUrl: "./all-in-one-popup.component.html",
  styleUrls: ["./all-in-one-popup.component.scss"],
})
export class AllInOnePopupComponent implements OnInit {
  hide: boolean = true;
  confirmationForm: FormGroup;
  remark: any = "";

  constructor(
    private dialogRef: MatDialogRef<AllInOnePopupComponent>,
    private fb: FormBuilder,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }
  buildForm() {
    this.confirmationForm = this.fb.group({
      transactionPassword: [""],
      oneTimePassword: [""],
    });
  }

  submit() {
    let payload = {
      mobile: this.tokenStorageService.getUser()?.mobile,
      otp: this.confirmationForm.value.oneTimePassword,
    };
    // this.commonService.verifyOTP(payload).subscribe((res: any) => {
    // if (res.data !== "Invalid OTP") {
    this.dialogRef.close("verified");
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
