import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-credit-bureau',
  templateUrl: './credit-bureau.component.html',
  styleUrls: ['./credit-bureau.component.scss'],
})
export class CreditBureauComponent {
  otp = new FormControl('', [Validators.required]);
  showOtpSection = false;

  @ViewChild('consentDialog') consentDialog!: TemplateRef<any>;
  constructor(private dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(this.consentDialog, {
      width: '40%',
      height: '40%',
      panelClass: 'custom-dialog',
    });
  }
}
