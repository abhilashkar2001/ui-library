import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { environment } from "environments/environment";

@Component({
  selector: "app-image-dialog",
  templateUrl: "./image-dialog.component.html",
  styleUrls: ["./image-dialog.component.scss"],
})
export class ImageDialogComponent implements OnInit {
  imageUrl: string;
  endPoint = environment.microServiceURL;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogref: MatDialogRef<ImageDialogComponent>,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    console.log(this.data);
  }
  closeDialog() {
    this.dialogref.close();
  }
  getFileUrl(filePath: string) {
    const file = this.endPoint + filePath;
    let parseFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(file);
    return parseFileUrl;
  }
}
