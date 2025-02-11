import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PdfViewerComponent } from 'app/shared/components/pdf-viewer/pdf-viewer.component';
import { ImageDialogComponent } from '../../../shared-origination/image-dialog/image-dialog.component';

@Component({
  selector: 'app-loan-product-details',
  templateUrl: './dynamic-product-details.component.html',
  styleUrls: ['./dynamic-product-details.component.scss'],
})
export class DynamicProductDetailsComponent implements OnChanges {
  @Input() productInfo: any = [];
  @Input() dynamicKeyHelper: any = {};
  constructor(private dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges | any): void {
    if (changes.productInfo) {
      this.productInfo = changes.productInfo.currentValue;
    }
  }

  opnDocument(imageUrl: any, doc: any) {
    if (doc.fileUrl.includes('pdf')) {
      this.dialog.open(PdfViewerComponent, {
        data: {
          fileUrl: doc.fileUrl,
          imageName: doc.documentNameValue ?? doc?.fileName,
        },
        width: '60%',
        height: '560px',
        panelClass: 'imageViewDialog',
      });
    } else {
      this.dialog.open(ImageDialogComponent, {
        data: {
          imageUrl,
          imageName: doc.documentNameValue ?? 'document',
        },
        width: '900px',
        height: '560px',
        panelClass: 'imageViewDialog',
      });
    }
  }

  trackByIndex(index: any) {
    return index;
  }
}
