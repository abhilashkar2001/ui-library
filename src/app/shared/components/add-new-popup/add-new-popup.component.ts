import { Component, Inject, Input, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-add-new-popup",
  templateUrl: "./add-new-popup.component.html",
  styleUrls: ["./add-new-popup.component.scss"],
})
export class AddNewPopupComponent implements OnInit {
  checkToggle: boolean = false;
  templateName: string = "";
  isSaveTemplate: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<AddNewPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.isSaveTemplate = this.data?.isSaveTemplate;
  }
  customerToggle(event) {
    this.checkToggle = event;
  }
  onSubmit() {
    console.log(this.templateName);
    this.dialogRef.close({
      templateName: this.templateName,
    });
  }

  onBack() {
    this.dialogRef.close();
  }
}
