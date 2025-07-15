import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountSignaturePopupComponent } from './signature-popup/signature-popup.component';

@Component({
  selector: 'app-digital-signature',
  templateUrl: './digital-signature.component.html',
  styleUrls: ['./digital-signature.component.scss'],
})
export class AccountDigitalSignatureComponent {
  signature: any;
  constructor(private dialog: MatDialog) {}

  openSignPopup() {
    const dialogRef = this.dialog.open(AccountSignaturePopupComponent, {
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
