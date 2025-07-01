import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SignaturePopupComponent } from 'app/shared/components/signature-popup/signature-popup.component';

@Component({
  selector: 'app-digital-signature',
  templateUrl: './digital-signature.component.html',
  styleUrls: ['./digital-signature.component.scss'],
})
export class DigitalSignatureComponent {
  constructor(private dialog: MatDialog) {}

  openSignPopup() {
    this.dialog.open(SignaturePopupComponent, {
      height: '80%',
      width: '50%',
      panelClass: 'custom-dialog',
    });
  }
}
