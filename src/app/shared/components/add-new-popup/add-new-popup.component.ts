import { Component, Input, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-add-new-popup",
  templateUrl: "./add-new-popup.component.html",
  styleUrls: ["./add-new-popup.component.scss"],
})
export class AddNewPopupComponent implements OnInit {
  checkToggle: boolean = false;
  templateName: string = "";
  constructor(private dialogRef: MatDialogRef<AddNewPopupComponent>) {}

  ngOnInit(): void {}
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
