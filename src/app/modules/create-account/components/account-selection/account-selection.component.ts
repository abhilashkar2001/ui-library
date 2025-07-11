import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-selection',
  templateUrl: './account-selection.component.html',
  styleUrls: ['./account-selection.component.scss'],
})
export class AccountSelectionComponent {
  selectAccountType(type: string) {
    this.dialogRef.close();
    localStorage.setItem('account-type', type);
    this.router.navigate(['create-account/login']);
  }
}
