import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

@Component({
  selector: 'app-success-popup',
  templateUrl: './success-popup.component.html',
  styleUrls: ['./success-popup.component.scss'],
})
export class SuccessPopupComponent implements OnInit {
  depositId: any;
  constructor(
    private dialogRef: MatDialogRef<SuccessPopupComponent>,
    private sessionStorageService: SessionStorageService,
  ) {}

  ngOnInit(): void {
    this.depositId = this.sessionStorageService.getDepositOriginationId();
  }
  done() {
    this.dialogRef.close();
    window.close();
  }
}
