import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TermsConditionPopupComponent } from 'app/shared/components/terms-condition-popup/terms-condition-popup.component';

@Component({
  selector: 'app-terms-condition',
  templateUrl: './terms-condition.component.html',
  styleUrls: ['./terms-condition.component.scss'],
})
export class TermsConditionComponent {
  customerDetails: any = [
    {
      headerDef: 'customerName',
      headerCell: 'Name',
    },
    {
      headerDef: 'mobileNo',
      headerCell: 'Mobile No',
    },
    {
      headerDef: 'applicationDate',
      headerCell: 'Date',
    },
    {
      headerDef: 'loanAmount',
      headerCell: 'Loan Amount',
    },
  ];
  agreed = false;

  constructor(private dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(TermsConditionPopupComponent, {
      height: '80%',
      width: '50%',
      panelClass: 'custom-dialog',
    });
    dialogRef.afterClosed().subscribe((res: string) => {
      console.log(res);
      if (res == 'agree') this.agreed = true;
    });
  }
}
