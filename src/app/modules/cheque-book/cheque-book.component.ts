import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';
import { AccountSelectionComponent } from '../create-account/components/account-selection/account-selection.component';
@Component({
  selector: 'app-cheque-book',
  standalone: true,
  imports: [RouterOutlet, MatDialogModule],

  template: `<router-outlet></router-outlet> `,
})
export class ChequeBookComponent {
  constructor(private dialog: MatDialog) {}

  alertDialog() {
    //@ts-ignore
    const dialogRef = this.dialog.open(AccountSelectionComponent, {
      // width: '100%',
      // height: '90%',
      // backdropClass: 'confirmDialogComponent',
      // hasBackdrop: true,
      disableClose: true,
    });
  }

  ngOnDestroy() {
    localStorage.removeItem('account-type');
  }
}
