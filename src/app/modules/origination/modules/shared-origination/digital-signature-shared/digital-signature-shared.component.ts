import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SignatureSharedPopupComponent } from './signature-popup-shared/signature-popup.component';
// import { AccountSignaturePopupComponent } from './signature-popup/signature-popup.component';

@Component({
  selector: 'app-digital-signature-shared',
  templateUrl: './digital-signature-shared.component.html',
  styleUrls: ['./digital-signature-shared.component.scss'],
})
export class DigitalSignatureSharedComponent {
  signature: any;
  constructor(private dialog: MatDialog) {}

  openSignPopup() {
    const dialogRef = this.dialog.open(SignatureSharedPopupComponent, {
      height: '65%',
      width: '50%',
      panelClass: 'custom-dialog',
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      console.log(res);
    });
  }

  download() {}
}
