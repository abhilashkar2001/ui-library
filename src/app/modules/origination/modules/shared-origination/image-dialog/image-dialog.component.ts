import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { DomSanitizer } from '@angular/platform-browser';
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
    // private sanitizer: DomSanitizer,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.fileUrl = this.data.uuid;
    this.formatFile();
    this.filePreview = this.fileUrl;
  }

  formatFile() {
    if (
      this.data.imageUrl.includes('pdf') ||
      this.data?.fileInfo?.fileUrl?.includes('pdf') ||
      this.data?.imageName.includes('pdf')
    ) {
      this.isPdfType = true;
      this.filePreview = this.fileUrl;
      this.pdfFormat();
    } else {
      this.isPdfType = false;
    }
    // console.log(this.data);
  }
  pdfFormat() {
    this.http
      .get(
        `${environment.microServiceURL}/dms/download?uuid=${this.data.uuid}`,
        { responseType: 'blob' },
      )
      .subscribe(
        (response: Blob) => {
          const fileData = new Blob([response], { type: 'application/pdf' });
          this.filePreview = window.URL.createObjectURL(fileData);
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
