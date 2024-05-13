import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ImageDialogComponent } from "app/shared/components/image-dialog/image-dialog.component";

@Component({
  selector: "app-loan-product-details",
  templateUrl: "./dynamic-product-details.component.html",
  styleUrls: ["./dynamic-product-details.component.scss"],
})
export class DynamicProductDetailsComponent implements OnInit {
  @Input() productInfo = [];
  @Input() dynamicKeyHelper = {};
  constructor(private dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.productInfo) {
      this.productInfo = changes.productInfo.currentValue;
    }
  }

  ngOnInit(): void {}

  opnDocument(imageUrl, doc: any) {
    const dialogRef = this.dialog.open(ImageDialogComponent, {
      data: {
        imageUrl,
        imageName: doc.documentNameValue ?? "document",
      },
      width: "900px",
      height: "560px",
      panelClass: "imageViewDialog",
    });
  }

  trackByIndex(index) {
    return index;
  }
}
