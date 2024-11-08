import { HttpClient } from "@angular/common/http";
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
  isPdfType: boolean = false;
  fileUrl: string = "";
  dataLocalUrl: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogref: MatDialogRef<ImageDialogComponent>,
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fileUrl = environment.microServiceURL + this.data.imageUrl;
    this.formatFile();
  }

  formatFile() {
    console.log(this.data.fileInfo);
    if (this.data.fileInfo.fileType == "application/pdf") {
      this.isPdfType = true;
      this.pdfFormat();
    } else {
      this.isPdfType = false;
    }
    // console.log(this.data);
  }
  pdfFormat() {
    this.http.get(this.fileUrl, { responseType: "blob" }).subscribe(
      (response: Blob) => {
        const fileData = new Blob([response], { type: "application/pdf" });
        this.dataLocalUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          window.URL.createObjectURL(fileData)
        );
      },
      (error) => {
        console.error("Error fetching PDF:", error);
      }
    );
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
