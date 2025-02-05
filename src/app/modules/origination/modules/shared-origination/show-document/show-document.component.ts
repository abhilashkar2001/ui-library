import { Component, Input } from '@angular/core';
import { environment } from 'environments/environment';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-show-document',
  templateUrl: './show-document.component.html',
  styleUrls: ['./show-document.component.scss'],
})
export class ShowDocumentComponent {
  @Input() document: any;
  endPoints = environment.microServiceURL;
  constructor(private dialog: MatDialog) {}

  getFileUrl(url: any) {
    if (url.includes('https')) {
      return 'assets/images/account-img1.png';
    } else {
      if (url.endsWith('pdf') || url.endsWith('xlsx')) {
        return 'assets/images/file_icon.svg';
      } else return `${this.endPoints}${url}`;
    }
  }
  viewFiles(imageUrl: any, imageName: any): void {
    console.log(imageName);
    this.dialog.open(ImageDialogComponent, {
      data: {
        imageUrl,
        imageName: imageName.fileName,
        fileInfo: imageName,
      },
      width: '60%',
      height: '560px',
      panelClass: 'imageViewDialog',
    });
  }
}
