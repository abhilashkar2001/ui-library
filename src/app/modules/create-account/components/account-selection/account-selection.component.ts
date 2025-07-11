import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

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
  ) {}

  selectAccountType(type: string) {
    this.dialogRef.close();
    localStorage.setItem('account-type', type);
    localStorage.setItem('Category', this.data);
    this.router.navigate(['loan/login']);
  }
}
