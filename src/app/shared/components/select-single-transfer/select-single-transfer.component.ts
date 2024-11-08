import { Component, OnInit } from "@angular/core";
import { MatLegacyDialogRef as MatDialogRef } from "@angular/material/legacy-dialog";

@Component({
  selector: "app-select-single-transfer",
  templateUrl: "./select-single-transfer.component.html",
  styleUrls: ["./select-single-transfer.component.scss"],
})
export class SelectSingleTransferComponent implements OnInit {
  checkToggle: boolean = true;

  constructor(private dialogRef: MatDialogRef<SelectSingleTransferComponent>) {}

  ngOnInit(): void {}

  customerToggle(event) {
    this.checkToggle = event;
  }
  onSubmit() {
    this.dialogRef.close(this.checkToggle);
  }

  onBack() {
    this.dialogRef.close("Cancel");
  }
}
