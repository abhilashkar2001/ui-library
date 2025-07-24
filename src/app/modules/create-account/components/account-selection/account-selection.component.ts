import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

@Component({
  selector: 'app-account-selection',
  templateUrl: './account-selection.component.html',
  styleUrls: ['./account-selection.component.scss'],
})
export class AccountSelectionComponent {
  constructor(
    private dialogRef: MatDialogRef<AccountSelectionComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private router: Router,
    private sessionStorageService: SessionStorageService,
  ) {}

  selectAccountType(type: string) {
    this.dialogRef.close();
    localStorage.setItem('account-type', type);
    this.sessionStorageService.setItem('category', this.data?.category);
    this.sessionStorageService.setItem('basisClass', this.data.basisClass);
    this.router.navigate(['loan/login']);
  }
}
