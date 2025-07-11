import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';
import { AccountSelectionComponent } from './components/account-selection/account-selection.component';
@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [RouterOutlet, MatDialogModule],
  template: `
    <button (click)="alertDialog()" class="confirm-button">Create Account</button>
    <router-outlet></router-outlet>
  `,
})
export class CreateAccountComponent {
  constructor(private dialog: MatDialog) { }

  alertDialog() {
    //@ts-ignore
    const dialogRef = this.dialog.open(AccountSelectionComponent,
      {
        // width: '100%',
        // height: '90%',
        // backdropClass: 'confirmDialogComponent',
        // hasBackdrop: true,
        disableClose: true
      });
  }
}
