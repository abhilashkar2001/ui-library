import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-selection',
  templateUrl: './account-selection.component.html',
  styleUrls: ['./account-selection.component.scss'],
})
export class AccountSelectionComponent {
  constructor(
    private dialogRef: MatDialogRef<AccountSelectionComponent>,
    private router: Router,
  ) {}

  selectAccountType(type: string) {
    this.dialogRef.close();
    this.router.navigate(['create-account/stages'], {
      queryParams: { type: type },
    });
    console.log(type);
  }
}
