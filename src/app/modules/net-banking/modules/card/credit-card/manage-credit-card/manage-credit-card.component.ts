import { Component, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { DrawerConstant } from '../../../shared-corporate-banking/custom-drawer/custom-drawer.constant';

@Component({
  selector: 'app-manage-credit-card',
  templateUrl: './manage-credit-card.component.html',
  styleUrls: ['./manage-credit-card.component.scss'],
})
export class ManageCreditCardComponent {
  tabs = DrawerConstant.cardMenuTabs;
  constructor(
    private router: Router,
    @Optional() private dialogRef: MatDialogRef<ManageCreditCardComponent>,
  ) {}

  route(route: string) {
    this.router.navigate([route]).then((_) => {
      if (this.dialogRef) this.dialogRef.close();
    });
  }
}
