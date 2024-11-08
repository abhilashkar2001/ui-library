import { Location } from "@angular/common";
import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";
import { Router } from "@angular/router";
import { ImageDialogComponent } from "app/shared/components/image-dialog/image-dialog.component";
import { PdfViewerComponent } from "app/shared/components/pdf-viewer/pdf-viewer.component";

@Component({
  selector: "app-loan-product-details",
  templateUrl: "./dynamic-product-details.component.html",
  styleUrls: ["./dynamic-product-details.component.scss"]
})
export class DynamicProductDetailsComponent implements OnInit {
  @Input() productInfo = [];
  @Input() dynamicKeyHelper = {};
  constructor(
    private dialog: MatDialog,
    private location: Location,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.productInfo) {
      this.productInfo = changes.productInfo.currentValue;
    }
  }

  ngOnInit(): void {}

  opnDocument(imageUrl, doc: any) {
    console.log(imageUrl, doc, "kkk");

    if (doc.fileUrl.includes("pdf")) {
      this.dialog.open(PdfViewerComponent, {
        data: {
          fileUrl: doc.fileUrl,
          imageName: doc.documentNameValue ?? doc?.fileName
        },
        width: "60%",
        height: "560px",
        panelClass: "imageViewDialog"
      });
    } else {
      const dialogRef = this.dialog.open(ImageDialogComponent, {
        data: {
          imageUrl,
          imageName: doc.documentNameValue ?? "document"
        },
        width: "900px",
        height: "560px",
        panelClass: "imageViewDialog"
      });
    }
  }

  trackByIndex(index) {
    return index;
  }

  /**
   * ViewFile
   */
  public viewUploadedFile(file: any): void {
    // if (file?.fileType?.toLowerCase() === "pdf") {
    const url = this.location.prepareExternalUrl(
      this.router.serializeUrl(
        this.router.createUrlTree(["/origination/pdf-viewer"])
      )
    );
    const pdfViewerUrl = `${url}?fileUrl=${encodeURIComponent(
      file.fileUrl
    )}&fileName=${encodeURIComponent(file.fileName)}`;
    window.open(pdfViewerUrl, "_blank");
    // } else {
    //   console.log("File type is not PDF:", file.fileType);
    // }
  }
}
