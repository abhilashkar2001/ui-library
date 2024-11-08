import { Component, Inject, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from "@angular/material/legacy-dialog";
@Component({
  selector: "app-new-error-popup",
  templateUrl: "./new-error-popup.component.html",
  styleUrls: ["./new-error-popup.component.scss"],
})
export class NewErrorPopupComponent implements OnInit {
  errorDetails: any;
  imageUrl: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private location: Location,
    private dialogRef: MatDialogRef<NewErrorPopupComponent>
  ) {}

  ngOnInit() {
    this.errorDetails = this.data?.errPayload;
    this.errorImage(this.errorDetails.statusCode);
  }

  errorImage(code: any) {
    if (code == 400) {
      return (this.imageUrl = "assets/images/error/400-error.svg");
    } else if (code == 401) {
      return (this.imageUrl = "assets/images/error/401-error.svg");
    } else if (code == 403) {
      return (this.imageUrl = "assets/images/error/403-error.svg");
    } else if (code == 404) {
      return (this.imageUrl = "assets/images/error/404-not-found.svg");
    } else if (code == 500) {
      return (this.imageUrl = "assets/images/error/500-error.svg");
    } else if (code == 501) {
      return (this.imageUrl = "assets/images/error/501-error.svg");
    } else if (code == 503) {
      return (this.imageUrl = "assets/images/error/503-error.svg");
    } else if (code == 504) {
      return (this.imageUrl = "assets/images/error/504-error.svg");
    } else if (code == 505) {
      return (this.imageUrl = "assets/images/error/505-error.svg");
    } else {
      return (this.imageUrl = "assets/images/error/500-error.svg");
    }
  }

  back(): void {
    this.dialogRef.close();
    // this.location.back();
  }
}
