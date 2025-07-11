import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'app/shared/services/common-service/common.service';

@Component({
  selector: 'app-fingerprint-scan',
  templateUrl: './fingerprint-scan.component.html',
  styleUrls: ['./fingerprint-scan.component.scss'],
})
export class FingerprintScanComponent {
  isScanned: boolean = false;
  isFailed: boolean = false;
  fingerprintData: string | undefined;
  templateBase64: any;

  constructor(
    private dialogRef: MatDialogRef<FingerprintScanComponent>,
    private commonService: CommonService,
  ) {}

  closeClick() {
    this.dialogRef.close({ message: 'close' });
  }

  captureFingerprint() {
    this.commonService.CallingSGIFPCapture().subscribe((res: any) => {
      if (res?.ErrorCode == 0) {
        this.fingerprintData = 'data:image/bmp;base64,' + res?.BMPBase64;
        (this.templateBase64 = res?.TemplateBase64), (this.isScanned = true);
        this.isFailed = false;
      } else {
        this.isScanned = false;
        this.isFailed = true;
      }
    });
  }

  done() {
    var data = this.fingerprintData;
    this.dialogRef.close({
      message: 'Confirm',
      image: data,
      isScanned: this.isScanned,
      templateBase64: this.templateBase64,
    });
  }
}
