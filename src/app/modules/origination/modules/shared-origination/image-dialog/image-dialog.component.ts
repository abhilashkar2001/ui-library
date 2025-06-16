import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss'],
})
export class ImageDialogComponent implements OnInit {
  imageUrl: string | any;
  endPoint = environment.microServiceURL;
  isPdfType = false;
  fileUrl = '';
  dataLocalUrl: any;
  filePreview: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogref: MatDialogRef<ImageDialogComponent>,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.fileUrl = this.data.imageUrl;

    this.formatFile();

    console.log('File URL:', this.fileUrl);
    this.filePreview = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.fileUrl,
    );
    console.log(this.filePreview);
  }

  formatFile() {
    console.log(this.data.fileInfo);
    if (
      this.data.imageUrl.includes('pdf') ||
      this.data?.fileInfo?.fileUrl?.includes('pdf')
    ) {
      this.isPdfType = true;
      this.fileUrl = this.data.pdfUrl || this.data?.imageUrl;
      this.pdfFormat();
    } else {
      this.isPdfType = false;
    }
    // console.log(this.data);
  }

  pdfFormat() {
    console.log(this.fileUrl);
    this.http.get(this.fileUrl, { responseType: 'blob' }).subscribe(
      (response: Blob) => {
        const fileData = new Blob([response], { type: 'application/pdf' });
        this.dataLocalUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          window.URL.createObjectURL(fileData),
        );
        console.log(this.dataLocalUrl);
      },
      (error) => {
        console.error('Error fetching PDF:', error);
      },
    );
  }

  closeDialog() {
    this.dialogref.close();
  }
}
