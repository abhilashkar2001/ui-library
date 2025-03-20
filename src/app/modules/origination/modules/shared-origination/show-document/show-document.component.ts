import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { PdfViewerComponent } from 'app/shared/components/pdf-viewer/pdf-viewer.component';

@Component({
  selector: 'app-show-document',
  templateUrl: './show-document.component.html',
  styleUrls: ['./show-document.component.scss'],
})
export class ShowDocumentComponent implements OnInit {
  @Input() document: any;
  endPoints = environment.microServiceURL;
  filePreview: any;
  constructor(
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
  ) {}
  ngOnInit(): void {
    this.filePreview = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.endPoints + this.document?.fileUrl,
    );
  }

  getFileUrl(url: any) {
    if (url.includes('https')) {
      return 'assets/images/account-img1.png';
    } else {
      if (url.endsWith('pdf') || url.endsWith('xlsx')) {
        return 'assets/images/file_icon.svg';
      } else
        return this.sanitizer.bypassSecurityTrustUrl(`${this.endPoints}${url}`);
    }
  }
  viewFiles(imageUrl: any, imageName: any): void {
    console.log(imageName);
    if (imageName?.fileType?.includes('pdf')) {
      this.dialog.open(PdfViewerComponent, {
        data: {
          fileUrl: imageName.fileUrl,
          imageName: imageName.fileName,
          fileInfo: imageName,
        },
        width: '60%',
        height: '560px',
        panelClass: 'imageViewDialog',
      });
    } else {
      this.dialog.open(ImageDialogComponent, {
        data: {
          imageUrl: this.endPoints + imageUrl,
          imageName: imageName.fileName,
          fileInfo: imageName,
        },
        width: '60%',
        height: '560px',
        panelClass: 'imageViewDialog',
      });
    }
  }
}
