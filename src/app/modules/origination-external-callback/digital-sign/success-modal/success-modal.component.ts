import { Component, Inject, OnInit, Optional } from "@angular/core";
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from "@angular/material/legacy-dialog";

@Component({
  selector: "app-success-modal",
  templateUrl: "./success-modal.component.html",
  styleUrls: ["./success-modal.component.scss"],
})
export class SuccessModalComponent implements OnInit {
  screenType: string;
  constructor(@Inject(MAT_DIALOG_DATA) public screenData: any) {}

  ngOnInit(): void {
    this.screenType = this.screenData.screenType;
  }
}
