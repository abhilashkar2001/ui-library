import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-add-new-popup",
  templateUrl: "./add-new-popup.component.html",
  styleUrls: ["./add-new-popup.component.scss"]
})
export class AddNewPopupComponent implements OnInit {
  checkToggle: boolean = false;
  templateName: string = "";
  isSaveTemplate: boolean = false;
  templateDetails = [
    {
      templateName: "rohit_template",
      date: "4 Aug 2024",
      applicant: "Rohit Sharma",
      type: "Bg Issuance"
    },
    {
      templateName: "hardik_template",
      date: "4 Aug 2024",
      applicant: "Hardik Pandya",
      type: "Bg Issuance"
    }
  ];
  constructor(
    private dialogRef: MatDialogRef<AddNewPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.isSaveTemplate = this.data?.isSaveTemplate;
  }
  customerToggle(event: any) {
    this.checkToggle = event;
  }
  onSubmit() {
    console.log(this.templateName);
    this.dialogRef.close({
      templateName: this.templateName
    });
  }

  onBack() {
    this.dialogRef.close();
  }
}
