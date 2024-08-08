import { Component, Inject, Input, OnInit, Optional } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { DownloadService } from "app/shared/services/download.service";

@Component({
  selector: "app-pdf-viewer",
  templateUrl: "./pdf-viewer.component.html",
  styleUrls: ["./pdf-viewer.component.scss"]
})
export class PdfViewerComponent implements OnInit {
  @Input() fileName: string;
  @Input() fileUrl: string;
  dataLocalUrl;

  constructor(
    private domSanitizer: DomSanitizer,
    private downloadService: DownloadService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.fileUrl = data?.fileUrl;
    this.fileName = data?.fileName;
  }

  ngOnInit(): void {
    this.getFile();
  }

  getFile() {
    this.downloadService.fetchFile(this.fileUrl).subscribe((res) => {
      const blob = new Blob([res], { type: "application/pdf" });
      this.dataLocalUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
        window.URL.createObjectURL(blob)
      );
      this.dataLocalUrl.changingThisBreaksApplicationSecurity =
        this.dataLocalUrl.changingThisBreaksApplicationSecurity + "#toolbar=0";
    });
  }

  download() {
    this.downloadService.saveFile(this.fileUrl, this.fileName);
  }
}
